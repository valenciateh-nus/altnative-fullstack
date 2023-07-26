package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.TagNotFoundException;
import com.altnative.Alt.Native.Model.Tag;

import java.util.List;

public interface TagService {
    Tag createTag(Tag tag);
    public Tag retrieveTagByName(String name) throws TagNotFoundException;
    public List<Tag> retrieveAllTags();
    public Tag retrieveTagById(Long id) throws TagNotFoundException;
    public String deleteTag(Long id) throws TagNotFoundException;
}

