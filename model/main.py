from __future__ import annotations

from typing import Dict

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from inference import get_model

app = FastAPI(title="BlueForce Waste Segregation Model", version="1.0.0")


@app.get("/health")
def health() -> Dict[str, str]:
	return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> JSONResponse:
	if not file:
		raise HTTPException(status_code=400, detail="file is required")
	try:
		file_bytes = await file.read()
		model = get_model()
		result = model.predict(file_bytes)
		return JSONResponse(
			content={
				"label": result.label,
				"score": result.score,
				"scores": result.all_scores,
			}
		)
	except Exception as exc:
		raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="0.0.0.0", port=8083, reload=False)

