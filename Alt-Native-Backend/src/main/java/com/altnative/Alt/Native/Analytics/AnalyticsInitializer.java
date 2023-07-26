//package com.altnative.Alt.Native.Analytics;
//
//
//import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
//import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
//import com.google.api.client.http.HttpTransport;
//import com.google.api.client.json.JsonFactory;
//import com.google.api.client.json.gson.GsonFactory;
//import com.google.api.services.analytics.Analytics;
//import com.google.api.services.analytics.AnalyticsScopes;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Service;
//
//import javax.annotation.PostConstruct;
//import java.io.IOException;
//import java.security.GeneralSecurityException;
//
//@Service
//public class AnalyticsInitializer {
//
//    private static final String APPLICATION_NAME = "Hello Analytics";
//    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
//
//    /**
//     * Initializes an Analytics service object.
//     *
//     * @return An authorized Analytics service object.
//     * @throws IOException
//     * @throws GeneralSecurityException
//     */
//    @PostConstruct
//    public static Analytics initializeAnalytics() throws GeneralSecurityException, IOException {
//        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
//        GoogleCredential credential = GoogleCredential
//                .fromStream(new ClassPathResource("altnative-analytics-dd37af8ae013.json").getInputStream())
//                .createScoped(AnalyticsScopes.all());
//
//        // Construct the Analytics service object.
//        return new Analytics.Builder(httpTransport, JSON_FACTORY, credential)
//                .setApplicationName(APPLICATION_NAME).build();
//    }
//}
