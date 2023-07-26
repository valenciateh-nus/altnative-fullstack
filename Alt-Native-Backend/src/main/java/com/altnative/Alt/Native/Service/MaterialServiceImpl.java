package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.MaterialAlreadyExistsException;
import com.altnative.Alt.Native.Exceptions.MaterialNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoMaterialExistsException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.MarketplaceListing;
import com.altnative.Alt.Native.Model.Material;
import com.altnative.Alt.Native.Repository.MaterialRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MaterialServiceImpl implements MaterialService {
    private final MaterialRepo materialRepo;
    private AppUserService appUserService;
    private UserService userService;

    @Override
    public Material createNewMaterial(Material material) throws MaterialAlreadyExistsException, NoAccessRightsException {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (!appUser.getRoles().contains(Role.ADMIN) && !appUser.getRoles().contains(Role.USER_REFASHIONER)) {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }

        Material m = materialRepo.findByName(material.getName());
        if (m == null) {
            materialRepo.save(material);
            return material;
        } else {
            throw new MaterialAlreadyExistsException("Material with same name: " + material.getName() + " already exists!");
        }
    }

    @Override
    public List<Material> retrieveAllMaterials() throws NoMaterialExistsException {
        List<Material> materialList = new ArrayList<Material>();
        materialList = materialRepo.findAll();
        if (materialList.isEmpty()) {
            throw new NoMaterialExistsException("There are no materials in the database.");
        } else {
            return materialList;
        }
    }

    @Override
    public Material retrieveMaterialById(Long id) throws MaterialNotFoundException {
        Optional<Material> materialOptional = materialRepo.findById(id);
        if (materialOptional.isEmpty()) {
            throw new MaterialNotFoundException("Material with ID: " + id + " not found.");
        } else {
            return materialOptional.get();
        }
    }

    @Override
    public Material retrieveMaterialByName(String name) throws MaterialNotFoundException {
        Material materialOptional = materialRepo.findByName(name);
        if (materialOptional == null) {
            throw new MaterialNotFoundException("Material with name: " + name + " not found.");
        } else {
            return materialOptional;
        }
    }

    @Override
    public Material updateMaterial(Material newMaterial) throws MaterialNotFoundException, MaterialAlreadyExistsException, NoAccessRightsException {
        Optional<Material> materialOptional = materialRepo.findById(newMaterial.getId());

        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (!appUser.getRoles().contains(Role.ADMIN)) {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }

        if (materialOptional.isEmpty()) {
            throw new MaterialNotFoundException("Material with ID: " + newMaterial.getId() + " not found.");
        } else {
            Material mat = materialOptional.get();
           Material check = materialRepo.findByName(mat.getName());
            if (check == null) {
                mat.setId(newMaterial.getId());
                mat.setName(newMaterial.getName());
                materialRepo.save(mat);
                return mat;
            } else {
                throw new MaterialAlreadyExistsException("Material with name already exists: " + mat.getName());
            }
        }
    }

    @Override
    public void deleteMaterialById(Long id) throws MaterialNotFoundException, NoAccessRightsException {
        Optional<Material> materialOptional = materialRepo.findById(id);

        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (!appUser.getRoles().contains(Role.ADMIN)) {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }

        if (materialOptional.isEmpty()) {
            throw new MaterialNotFoundException("Material with ID: " + id + " not found.");
        } else {
            Material mat = materialOptional.get();
            materialRepo.delete(mat);
//            materialRepo.deleteById(id);
            materialRepo.flush();
        }
    }

    @Override
    public void deleteMaterialByName(String name) throws MaterialNotFoundException, NoAccessRightsException {
        Material materialOptional = materialRepo.findByName(name);

        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (!appUser.getRoles().contains(Role.ADMIN)) {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }

        if (materialOptional == null) {
            throw new MaterialNotFoundException("Material with name: " + name + " not found.");
        } else {
            Material mat = materialOptional;
            materialRepo.delete(mat);
            materialRepo.flush();
        }
    }
}
