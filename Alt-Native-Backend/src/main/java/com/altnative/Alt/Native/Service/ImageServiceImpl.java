package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.InvalidFileException;
import com.altnative.Alt.Native.Exceptions.S3Exception;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.User;
import com.altnative.Alt.Native.Repository.ImageRepo;
import com.altnative.Alt.Native.Utility.S3Utility;
import com.amazonaws.services.ecr.model.ImageNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ImageServiceImpl implements ImageService{
    private final ImageRepo imageRepo;
    private final S3Service s3Service;



    @Override
    public Image createImage(Image image, MultipartFile file) throws InvalidFileException, S3Exception {

        S3Utility.isValidImage(file);
        Map<String, String> metadata = S3Utility.extractMetadata(file);

        try {
            String fileUrl = s3Service.save(image.getPath(), image.getFileName(), Optional.of(metadata), file.getInputStream());
            log.info("image file url: " + fileUrl);
            image.setUrl(fileUrl);
            imageRepo.saveAndFlush(image);
            return image;
        }catch (IOException ex) {
            throw new S3Exception("Unknown error occurred while saving to S3 bucket: " + ex.getMessage());
        }

    }

    @Override
    public Image createImageFromIS(Image image, InputStream file, Map<String, String> metadata) throws S3Exception {
        try {
            String fileUrl = s3Service.save(image.getPath(), image.getFileName(), Optional.of(metadata), file);
            log.info("image file url: " + fileUrl);
            image.setUrl(fileUrl);
            imageRepo.saveAndFlush(image);
            return image;
        }catch (Exception ex) {
            throw new S3Exception("Unknown error occurred while saving to S3 bucket: " + ex.getMessage());
        }
    }

    @Override
    public void deleteImage(Image image) {
        Image oldImage = imageRepo.findByUrl(image.getUrl());

        if(oldImage != null) {
            s3Service.delete(oldImage);
            imageRepo.delete(oldImage);
        }

    }

    @Override
    public Long retrieveImageId(Image image) {
        Image imageToRetrieve = imageRepo.findByUrl(image.getUrl());

        if(imageToRetrieve != null) {
            return imageToRetrieve.getId();
        }
        throw new ImageNotFoundException("Image not found!");
    }

    @Override
    public Image createImage(User user, MultipartFile file) throws InvalidFileException, S3Exception {
        String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(),user.getId());
        String filename = String.format("%s-%s", UUID.randomUUID(),file.getOriginalFilename());
        Image newImage = new Image();
        newImage.setPath(path);
        newImage.setFileName(filename);

        newImage = createImage(newImage, file);

        return newImage;

    }

    @Override
    public Image retrieveImageById(Long imageId) throws com.altnative.Alt.Native.Exceptions.ImageNotFoundException {
        Optional<Image> imageOptional = imageRepo.findById(imageId);
        if (imageOptional.isEmpty()) {
            throw new com.altnative.Alt.Native.Exceptions.ImageNotFoundException("Image with id: " + imageId + " not found!");
        } else {
            return imageOptional.get();
        }
    }
}
