package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.TagNotFoundException;
import com.altnative.Alt.Native.Model.Tag;
import com.altnative.Alt.Native.Service.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class TagController {
    private final TagService tagService;

    @PostMapping("/tag")
    public ResponseEntity<?> createTag(@Valid @RequestBody Tag tag) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/tags/createTag").toUriString());
        return ResponseEntity.created(uri).body(tagService.createTag(tag));
    }

    @GetMapping("/tagByName")
    public ResponseEntity<?> retrieveTagByName(@RequestBody String name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/tags/retrieveTagByName").toUriString());
        try {
            return ResponseEntity.created(uri).body(tagService.retrieveTagByName(name));
        } catch (TagNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> retrieveAllTags() {
        return ResponseEntity.ok().body(tagService.retrieveAllTags());
    }

    @GetMapping("/tag/{id}")
    public ResponseEntity<?> retrieveTagById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(tagService.retrieveTagById(id));
        } catch (TagNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/tag/delete/{id}")
    public ResponseEntity<?> deleteTag(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(tagService.deleteTag(id));
        } catch (TagNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
