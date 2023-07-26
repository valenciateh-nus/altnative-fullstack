package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.Measurement;
import com.altnative.Alt.Native.Service.AppUserService;
import com.altnative.Alt.Native.Service.MeasurementService;
import com.amazonaws.services.connect.model.UserNotFoundException;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class MeasurementController {
    private final MeasurementService measurementService;

    @PostMapping("/createMeasurement")
    public ResponseEntity<?> createMeasurement(@Valid @RequestBody Measurement measurement) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/createMeasurement").toUriString());
        try {
            return ResponseEntity.created(uri).body(measurementService.createMeasurement(measurement));
        } catch (MeasurementExistsAlreadyException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/createEmptyMeasurement")
    public ResponseEntity<?> createEmptyMeasurement() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/createEmptyMeasurement").toUriString());
        return ResponseEntity.created(uri).body(measurementService.createMeasurement());
    }

    @GetMapping("/measurement/{id}")
    public ResponseEntity<?> retrieveMeasurementById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(measurementService.retrieveMeasurementById(id));
        } catch (MeasurementNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/getMeasurements")
    public ResponseEntity<?> retrieveMeasurements() {
        try {
            return ResponseEntity.ok().body(measurementService.retrieveMeasurementByUser());
        } catch (MeasurementNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/deleteMeasurement/{id}")
    public ResponseEntity<?> deleteMeasurementById(@PathVariable Long id) {
        try {
            measurementService.deleteMeasurementById(id);
            return ResponseEntity.ok().body("Measurements deleted successfully.");
        } catch (MeasurementNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/updateMeasurements")
    public ResponseEntity<?> updateMeasurements(@Valid @RequestBody Measurement measurement) {
        try {
            return ResponseEntity.ok().body(measurementService.updateMeasurement(measurement));
        } catch (MeasurementNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/measurementByUsername")
    public ResponseEntity<?> retrieveMeasurementByUsername(@RequestParam String username) {
        try {
            return ResponseEntity.ok().body(measurementService.retrieveMeasurementByUsername(username));
        } catch (MeasurementNotFoundException | UserDoesNotExistException | UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/measurementByUserId")
    public ResponseEntity<?> retrieveMeasurementByUserId(@RequestParam Long id) {
        try {
            return ResponseEntity.ok().body(measurementService.retrieveMeasurementByUserId(id));
        } catch (MeasurementNotFoundException | UserDoesNotExistException | UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
