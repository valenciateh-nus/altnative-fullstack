package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Repository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepo categoryRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;

    @Override
    public Category createCategory(Category category, MultipartFile file) throws CategoryAlreadyExistsException, NoAccessRightsException, InvalidFileException, S3Exception {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        if (!currUser.getRoles().contains(Role.ADMIN)) {
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        }
        Category cat = categoryRepo.findByCategoryName(category.getCategoryName());
        if (cat == null) {
            String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), currUser.getId());
            String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
            Image newImage = new Image();
            newImage.setPath(path);
            newImage.setFileName(filename);
            newImage = imageService.createImage(newImage, file);
            category.setImage(newImage);
            categoryRepo.save(category);
        } else {
            throw new CategoryAlreadyExistsException("Category with name: " + category.getCategoryName() + " already exists.");
        }
        return category;
    }

    @Override
    public Category createCategoryDb(Category category, Image image) throws CategoryAlreadyExistsException {
        Category cat = categoryRepo.findByCategoryName(category.getCategoryName());
        if (cat == null) {
            category.setImage(image);
            categoryRepo.save(category);
        } else {
            throw new CategoryAlreadyExistsException("Category with name: " + category.getCategoryName() + " already exists.");
        }
        return category;
    }

    @Override
    public Category retrieveCategoryById(Long id) throws CategoryNotFoundException {
        Optional<Category> categoryOptional = categoryRepo.findById(id);
        if (categoryOptional.isEmpty()) {
            throw new CategoryNotFoundException("Category with id: " + id + " not found.");
        } else {
            return categoryOptional.get();
        }
    }

    @Override
    public Category retrieveCategoryByName(String name) throws CategoryNotFoundException {
        Category category = categoryRepo.findByCategoryName(name);
        if (category == null) {
            throw new CategoryNotFoundException("Category with name: " + name + " not found.");
        } else {
            return category;
        }
    }

    @Override
    public List<Category> retrieveAllCategories() throws NoCategoryExistsException {
        List<Category> categoryList = categoryRepo.findAll();
        if (categoryList.isEmpty()) {
            throw new NoCategoryExistsException("There are no categories in the database.");
        } else {
            return categoryList;
        }
    }

    @Override
    public Category updateCategory(Category category) throws CategoryNotFoundException, NoAccessRightsException {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            Category toBeUpdatedCategory = retrieveCategoryById(category.getId());
            toBeUpdatedCategory.setCategoryName(category.getCategoryName());
            toBeUpdatedCategory.setId(category.getId());
            categoryRepo.save(toBeUpdatedCategory);
            return toBeUpdatedCategory;
        }
        throw new NoAccessRightsException("You do not have the access rights to do this method!");
    }

    @Override
    public void deleteCategoryById(Long id) throws CategoryNotFoundException, NoAccessRightsException {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.ADMIN)) {
            Category category = retrieveCategoryById(id);
            categoryRepo.delete(category);
            categoryRepo.flush();
        }
        throw new NoAccessRightsException("You do not have the access rights to do this method!");
    }

    @Override
    public void deleteCategoryByName(String name) throws CategoryNotFoundException, NoAccessRightsException {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.ADMIN)) {
            Category category = retrieveCategoryByName(name);
            categoryRepo.delete(category);
            categoryRepo.flush();
        }
        throw new NoAccessRightsException("You do not have the access rights to do this method!");
    }
}
