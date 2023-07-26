package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    public Category findByCategoryName(String name);
}
