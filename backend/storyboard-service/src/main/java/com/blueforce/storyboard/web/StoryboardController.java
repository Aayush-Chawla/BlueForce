package com.blueforce.storyboard.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
public class StoryboardController {

    @GetMapping
    public Map<String, Object> list() {
        List<Map<String, Object>> items = List.of(
                Map.of(
                        "id", "1",
                        "title", "Community Beach Cleanup",
                        "content", "Volunteers collected 200kg of waste.",
                        "imageUrl", "",
                        "author", "BlueForce",
                        "date", LocalDate.now().toString()
                ),
                Map.of(
                        "id", "2",
                        "title", "School Eco Drive",
                        "content", "Students planted 50 saplings near the coastline.",
                        "imageUrl", "",
                        "author", "Eco Club",
                        "date", LocalDate.now().minusDays(2).toString()
                )
        );
        Map<String, Object> data = new HashMap<>();
        data.put("items", items);
        return Map.of("data", data);
    }
}




