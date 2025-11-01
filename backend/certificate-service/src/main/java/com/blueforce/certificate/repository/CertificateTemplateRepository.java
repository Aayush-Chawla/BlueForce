package com.blueforce.certificate.repository;

import com.blueforce.certificate.model.CertificateTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateTemplateRepository extends JpaRepository<CertificateTemplate, Long> {
    Page<CertificateTemplate> findByOwnerUserId(Long ownerUserId, Pageable pageable);
}




