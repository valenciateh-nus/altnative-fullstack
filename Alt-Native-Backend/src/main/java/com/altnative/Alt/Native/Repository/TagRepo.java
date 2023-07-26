package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepo extends JpaRepository<Tag, Long> {

    public Tag findByName(String name);

}

