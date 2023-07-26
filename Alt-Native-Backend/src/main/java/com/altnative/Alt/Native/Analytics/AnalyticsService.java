//package com.altnative.Alt.Native.Analytics;
//
//import com.google.api.client.json.JsonFactory;
//import com.google.api.client.json.gson.GsonFactory;
//
//import com.google.api.services.analytics.Analytics;
//import com.google.api.services.analytics.model.Accounts;
//import com.google.api.services.analytics.model.GaData;
//import com.google.api.services.analytics.model.Profiles;
//import com.google.api.services.analytics.model.Webproperties;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.security.GeneralSecurityException;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class AnalyticsService {

//    @Value("${GA_TRACKING_ID}")
//    private String trackingId;
//
//    @Value("${SERVICE_ACCOUNT_EMAIL}")
//    private String email;

//    private final String APPLICATION_NAME = "Hello Analytics";
//    private final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
//
//    public String getFirstProfileId() throws GeneralSecurityException, IOException {
//
//        Analytics analytics = AnalyticsInitializer.initializeAnalytics();
//        // Get the first view (profile) ID for the authorized user.
//        String profileId = null;
//
//        // Query for the list of all accounts associated with the service account.
//        Accounts accounts = analytics.management().accounts().list().execute();
//
//        if (accounts.getItems().isEmpty()) {
//            System.err.println("No accounts found");
//        } else {
//            String firstAccountId = accounts.getItems().get(0).getId();
//
//            // Query for the list of properties associated with the first account.
//            Webproperties properties = analytics.management().webproperties()
//                    .list(firstAccountId).execute();
//
//            if (properties.getItems().isEmpty()) {
//                System.err.println("No Webproperties found");
//            } else {
//                String firstWebpropertyId = properties.getItems().get(0).getId();
//
//                // Query for the list views (profiles) associated with the property.
//                Profiles profiles = analytics.management().profiles()
//                        .list(firstAccountId, firstWebpropertyId).execute();
//
//                if (profiles.getItems().isEmpty()) {
//                    System.err.println("No views (profiles) found");
//                } else {
//                    // Return the first (view) profile associated with the property.
//                    profileId = profiles.getItems().get(0).getId();
//                }
//            }
//        }
//        return profileId;
//    }
//
//    public GaData getSessions(String profileId) throws GeneralSecurityException, IOException {
//        Analytics analytics = AnalyticsInitializer.initializeAnalytics();
//        // Query the Core Reporting API for the number of sessions
//        // in the past seven days.
//        return analytics.data().ga()
//                .get("ga:" + profileId, "7daysAgo", "today", "ga:sessions")
//                .execute();
//    }
//
//    public List<String> getTopSearches(String profileId) throws GeneralSecurityException, IOException {
//        Analytics analytics = AnalyticsInitializer.initializeAnalytics();
//        // Query the Core Reporting API for the number of sessions
//        // in the past seven days.
//        Map<String, Integer> queries = new HashMap<>();
//        List<String> topQueries = new ArrayList<>();
//        GaData results = analytics.data().ga()
//                .get("ga:" + profileId, "7daysAgo", "today", "ga:totalEvents")
//                .setDimensions("ga:eventAction")
//                .execute();
//        if (null != results) {
//            if (results.get("rows") != null && results.get("columnHeaders") != null) {
//                if (!results.getRows().isEmpty() && !results.getColumnHeaders().isEmpty()) {
//                    for (List<String> row : results.getRows()) {
//                        queries.put(row.get(0), Integer.valueOf(row.get(1)));
//                    }
//                } else {
//                    System.out.println("No rows or columHeaders empty\n");
//                }
//            } else {
//                System.out.println("No rows or columHeaders\n");
//            }
//        }
//        Map<String, Integer> sortedQueries = queries.entrySet().stream()
//                .sorted(Comparator.comparingInt(e -> -e.getValue()))
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        Map.Entry::getValue,
//                        (a, b) -> { throw new AssertionError(); },
//                        LinkedHashMap::new
//                ));
//        sortedQueries.entrySet().forEach(System.out::println);
//        Set<String> searches = sortedQueries.keySet();
//        topQueries = new ArrayList<String>(searches);
//        if (topQueries.size() > 5) {
//            return topQueries.subList(0, 5);
//        }
//        return topQueries;
//    }
//
//    public List<String> getTopRefashioners(String profileId) throws GeneralSecurityException, IOException {
//        Analytics analytics = AnalyticsInitializer.initializeAnalytics();
//        Map<String, Integer> refashioners = new HashMap<>();
//        List<String> topRefashioners = new ArrayList<>();
//        // Query the Core Reporting API for the number of sessions
//        // in the past seven days.
//        GaData results = analytics.data().ga()
//                .get("ga:" + profileId, "3daysAgo", "today", "ga:pageviews")
//                .setDimensions("ga:pagePath")
//                .setFilters("ga:pagePath=@refashioner")
//                .execute();
//        if (null != results) {
//            if (results.get("rows") != null && results.get("columnHeaders") != null) {
//                if (!results.getRows().isEmpty() && !results.getColumnHeaders().isEmpty()) {
//                    for (List<String> row : results.getRows()) {
//                        refashioners.put(row.get(0), Integer.valueOf(row.get(1)));
//                    }
//                } else {
//                    System.out.println("No rows or columHeaders empty\n");
//                }
//            } else {
//                System.out.println("No rows or columHeaders\n");
//            }
//        }
//        Map<String, Integer> sortedRefashioners = refashioners.entrySet().stream()
//                .sorted(Comparator.comparingInt(e -> -e.getValue()))
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        Map.Entry::getValue,
//                        (a, b) -> { throw new AssertionError(); },
//                        LinkedHashMap::new
//                ));
//        sortedRefashioners.entrySet().forEach(System.out::println);
//        Set<String> usernames = sortedRefashioners.keySet();
//        for (String u : usernames) {
//            String[] parts = u.split("/");
//            topRefashioners.add(parts[3]);
//        }
//        if (topRefashioners.size() > 5) {
//            return topRefashioners.subList(0, 5);
//        }
//        return topRefashioners;
//    }
//
//    public void printResults(GaData results) {
//        // Parse the response from the Core Reporting API for
//        // the profile name and number of sessions.
//        if (null != results) {
//            System.out.println("View (Profile: " + "?" + ") Name: "
//                    + results.getProfileInfo().getProfileName() + "\n");
//            if (results.get("rows") != null && results.get("columnHeaders") != null) {
//                if (!results.getRows().isEmpty() && !results.getColumnHeaders().isEmpty()) {
//                    for (List<String> row : results.getRows()) {
//                        for (int i = 0; i < results.getColumnHeaders().size(); i++) {
//                            List<GaData.ColumnHeaders> headers = results.getColumnHeaders();
//                            System.out.println(headers.get(i).getName() + ": " + row.get(i) + "\n");
//                        }
//                        System.out.println("---------- ---------- ----------\n");
//                    }
//                } else {
//                    System.out.println("No rows or columHeaders empty\n");
//                }
//            } else {
//                System.out.println("No rows or columHeaders\n");
//            }
//        }
//    }
//}
