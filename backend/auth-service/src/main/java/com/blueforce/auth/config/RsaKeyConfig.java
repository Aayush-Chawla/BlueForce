package com.blueforce.auth.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileOutputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

@Configuration
public class RsaKeyConfig {

    private KeyPair keyPair;

    private static final String KEY_DIR = "keys";               // directory to save keys
    private static final String PRIVATE_KEY_FILE = KEY_DIR + "/rsa_private.pem";
    private static final String PUBLIC_KEY_FILE = KEY_DIR + "/rsa_public.pem";

    @PostConstruct
    public void init() throws Exception {
        File keyDir = new File(KEY_DIR);
        if (!keyDir.exists()) keyDir.mkdirs();

        File privateFile = new File(PRIVATE_KEY_FILE);
        File publicFile = new File(PUBLIC_KEY_FILE);

        if (privateFile.exists() && publicFile.exists()) {
            // ✅ If keys exist, load them
            this.keyPair = PemUtils.loadKeyPair(PRIVATE_KEY_FILE, PUBLIC_KEY_FILE);
            System.out.println("Loaded existing RSA key pair.");
        } else {
            // ✅ Generate new key pair
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            this.keyPair = keyGen.generateKeyPair();

            saveKeysToPem();
            System.out.println("Generated new RSA key pair and saved to " + KEY_DIR);
        }
    }

    private void saveKeysToPem() throws Exception {
        // Save Private Key
        String privatePem = "-----BEGIN PRIVATE KEY-----\n" +
                Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(keyPair.getPrivate().getEncoded()) +
                "\n-----END PRIVATE KEY-----\n";

        try (FileOutputStream fos = new FileOutputStream(PRIVATE_KEY_FILE)) {
            fos.write(privatePem.getBytes());
        }

        // Save Public Key
        String publicPem = "-----BEGIN PUBLIC KEY-----\n" +
                Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(keyPair.getPublic().getEncoded()) +
                "\n-----END PUBLIC KEY-----\n";

        try (FileOutputStream fos = new FileOutputStream(PUBLIC_KEY_FILE)) {
            fos.write(publicPem.getBytes());
        }
    }

    public KeyPair getKeyPair() {
        return keyPair;
    }
}
