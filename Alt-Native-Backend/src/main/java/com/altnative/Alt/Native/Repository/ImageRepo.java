package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepo extends JpaRepository<Image, Long> {
    Image findByUrl(String url);
}
