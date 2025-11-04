package com.blueforce.certificate.controller;

import com.blueforce.certificate.model.Certificate;
import com.blueforce.certificate.model.CertificateTemplate;
import com.blueforce.certificate.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping("")
    public ResponseEntity<?> list(@RequestParam("participantId") Long participantId,
                                  @RequestParam(value = "page", required = false) Integer page,
                                  @RequestParam(value = "limit", required = false) Integer limit) {
        int p = page != null ? page : 0; int l = limit != null ? limit : 25;
        Page<Certificate> result = certificateService.listParticipantCertificates(participantId, p, l);
        return ResponseEntity.ok(Map.of("success", true, "message", "OK", "data", Map.of(
                "items", result.getContent(), "total", result.getTotalElements(), "page", p, "limit", l
        )));
    }

    @GetMapping("/templates")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> listTemplates(@AuthenticationPrincipal Jwt jwt,
                                           @RequestParam(value = "page", required = false) Integer page,
                                           @RequestParam(value = "limit", required = false) Integer limit) {
        Long ownerId = Long.parseLong(jwt.getClaimAsString("user_id") != null ? jwt.getClaimAsString("user_id") : jwt.getSubject());
        int p = page != null ? page : 0; int l = limit != null ? limit : 25;
        Page<CertificateTemplate> result = certificateService.listTemplates(ownerId, p, l);
        return ResponseEntity.ok(Map.of("success", true, "message", "OK", "data", Map.of(
                "items", result.getContent(), "total", result.getTotalElements(), "page", p, "limit", l
        )));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> createTemplate(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        Long ownerId = Long.parseLong(jwt.getClaimAsString("user_id") != null ? jwt.getClaimAsString("user_id") : jwt.getSubject());
        String name = String.valueOf(body.getOrDefault("name", "Untitled"));
        String type = String.valueOf(body.getOrDefault("type", "participation"));
        CertificateTemplate saved = certificateService.createTemplate(ownerId, name, type);
        return ResponseEntity.ok(Map.of("success", true, "message", "Created", "data", Map.of("id", saved.getId())));
    }

    @PutMapping("/templates/{id}")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> updateTemplate(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long ownerId = Long.parseLong(jwt.getClaimAsString("user_id") != null ? jwt.getClaimAsString("user_id") : jwt.getSubject());
        String name = (String) body.get("name");
        String type = (String) body.get("type");
        CertificateTemplate saved = certificateService.updateTemplate(ownerId, id, name, type);
        return ResponseEntity.ok(Map.of("success", true, "message", "Updated", "data", Map.of("id", saved.getId())));
    }

    @PostMapping("/issue")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> issue(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String, Object> body) {
        Long organizerId = Long.parseLong(jwt.getClaimAsString("user_id") != null ? jwt.getClaimAsString("user_id") : jwt.getSubject());
        Long participantId = Long.parseLong(String.valueOf(body.get("participantId")));
        Long eventId = Long.parseLong(String.valueOf(body.get("eventId")));
        Long templateId = Long.parseLong(String.valueOf(body.get("templateId")));
        String type = String.valueOf(body.getOrDefault("type", "participation"));
        Certificate saved = certificateService.issue(organizerId, participantId, eventId, templateId, type);
        return ResponseEntity.ok(Map.of("success", true, "message", "Issued", "data", Map.of("id", saved.getId(), "verificationCode", saved.getVerificationCode())));
    }

    // Internal service endpoints for automatic certificate issuance
    @GetMapping("/internal/templates")
    public ResponseEntity<?> listTemplatesInternal(@RequestHeader(value = "X-Service-User-Id", required = true) String ownerIdHeader,
                                                    @RequestParam(value = "page", required = false) Integer page,
                                                    @RequestParam(value = "limit", required = false) Integer limit) {
        Long ownerId = Long.parseLong(ownerIdHeader);
        int p = page != null ? page : 0; int l = limit != null ? limit : 25;
        Page<CertificateTemplate> result = certificateService.listTemplates(ownerId, p, l);
        return ResponseEntity.ok(Map.of("success", true, "message", "OK", "data", Map.of(
                "items", result.getContent(), "total", result.getTotalElements(), "page", p, "limit", l
        )));
    }

    @PostMapping("/internal/templates")
    public ResponseEntity<?> createTemplateInternal(@RequestHeader(value = "X-Service-User-Id", required = true) String ownerIdHeader,
                                                     @RequestBody Map<String, Object> body) {
        Long ownerId = Long.parseLong(ownerIdHeader);
        String name = String.valueOf(body.getOrDefault("name", "Untitled"));
        String type = String.valueOf(body.getOrDefault("type", "participation"));
        CertificateTemplate saved = certificateService.createTemplate(ownerId, name, type);
        return ResponseEntity.ok(Map.of("success", true, "message", "Created", "data", Map.of("id", saved.getId())));
    }

    @PostMapping("/internal/issue")
    public ResponseEntity<?> issueInternal(@RequestHeader(value = "X-Service-User-Id", required = true) String organizerIdHeader,
                                           @RequestBody Map<String, Object> body) {
        Long organizerId = Long.parseLong(organizerIdHeader);
        Long participantId = Long.parseLong(String.valueOf(body.get("participantId")));
        Long eventId = Long.parseLong(String.valueOf(body.get("eventId")));
        Long templateId = Long.parseLong(String.valueOf(body.get("templateId")));
        String type = String.valueOf(body.getOrDefault("type", "participation"));
        Certificate saved = certificateService.issue(organizerId, participantId, eventId, templateId, type);
        return ResponseEntity.ok(Map.of("success", true, "message", "Issued", "data", Map.of("id", saved.getId(), "verificationCode", saved.getVerificationCode())));
    }

    @GetMapping("/internal/check")
    public ResponseEntity<?> checkCertificateExists(@RequestParam("participantId") Long participantId,
                                                     @RequestParam("eventId") Long eventId) {
        boolean exists = certificateService.certificateExists(participantId, eventId);
        return ResponseEntity.ok(Map.of("success", true, "exists", exists));
    }
}




