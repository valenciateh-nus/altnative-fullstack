package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.InvalidDeliveryInformationException;
import com.altnative.Alt.Native.Model.AppUser;
//import com.altnative.Alt.Native.Model.DeliveryInformation;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.User;
import com.altnative.Alt.Native.Service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@Slf4j
public class ImageController {
    private final ImageService imageService;
    private final UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        User user = userService.getUserFromToken(request);
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("images/upload").toUriString());
        try {
            return ResponseEntity.created(uri).body(imageService.createImage(user, file));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
