package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.MaterialAlreadyExistsException;
import com.altnative.Alt.Native.Exceptions.MaterialNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoMaterialExistsException;
import com.altnative.Alt.Native.Model.Material;
import com.altnative.Alt.Native.Service.MaterialService;
import com.amazonaws.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class MaterialController {
    private final MaterialService materialService;

    @PostMapping("/material")
    public ResponseEntity<?> createNewMaterial(@Valid @RequestBody Material material) {
        URI uri =  URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/material/createNewMaterial").toUriString());
        try {
            return ResponseEntity.created(uri).body(materialService.createNewMaterial(material));
        } catch (MaterialAlreadyExistsException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/materials")
    public ResponseEntity<?> retrieveAllMaterials() throws NoMaterialExistsException {
        try {
            return ResponseEntity.ok().body(materialService.retrieveAllMaterials());
        } catch (NoMaterialExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/material/{id}")
    public ResponseEntity<?> retrieveMaterialById(@PathVariable Long id) throws MaterialNotFoundException {
        try {
            return ResponseEntity.ok().body(materialService.retrieveMaterialById(id));
        } catch (MaterialNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/material/{name}")
    public ResponseEntity<?> retrieveMaterialByName(@PathVariable String name) throws MaterialNotFoundException {
        try {
            return ResponseEntity.ok().body(materialService.retrieveMaterialByName(name));
        } catch (MaterialNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/material/update")
    public ResponseEntity<?> updateMaterial(@Valid @RequestBody Material material) throws MaterialNotFoundException, MaterialAlreadyExistsException {
        try {
            return ResponseEntity.ok().body(materialService.updateMaterial(material));
        } catch (MaterialNotFoundException | MaterialAlreadyExistsException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/material/deleteById/{id}")
    public ResponseEntity<?> deleteMaterialById(@PathVariable Long id) throws MaterialNotFoundException {
        try {
            materialService.deleteMaterialById(id);
            return ResponseEntity.ok().body("Material with ID: " + id + " successfully deleted.");
        } catch (MaterialNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/material/deleteByName/{name}")
    public ResponseEntity<?> deleteMaterialByName(@PathVariable String name) throws MaterialNotFoundException {
        try {
            materialService.deleteMaterialByName(name);
            return ResponseEntity.ok().body("Material with name: " + name + " successfully deleted.");
        } catch (MaterialNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
