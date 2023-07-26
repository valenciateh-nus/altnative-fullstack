package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    public Category createCategory(Category category, MultipartFile file) throws CategoryAlreadyExistsException, NoAccessRightsException, InvalidFileException, S3Exception;

    Category createCategoryDb(Category category, Image image) throws CategoryAlreadyExistsException;

    public Category retrieveCategoryById(Long id) throws CategoryNotFoundException;

    public Category retrieveCategoryByName(String name) throws CategoryNotFoundException;

    public Category updateCategory(Category category) throws CategoryNotFoundException, NoAccessRightsException;

    public List<Category> retrieveAllCategories() throws NoCategoryExistsException;

    public void deleteCategoryById(Long id) throws CategoryNotFoundException, NoAccessRightsException;

    public void deleteCategoryByName(String name) throws CategoryNotFoundException, NoAccessRightsException;
}
