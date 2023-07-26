package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.TagNotFoundException;
import com.altnative.Alt.Native.Model.Tag;
import com.altnative.Alt.Native.Repository.TagRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TagServiceImpl implements TagService {
    private final TagRepo tagRepo;

    @Override
    public Tag createTag(Tag tag) {
        //will need to fetch the project to add this tag to their list, then save this one.
        log.info("Saving new tag {} to db", tag.getName());
        tagRepo.save(tag);
        return tag;
    }

    @Override
    public Tag retrieveTagById(Long id) throws TagNotFoundException {
        Optional<Tag> exists = tagRepo.findById(id);
        if (exists.isEmpty()) {
            throw new TagNotFoundException("Tag id: " + id + " does not exist.");
        } else {
            return exists.get();
        }
    }

    @Override
    public Tag retrieveTagByName(String name) throws TagNotFoundException {
        Tag exists = tagRepo.findByName(name);
        if (exists!=null) {
            return exists;
        } else {
            throw new TagNotFoundException(name + "does not exist.");
        }
    }

    @Override
    public List<Tag> retrieveAllTags() {
        return tagRepo.findAll();
    }

    @Override
    public String deleteTag(Long id) throws TagNotFoundException {
        Tag tag = retrieveTagById(id);
        tagRepo.deleteById(id);
        return "Tag deleted successfully, id: " + id;
    }
}
