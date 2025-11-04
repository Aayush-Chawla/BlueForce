package com.blueforce.event.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CertificateServiceClient {

    private final RestTemplate restTemplate;

    @Value("${certificate.service.url:http://localhost:8093}")
    private String certificateServiceUrl;

    /**
     * Get or create default template for organizer
     */
    public Long getOrCreateDefaultTemplate(Long organizerId) {
        try {
            // Try to get existing templates using internal endpoint
            String url = certificateServiceUrl + "/api/certificates/internal/templates?page=0&limit=1";
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Service-User-Id", organizerId.toString());
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                if (data != null) {
                    java.util.List<Map<String, Object>> items = (java.util.List<Map<String, Object>>) data.get("items");
                    if (items != null && !items.isEmpty()) {
                        Object id = items.get(0).get("id");
                        if (id != null) {
                            return Long.parseLong(id.toString());
                        }
                    }
                }
            }
            
            // Create default template if none exists
            return createDefaultTemplate(organizerId);
        } catch (Exception e) {
            log.error("Error getting template for organizer {}: {}", organizerId, e.getMessage());
            // Try to create default template
            return createDefaultTemplate(organizerId);
        }
    }

    private Long createDefaultTemplate(Long organizerId) {
        try {
            String url = certificateServiceUrl + "/api/certificates/internal/templates";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("X-Service-User-Id", organizerId.toString());
            
            Map<String, Object> body = Map.of(
                "name", "Default Participation Certificate",
                "type", "participation"
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                if (data != null) {
                    Object id = data.get("id");
                    if (id != null) {
                        return Long.parseLong(id.toString());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error creating default template for organizer {}: {}", organizerId, e.getMessage());
        }
        return null;
    }

    /**
     * Issue certificate for participant
     */
    public void issueCertificate(Long organizerId, Long participantId, Long eventId, Long templateId, String type) {
        try {
            String url = certificateServiceUrl + "/api/certificates/internal/issue";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("X-Service-User-Id", organizerId.toString());
            
            Map<String, Object> body = Map.of(
                "participantId", participantId,
                "eventId", eventId,
                "templateId", templateId,
                "type", type != null ? type : "participation"
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Certificate issued successfully for participant {} in event {}", participantId, eventId);
            } else {
                log.warn("Failed to issue certificate: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error issuing certificate for participant {} in event {}: {}", 
                participantId, eventId, e.getMessage());
            // Don't throw exception - certificate issuance failure shouldn't block event completion
        }
    }

    /**
     * Check if certificate already exists for participant and event
     */
    public boolean certificateExists(Long participantId, Long eventId) {
        try {
            String url = certificateServiceUrl + "/api/certificates/internal/check?participantId=" + participantId + "&eventId=" + eventId;
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object exists = response.getBody().get("exists");
                if (exists != null) {
                    return Boolean.parseBoolean(exists.toString());
                }
            }
        } catch (Exception e) {
            log.error("Error checking certificate existence: {}", e.getMessage());
        }
        return false;
    }
}

