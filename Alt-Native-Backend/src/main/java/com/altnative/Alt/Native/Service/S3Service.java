package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Model.Image;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class S3Service {

    private final AmazonS3 s3;

    @Autowired
    public S3Service(AmazonS3 s3) {
        this.s3 = s3;
    }

    public String save(String path, String fileName, Optional<Map<String,String>> metadata, InputStream inputStream) {
        ObjectMetadata objectMetadata = new ObjectMetadata();

        metadata.ifPresent(map -> {
            if(!map.isEmpty()) {
                map.forEach((k,v) -> {
                    if(k == "Content-Type") {
                        objectMetadata.setContentType(v);
                    } else {
                        objectMetadata.addUserMetadata(k,v);
                    }
                });
            }
        });

        try {
            s3.putObject(path, fileName, inputStream, objectMetadata);
        } catch(AmazonServiceException ex) {
            log.error("Failed to save file: {} to s3. Error: ", fileName, ex.getMessage());
            throw new IllegalStateException("Failed to save file to s3", ex);
        }

        return s3.getUrl(path, fileName).toString();
    }

    public void delete(Image image) {
        try {
            s3.deleteObject(image.getPath(),image.getFileName());
            log.info("deleted image: " + image.getFileName());
        } catch(AmazonServiceException ex) {
            log.error("Failed to delete file: {} to s3. Error: ", image.getFileName(), ex.getMessage());
            throw new IllegalStateException("Failed to delete file to s3", ex);
        }

    }
}
