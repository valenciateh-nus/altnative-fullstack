package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.MaterialAlreadyExistsException;
import com.altnative.Alt.Native.Exceptions.MaterialNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoMaterialExistsException;
import com.altnative.Alt.Native.Model.Material;

import java.util.List;

public interface MaterialService {
    public Material createNewMaterial(Material material) throws MaterialAlreadyExistsException, NoAccessRightsException;
    public List<Material> retrieveAllMaterials() throws NoMaterialExistsException;
    public Material retrieveMaterialById(Long id) throws MaterialNotFoundException;
    public Material retrieveMaterialByName(String name) throws MaterialNotFoundException;
    public Material updateMaterial(Material newMaterial) throws MaterialNotFoundException, MaterialAlreadyExistsException, NoAccessRightsException;
    public void deleteMaterialById(Long id) throws MaterialNotFoundException, NoAccessRightsException;
    public void deleteMaterialByName(String name) throws MaterialNotFoundException, NoAccessRightsException;
}
