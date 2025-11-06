from __future__ import annotations

import io
import json
from dataclasses import dataclass
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image
import torch
import open_clip


@dataclass
class PredictionResult:

	label: str
	score: float
	all_scores: Dict[str, float]


class WasteSegregationModel:

	def __init__(self, labels_config_path: str = "labels.json", model_name: str = "ViT-B-32", pretrained: str = "laion2b_s34b_b79k") -> None:
		with open(labels_config_path, "r", encoding="utf-8") as f:
			cfg = json.load(f)
		self.labels: List[str] = cfg["labels"]
		self.prompt_prefix: str = cfg.get("prompt_prefix", "a photo of")
		self.label_prompts: Dict[str, List[str]] = cfg.get("label_prompts", {})

		self.device: torch.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
		self.model, self.preprocess, self.tokenizer = open_clip.create_model_and_transforms(model_name, pretrained=pretrained, device=self.device)
		self.model.eval()

	@staticmethod
	def _load_image(file_bytes: bytes) -> Image.Image:
		return Image.open(io.BytesIO(file_bytes)).convert("RGB")

	def _build_text_prompts(self) -> Tuple[List[str], List[str]]:
		prompts: List[str] = []
		owners: List[str] = []
		for label in self.labels:
			candidates = self.label_prompts.get(label, [label])
			for c in candidates:
				prompts.append(f"{self.prompt_prefix} {c}")
				owners.append(label)
		return prompts, owners

	@torch.inference_mode()
	def predict(self, file_bytes: bytes) -> PredictionResult:
		image = self._load_image(file_bytes)
		text_prompts, owners = self._build_text_prompts()

		image_tensor = self.preprocess(image).unsqueeze(0).to(self.device)
		text_tokens = open_clip.tokenize(text_prompts).to(self.device)

		image_features = self.model.encode_image(image_tensor)
		text_features = self.model.encode_text(text_tokens)

		image_features = image_features / image_features.norm(dim=-1, keepdim=True)
		text_features = text_features / text_features.norm(dim=-1, keepdim=True)

		logit_scale = self.model.logit_scale.exp()
		logits_per_image = (logit_scale * image_features @ text_features.t()).squeeze(0)

		prompt_probs = torch.softmax(logits_per_image, dim=-1).detach().cpu().numpy()

		scores_by_label: Dict[str, float] = {label: 0.0 for label in self.labels}
		for prob, owner in zip(prompt_probs, owners):
			scores_by_label[owner] += float(prob)

		score_values = np.array(list(scores_by_label.values()), dtype=np.float64)
		total = float(score_values.sum())
		if total > 0:
			score_values = score_values / total
		for label, val in zip(self.labels, score_values.tolist()):
			scores_by_label[label] = float(val)

		best_label = max(scores_by_label.items(), key=lambda kv: kv[1])[0]
		return PredictionResult(label=best_label, score=scores_by_label[best_label], all_scores=scores_by_label)


_MODEL_INSTANCE: WasteSegregationModel | None = None


def get_model() -> WasteSegregationModel:
	global _MODEL_INSTANCE
	if _MODEL_INSTANCE is None:
		_MODEL_INSTANCE = WasteSegregationModel()
	return _MODEL_INSTANCE

