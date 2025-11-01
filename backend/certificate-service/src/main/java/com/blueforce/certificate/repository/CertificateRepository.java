package com.blueforce.certificate.repository;

import com.blueforce.certificate.model.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Page<Certificate> findByParticipantIdOrderByIssuedAtDesc(Long participantId, Pageable pageable);
}




