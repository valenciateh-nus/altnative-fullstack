package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AddOn;
import com.altnative.Alt.Native.Model.Event;
import com.altnative.Alt.Native.Model.ProjectListing;
import com.altnative.Alt.Native.Service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;

    @GetMapping("/events")
    public ResponseEntity<List<Event>> retrieveAllEvents() throws NoAccessRightsException {
        return ResponseEntity.ok().body(eventService.retrieveAllEvents());
    }

    @GetMapping("/events/open")
    public ResponseEntity<List<Event>> retrieveAllOpenEvents() {
        return ResponseEntity.ok().body(eventService.retrieveAllOpenEvents());
    }

    @GetMapping("/events/full")
    public ResponseEntity<List<Event>> retrieveAllFullEvents() {
        return ResponseEntity.ok().body(eventService.retrieveAllFullEvents());
    }

    @GetMapping("/events/closed")
    public ResponseEntity<List<Event>> retrieveAllClosedEvents() throws NoAccessRightsException {
        return ResponseEntity.ok().body(eventService.retrieveAllClosedEvents());
    }

    @GetMapping("/events/upcoming")
    public ResponseEntity<List<Event>> retrieveAllUpcomingEvents() {
        return ResponseEntity.ok().body(eventService.retrieveAllUpcomingEvents());
    }

    @GetMapping("/events/booked")
    public ResponseEntity<List<Event>> retrieveOwnEvents() {
        return ResponseEntity.ok().body(eventService.retrieveOwnEvents());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> retrieveEventByEventId(@PathVariable Long eventId) throws EventNotFoundException, NoAccessRightsException {
        return ResponseEntity.ok().body(eventService.viewEvent(eventId));
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@Valid @RequestPart Event event, @RequestPart(value="files") List<MultipartFile> files) {
        try {
            return ResponseEntity.ok().body(eventService.createEvent(files, event));
        } catch (NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> addImageToEvent(@PathVariable Long eventId, @RequestPart(value="file", required=true) MultipartFile file) {
        try {
            eventService.addImageToEvent(eventId, file);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/event/{eventId}/image/{imageId}")
    public ResponseEntity<?> removeImageFromEvent(@PathVariable Long eventId, @PathVariable Long imageId) {
        try {
            eventService.removeImageFromEvent(eventId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | EventNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/event/{eventId}")
    public ResponseEntity<?> editAnEvent(@PathVariable Long eventId, @Valid @RequestBody Event event) {
        try {
            return ResponseEntity.ok().body(eventService.editAnEvent(eventId, event));
        } catch (NoAccessRightsException | EventNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<?> deleteEventById(@PathVariable Long eventId) {
        try {
            eventService.deleteEvent(eventId);
            return ResponseEntity.ok().body("Event with ID: " + eventId + " deleted successfully.");
        } catch (NoAccessRightsException | EventNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/event/{eventId}/signup")
    public ResponseEntity<?> signUpForEvent(@PathVariable Long eventId, @Valid @RequestBody Integer numberOfPax) {
        try {
            eventService.signUpForEvent(eventId, numberOfPax);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

}
