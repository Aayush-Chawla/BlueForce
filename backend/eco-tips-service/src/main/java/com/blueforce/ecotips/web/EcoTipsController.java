package com.blueforce.ecotips.web;

import com.blueforce.ecotips.model.EcoTip;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/eco-tips")
public class EcoTipsController {
    private final Map<String, EcoTip> tips = new ConcurrentHashMap<>();

    public EcoTipsController() {
        // seed a couple of tips for initial data
        EcoTip t1 = new EcoTip();
        t1.setId(UUID.randomUUID().toString());
        t1.setTitle("Bring a reusable bottle");
        t1.setContent("Reduce plastic waste by carrying a refillable water bottle.");
        t1.setCategory("waste-reduction");
        t1.setDifficulty("easy");
        t1.setImpact("medium");
        tips.put(t1.getId(), t1);

        EcoTip t2 = new EcoTip();
        t2.setId(UUID.randomUUID().toString());
        t2.setTitle("Use reef-safe sunscreen");
        t2.setContent("Protect marine life by choosing mineral sunscreens.");
        t2.setCategory("ocean-protection");
        t2.setDifficulty("easy");
        t2.setImpact("high");
        tips.put(t2.getId(), t2);
    }

    @GetMapping("/tips")
    public Map<String, Object> listTips(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "25") int limit) {
        List<EcoTip> all = new ArrayList<>(tips.values());
        int from = Math.min(page * limit, all.size());
        int to = Math.min(from + limit, all.size());
        List<EcoTip> items = all.subList(from, to);
        Map<String, Object> resp = new HashMap<>();
        resp.put("data", Map.of("items", items, "total", all.size(), "page", page, "limit", limit));
        return resp;
    }

    @PostMapping("/tips")
    public EcoTip create(@Valid @RequestBody EcoTip tip) {
        String id = UUID.randomUUID().toString();
        tip.setId(id);
        tips.put(id, tip);
        return tip;
    }

    @PutMapping("/tips/{id}")
    public ResponseEntity<EcoTip> update(@PathVariable String id, @Valid @RequestBody EcoTip tip) {
        EcoTip existing = tips.get(id);
        if (existing == null) return ResponseEntity.notFound().build();
        tip.setId(id);
        tips.put(id, tip);
        return ResponseEntity.ok(tip);
    }

    @DeleteMapping("/tips/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return tips.remove(id) != null ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/faqs")
    public Map<String, Object> listFaqs() {
        List<Map<String, String>> faqs = List.of(
                Map.of("id", "1", "question", "What is ocean protection?", "answer", "Practices that safeguard marine ecosystems.", "category", "Ocean Protection"),
                Map.of("id", "2", "question", "How to recycle properly?", "answer", "Rinse items and follow local guidelines.", "category", "Recycling")
        );
        return Map.of("data", Map.of("items", faqs));
    }

    @GetMapping("/quiz")
    public Map<String, Object> listQuiz() {
        List<Map<String, Object>> questions = List.of(
                Map.of("question", "Which bottle reduces waste most?", "options", List.of("Plastic", "Reusable Stainless Steel", "Glass single-use"), "correctAnswer", 1, "points", 10),
                Map.of("question", "Which sunscreen is reef-safe?", "options", List.of("Oxybenzone", "Octinoxate", "Zinc Oxide"), "correctAnswer", 2, "points", 10)
        );
        return Map.of("data", Map.of("items", questions));
    }
}




