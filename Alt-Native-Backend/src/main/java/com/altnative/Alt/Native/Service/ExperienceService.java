package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.ExperienceNotFoundException;
import com.altnative.Alt.Native.Model.Experience;

import java.util.List;

public interface ExperienceService {
    List<Experience> createListOfExperiences(List<Experience> experiences);
    public List<Experience> retrieveAllExperiences();
    public Experience retrieveExperienceById(Long id) throws ExperienceNotFoundException, NoAccessRightsException;
    public Experience updateExperience(Experience experience) throws ExperienceNotFoundException, NoAccessRightsException;
    public List<Experience> updateListOfExperiences(List<Experience> experiences) throws ExperienceNotFoundException, NoAccessRightsException;
    public List<Experience> retrieveListOfExperiencesByUserId(Long id);
    public void deleteExperience(Long id) throws ExperienceNotFoundException, NoAccessRightsException;
}
