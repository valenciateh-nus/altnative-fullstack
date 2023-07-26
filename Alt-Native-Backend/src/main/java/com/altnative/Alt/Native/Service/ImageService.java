package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.ImageNotFoundException;
import com.altnative.Alt.Native.Exceptions.InvalidFileException;
import com.altnative.Alt.Native.Exceptions.S3Exception;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.User;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Map;

public interface ImageService {
    Image createImage(Image image, MultipartFile file) throws InvalidFileException, S3Exception;
    Image createImageFromIS(Image image, InputStream file, Map<String, String> metadata) throws InvalidFileException, S3Exception;
    void deleteImage(Image image);
    Image createImage(User user, MultipartFile file) throws InvalidFileException, S3Exception;
    public Long retrieveImageId(Image image);

    Image retrieveImageById(Long imageId) throws ImageNotFoundException;
}
