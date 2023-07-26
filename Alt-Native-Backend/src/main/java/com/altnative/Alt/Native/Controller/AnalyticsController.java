package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.analytics.Refashioners;
import com.altnative.Alt.Native.Dto.analytics.Searches;
import com.altnative.Alt.Native.Service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/topRefashioners")
    public ResponseEntity getTopRefashioners() {
        try {
            return ResponseEntity.ok().body(analyticsService.getTopRefashioners());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/topSearches")
    public ResponseEntity getTopSearches() {
        try {
            return ResponseEntity.ok().body(analyticsService.getTopSearches());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("save/topRefashioners")
    public ResponseEntity saveTopRefashioners(@RequestBody List<Refashioners> refashioners) {
        try {
            analyticsService.saveTopRefashioners(refashioners);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("save/topSearches")
    public ResponseEntity saveTopSearches(@RequestBody List<Searches> searches) {
        try {
            analyticsService.saveTopSearches(searches);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}


//    @GetMapping
//    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
//        HttpClient client = HttpClientBuilder.create().build();
//        URIBuilder builder = new URIBuilder();
//        builder
//                .setScheme("http")
//                .setHost("www.google-analytics.com")
//                .setPath("/collect")
//                .addParameter("v", "1") // API Version.
//                .addParameter("tid", trackingId) // Tracking ID / Property ID.
//                // Anonymous Client Identifier. Ideally, this should be a UUID that
//                // is associated with particular user, device, or browser instance.
//                .addParameter("cid", "555")
//                .addParameter("t", "event") // Event hit type.
//                .addParameter("ec", "example") // Event category.
//                .addParameter("ea", "test action"); // Event action.
//        URI uri = null;
//        try {
//            uri = builder.build();
//        } catch (URISyntaxException e) {
//            throw new ServletException("Problem building URI", e);
//        }
//        HttpPost request = new HttpPost(uri);
//        client.execute(request);
//        System.out.println("response" + resp);
//        resp.getWriter().println("Event tracked.");
//    }
//}
