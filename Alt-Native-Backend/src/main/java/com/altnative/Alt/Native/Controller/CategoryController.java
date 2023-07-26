package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.CategoryAlreadyExistsException;
import com.altnative.Alt.Native.Exceptions.CategoryNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoCategoryExistsException;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Service.CategoryService;
import com.amazonaws.Response;
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
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@Valid @RequestPart Category category, @RequestPart MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/categories").toUriString());
        try {
            return ResponseEntity.created(uri).body(categoryService.createCategory(category, file));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> retrieveAllCategories() {
        try {
            return ResponseEntity.ok().body(categoryService.retrieveAllCategories());
        } catch (NoCategoryExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<?> retrieveCategoryById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(categoryService.retrieveCategoryById(id));
        } catch (CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/categories/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long cId, @Valid @RequestBody Category category) {
        try {
            return ResponseEntity.ok().body(categoryService.updateCategory(category));
        } catch (CategoryNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/categories/delete/{id}")
    public ResponseEntity<?> deleteCategoryById(@PathVariable Long id) {
        try {
            categoryService.deleteCategoryById(id);
            return ResponseEntity.ok().body("Category with ID: " + id + " deleted successfully.");
        } catch (CategoryNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/categories/{name}")
    public ResponseEntity<?> deleteCategoryByName(@PathVariable String name) {
        try {
            categoryService.deleteCategoryByName(name);
            return ResponseEntity.ok().body("Category with name: " + name + " deleted successfully");
        } catch (CategoryNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

}
