package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.ProjectListing;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ProjectListingRepo extends ProjectRepo<ProjectListing>{

    @Query("SELECT p FROM ProjectListing p WHERE p.isAvailable IS TRUE")
    List<ProjectListing> findAvailableProjectListings();

    @Query("SELECT p FROM ProjectListing p")
    List<ProjectListing> findAllProjectListings();

    @Query("SELECT p FROM ProjectListing p WHERE p.id = (:id)")
    ProjectListing findByProjectId(@Param("id") Long id);

    @Query("SELECT p FROM ProjectListing p JOIN FETCH p.offers WHERE p.id = (:id) AND p.isAvailable IS TRUE")
    public ProjectListing findByIdAndFetchOffersEagerly(@Param("id") Long id);

    @Query("SELECT p FROM ProjectListing p JOIN p.refashioner r WHERE r.id = (:refashionerId) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByRefashionerId(Long refashionerId);

    List<ProjectListing> findByCategoryIdInAndIsAvailableTrue(List<Long> cIds);

    List<ProjectListing> findByCategoryIdIn(List<Long> cIds);

    List<ProjectListing> findByCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(String name);

    List<ProjectListing> findByCategoryCategoryNameContainingIgnoreCase(String name);

    List<ProjectListing> findByCategoryIdInAndRefashionerUsernameAndIsAvailableTrue(List<Long> cIds, String username);

    @Query("SELECT p FROM ProjectListing p JOIN p.tagList t WHERE category_id in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByCategoryAndTagName(List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectListing p JOIN p.materialList m WHERE category_id in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByCategoryAndMaterialName(List<Long> cIds, String name);

    List<ProjectListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(List<Long> cIds, String name);

    List<ProjectListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrue(List<Long> cIds, String title);

    List<ProjectListing> findByCategoryIdInAndTitleContainingIgnoreCase(List<Long> cIds, String title);

    @Query("SELECT p FROM ProjectListing p JOIN p.refashioner r WHERE r.username = (:username) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByRefashionerUsername(@Param("username") String username);

    List<ProjectListing> findByTitleContainingIgnoreCaseAndIsAvailableTrue(String title);

    List<ProjectListing> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT p FROM ProjectListing p JOIN p.refashioner r WHERE r.username = ?1 AND p.title like lower(concat('%', ?2,'%')) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByRefashionerUsernameAndTitleContainingIgnoreCase(String username, String title);

    @Query("SELECT p FROM ProjectListing p JOIN p.tagList t WHERE t.name like lower(concat('%', ?1,'%')) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByTagName(String tag);

    @Query("SELECT p FROM ProjectListing p JOIN p.refashioner r JOIN p.tagList t WHERE (r.username = ?1 AND t.name like lower(concat('%', ?2,'%'))) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByTagNameAndUsername(String username, String tag);

    @Query("SELECT p FROM ProjectListing p JOIN p.materialList m WHERE m.name like lower(concat('%', ?1,'%')) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByMaterialNameAndIsAvailableTrue(String material);

    @Query("SELECT p FROM ProjectListing p JOIN p.materialList m WHERE m.name like lower(concat('%', ?1,'%'))")
    List<ProjectListing> findByMaterialName(String material);

    @Query("SELECT p FROM ProjectListing p JOIN p.refashioner r JOIN p.materialList m WHERE (r.username = ?1 AND m.name like lower(concat('%', ?2,'%'))) AND p.isAvailable IS TRUE")
    List<ProjectListing> findByMaterialNameAndUsername(String username, String material);

    List<ProjectListing> findByRefashionerUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(String username, String name);

    List<ProjectListing> findByRefashionerUsernameAndIsAvailableTrue(String username);

}