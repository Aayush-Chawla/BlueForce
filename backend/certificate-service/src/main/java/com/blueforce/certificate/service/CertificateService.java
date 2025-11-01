package com.blueforce.certificate.service;

import com.blueforce.certificate.model.Certificate;
import com.blueforce.certificate.model.CertificateTemplate;
import com.blueforce.certificate.repository.CertificateRepository;
import com.blueforce.certificate.repository.CertificateTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CertificateTemplateRepository templateRepository;

    public Page<Certificate> listParticipantCertificates(Long participantId, int page, int limit) {
        return certificateRepository.findByParticipantIdOrderByIssuedAtDesc(participantId, PageRequest.of(page, limit));
    }

    public CertificateTemplate createTemplate(Long ownerId, String name, String type) {
        CertificateTemplate t = CertificateTemplate.builder()
                .name(name)
                .type(type)
                .ownerUserId(ownerId)
                .build();
        return templateRepository.save(t);
    }

    public CertificateTemplate updateTemplate(Long ownerId, Long id, String name, String type) {
        CertificateTemplate t = templateRepository.findById(id).orElseThrow(() -> new RuntimeException("Template not found"));
        if (!t.getOwnerUserId().equals(ownerId)) throw new IllegalArgumentException("Forbidden");
        if (name != null) t.setName(name);
        if (type != null) t.setType(type);
        return templateRepository.save(t);
    }

    public Page<CertificateTemplate> listTemplates(Long ownerId, int page, int limit) {
        return templateRepository.findByOwnerUserId(ownerId, PageRequest.of(page, limit));
    }

    public Certificate issue(Long organizerId, Long participantId, Long eventId, Long templateId, String type) {
        String code = "CW-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Certificate c = Certificate.builder()
                .participantId(participantId)
                .eventId(eventId)
                .organizerId(organizerId)
                .templateId(templateId)
                .certificateType(type)
                .verificationCode(code)
                .issuedAt(LocalDateTime.now())
                .build();
        return certificateRepository.save(c);
    }
}




