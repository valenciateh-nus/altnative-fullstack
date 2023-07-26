package com.altnative.Alt.Native.Firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service
public class FCMInitializer {

    @Value("${app.firebase-config-file}")
    private String firebaseConfigPath;

    // creates a logger we can use to log messages to the console. This is just to format our console messages nicely.
    Logger logger = LoggerFactory.getLogger(com.altnative.Alt.Native.Firebase.FCMInitializer.class);


    @PostConstruct
    public void initialize() {
        // Get our credentials to authorize this Spring Boot application.
        try {
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())).build();

            // If our app Firebase application was not initialized, do so.
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase application has been initialized");
            }
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }
}
