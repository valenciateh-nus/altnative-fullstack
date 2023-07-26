package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Model.ProjectRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ProjectRequestRepo extends ProjectRepo<ProjectRequest> {

    @Query("SELECT p FROM ProjectRequest p WHERE p.id = (:id)")
    public ProjectRequest findByProjectId(@Param("id") Long id);

    @Query("SELECT p FROM ProjectRequest p JOIN FETCH p.offers WHERE p.id = (:id)")
    public ProjectRequest findByIdAndFetchOffersEagerly(@Param("id") Long id);

    @Query("SELECT p FROM ProjectRequest p WHERE p.isAvailable is TRUE")
    List<ProjectRequest> findAllProjectRequests();

    List<ProjectRequest> findByRefashioneeId(Long id);

    List<ProjectRequest> findByRequestStatusInAndIsAvailableTrueAndIsBusinessFalse(List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusInAndIsAvailableTrueAndIsBusinessTrue(List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusInAndIsAvailableTrue(List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusIn(List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusInAndIsBusinessFalse(List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusInAndIsBusinessTrue(List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusInAndIsBusinessTrueAndIsAvailableTrue(List<RequestStatus> statuses);

    List<ProjectRequest> findByCategoryIdInAndRequestStatusInAndIsAvailableTrueAndIsBusinessFalse(List<Long> cIds, List<RequestStatus> statuses);

    List<ProjectRequest> findByCategoryIdInAndRequestStatusInAndIsAvailableTrue(List<Long> cIds, List<RequestStatus> statuses);

    List<ProjectRequest> findByCategoryIdInAndRequestStatusInAndIsAvailableTrueAndIsBusinessTrue(List<Long> cIds, List<RequestStatus> statuses);

    List<ProjectRequest> findByCategoryIdInAndRequestStatusInAndIsBusinessFalse(List<Long> cIds, List<RequestStatus> statuses);

    List<ProjectRequest> findByCategoryIdInAndRequestStatusInAndIsBusinessTrue(List<Long> cIds, List<RequestStatus> statuses);

    List<ProjectRequest> findByCategoryIdInAndRequestStatusInAndIsBusinessTrueAndIsAvailableTrue(List<Long> cIds, List<RequestStatus> statuses);

    List<ProjectRequest> findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(List<RequestStatus> statuses, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(List<RequestStatus> statuses, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(List<RequestStatus> statuses, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessFalse(List<RequestStatus> statuses, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrue(List<RequestStatus> statuses, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(List<RequestStatus> statuses, String name);

    List<ProjectRequest> findByCategoryIdInAndRefashioneeUsernameAndIsAvailableTrue(List<Long> cIds, String username);

    List<ProjectRequest> findByRequestStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(List<RequestStatus> statuses, String title);

    List<ProjectRequest> findByRequestStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrue(List<RequestStatus> statuses, String title);

    List<ProjectRequest> findByRequestStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(List<RequestStatus> statuses, String title);

    List<ProjectRequest> findByRequestStatusInAndTitleContainingIgnoreCaseAndIsBusinessFalse(List<RequestStatus> statuses, String title);

    List<ProjectRequest> findByRequestStatusInAndTitleContainingIgnoreCaseAndIsBusinessTrue(List<RequestStatus> statuses, String title);

    List<ProjectRequest> findByRequestStatusInAndTitleContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(List<RequestStatus> statuses, String title);


    @Query("SELECT p FROM ProjectRequest p JOIN p.refashionee r JOIN p.tagList t WHERE (r.username = ?1 AND t.name like lower(concat('%', ?2,'%'))) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByTagNameAndUsername(String username, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndTagNameNormal(List<RequestStatus> statuses, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndTagName(List<RequestStatus> statuses, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndTagNameBusiness2(List<RequestStatus> statuses, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndTagName2(List<RequestStatus> statuses, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndTagNameBusiness(List<RequestStatus> statuses, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND t.name like lower(concat('%', ?2,'%')) AND p.isBusiness is TRUE AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndTagNameBusinessAndIsBusiness(List<RequestStatus> statuses, String tag);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndMaterialNameNormal(List<RequestStatus> statuses, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndMaterialName(List<RequestStatus> statuses, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndMaterialNameBusiness2(List<RequestStatus> statuses, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndMaterialName2(List<RequestStatus> statuses, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndMaterialNameBusiness(List<RequestStatus> statuses, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND m.name like lower(concat('%', ?2,'%')) AND p.isBusiness is TRUE AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndMaterialNameBusinessAndIsAvailable(List<RequestStatus> statuses, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.refashionee r JOIN p.materialList m WHERE (r.username = ?1 AND m.name like lower(concat('%', ?2,'%'))) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByMaterialNameAndUsername(String username, String material);

    @Query("SELECT p FROM ProjectRequest p JOIN p.refashionee r WHERE r.username = ?1 AND p.title like lower(concat('%', ?2,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRefashioneeUsernameAndTitleContainingIgnoreCase(String username, String title);

    List<ProjectRequest> findByRefashioneeUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(String username, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.refashionee r WHERE r.username = (:username)")
    List<ProjectRequest> findByRefashioneeUsername(@Param("username") String username);

    List<ProjectRequest> findByRequestStatusInAndRefashioneeUsernameAndIsAvailableTrue(List<RequestStatus> statuses, String username);

    List<ProjectRequest> findByRequestStatusInAndRefashioneeUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(List<RequestStatus> statuses, String username, String name);

    List<ProjectRequest> findByRequestStatusInAndRefashioneeUsernameAndTitleContainingIgnoreCaseAndIsAvailableTrue(List<RequestStatus> statuses, String username, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.refashionee r JOIN p.tagList t WHERE p.requestStatus in ?1 AND r.username = ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndRefashioneeUsernameAndTag(List<RequestStatus> statuses, String username, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.refashionee r JOIN p.materialList m WHERE p.requestStatus in ?1 AND r.username = ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndRefashioneeUsernameAndMaterial(List<RequestStatus> statuses, String username, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND category_id in ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndTagNameNormal(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND category_id in ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndTagName(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND category_id in ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndTagNameBusiness2(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND category_id in ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndTagName2(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND category_id in ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndTagNameBusiness(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.tagList t WHERE p.requestStatus in ?1 AND category_id in ?2 AND t.name like lower(concat('%', ?3,'%')) AND p.isBusiness is TRUE and p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndTagNameBusinessAndIsAvailable(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND category_id in ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndMaterialNameNormal(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND category_id in ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndMaterialName(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND category_id in ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isAvailable is TRUE AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndMaterialNameBusiness2(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND category_id in ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isBusiness is FALSE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndMaterialName2(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND category_id in ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isBusiness is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndMaterialNameBusiness(List<RequestStatus> statuses, List<Long> cIds, String name);

    @Query("SELECT p FROM ProjectRequest p JOIN p.materialList m WHERE p.requestStatus in ?1 AND category_id in ?2 AND m.name like lower(concat('%', ?3,'%')) AND p.isBusiness is TRUE AND p.isAvailable is TRUE")
    List<ProjectRequest> findByRequestStatusInAndCategoryAndMaterialNameBusinessAndIsAvailable(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessFalse(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrue(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(List<RequestStatus> statuses, List<Long> cIds, String name);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(List<RequestStatus> statuses, List<Long> cIds, String title);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrue(List<RequestStatus> statuses, List<Long> cIds, String title);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(List<RequestStatus> statuses, List<Long> cIds, String title);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsBusinessFalse(List<RequestStatus> statuses, List<Long> cIds, String title);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsBusinessTrue(List<RequestStatus> statuses, List<Long> cIds, String title);

    List<ProjectRequest> findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(List<RequestStatus> statuses, List<Long> cIds, String title);

}
