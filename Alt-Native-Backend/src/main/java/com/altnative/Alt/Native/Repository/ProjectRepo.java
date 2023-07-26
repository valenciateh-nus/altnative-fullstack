package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ProjectRepo<T extends Project> extends JpaRepository<Project, Long> {

    public T findByTitle(String title);

    @Query("SELECT p FROM Project p JOIN FETCH p.imageList WHERE p.id = (:id)")
    public Project findByIdAndFetchImagesEagerly(@Param("id") Long id);

    @Query("SELECT p FROM Project p JOIN FETCH p.tagList WHERE p.id = (:id)")
    public Project findByIdAndFetchTagListEagerly(@Param("id") Long id);

    @Query("SELECT p FROM Project p JOIN FETCH p.materialList WHERE p.id = (:id)")
    public Project findByIdAndFetchMaterialListEagerly(@Param("id") Long id);

}