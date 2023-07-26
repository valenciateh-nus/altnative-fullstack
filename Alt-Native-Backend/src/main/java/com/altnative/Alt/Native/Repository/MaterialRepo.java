package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Exceptions.NoMilestoneExistsException;
import com.altnative.Alt.Native.Model.Material;
import com.altnative.Alt.Native.Model.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaterialRepo extends JpaRepository<Material, Long> {
    Material findByName(String name);

}