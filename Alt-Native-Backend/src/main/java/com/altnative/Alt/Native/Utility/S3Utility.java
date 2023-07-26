package com.altnative.Alt.Native.Utility;

import com.altnative.Alt.Native.Exceptions.InvalidFileException;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.entity.ContentType;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class S3Utility {

    public static void isValidImage(MultipartFile file) throws InvalidFileException {
        if(file.isEmpty()) {
            log.error("Upload empty file error");
            throw new InvalidFileException("No file uploaded.");
        }

        if (!Arrays.asList(ContentType.IMAGE_JPEG.getMimeType(), ContentType.IMAGE_PNG.getMimeType(),ContentType.IMAGE_GIF.getMimeType()).contains(file.getContentType())) {
            log.error("Invalid file type: " + file.getContentType());
            throw new InvalidFileException("Invalid file type: " + file.getContentType());
        }
    }

    public static Map<String,String> extractMetadata(MultipartFile file) {
        Map<String,String> metadata = new HashMap<>();
        metadata.put("Content-Type", file.getContentType());
        metadata.put("Content-Length", String.valueOf(file.getSize()));

        return metadata;
    }
}
