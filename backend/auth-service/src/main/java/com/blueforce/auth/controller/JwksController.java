package com.blueforce.auth.controller;

import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.JWSAlgorithm;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.interfaces.RSAPublicKey;
import java.util.Collections;
import java.util.Map;

@RestController
public class JwksController {

    private final RSAPublicKey publicKey;

    public JwksController(com.blueforce.auth.config.RsaKeyConfig rsaKeyConfig) {
        this.publicKey = (RSAPublicKey) rsaKeyConfig.getKeyPair().getPublic();
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> getJwks() {
        RSAKey jwk = new RSAKey.Builder(publicKey)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID("key-1")
                .build();

        return Collections.singletonMap("keys", Collections.singletonList(jwk.toJSONObject()));
    }
}
