package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.EventEnum;
import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.EventRepo;
import com.amazonaws.services.ecr.model.ImageNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EventServiceImpl implements EventService {

    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;
    private final EventRepo eventRepo;

    @Override
    public Event createEvent(List<MultipartFile> files, Event newEvent) throws InvalidFileException, S3Exception, NoAccessRightsException {
        //Only admins can create events
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.ADMIN)) {

            Event event = new Event();

            if (files != null) {
                event.setImageList(new ArrayList<Image>());

                for (int i = 0; i < files.size(); i++) {
                    String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                    String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                    Image newImage = new Image();
                    newImage.setPath(path);
                    newImage.setFileName(filename);
                    newImage = imageService.createImage(newImage, files.get(i));
                    event.getImageList().add(newImage);
                }
            }
            event.setEventName(newEvent.getEventName());
            event.setEventDescription(newEvent.getEventDescription());
            event.setEventDateAndTime(newEvent.getEventDateAndTime());
            event.setEventSignupEndDate(newEvent.getEventSignupEndDate());
            event.setMaximumCapacity(newEvent.getMaximumCapacity());
            event.setPricePerPax(newEvent.getPricePerPax());
            event.setEventLocation(newEvent.getEventLocation());
            event.setEventHostName(newEvent.getEventHostName());
            event.setEventEnum(newEvent.getEventEnum());
            event.setCurrentCount(0);
            eventRepo.save(event);
            System.out.print("Event is currently " + event);
            log.info(event.toString());
            return event;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public void addImageToEvent(Long eventId, MultipartFile file) throws NoAccessRightsException, EventNotFoundException, InvalidFileException, S3Exception {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Event> exists = eventRepo.findById(eventId);
        if (exists.isEmpty()) {
            throw new EventNotFoundException("Event id: " + eventId + " does not exist.");
        } else {
            Event event = exists.get();
            if (user.getRoles().contains(Role.ADMIN)) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, file);
                event.getImageList().add(newImage);
                eventRepo.save(event);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to perform this method!");
            }
        }
    }

    @Override
    public void removeImageFromEvent(Long eventId, Long imageId) throws NoAccessRightsException, EventNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Event> exists = eventRepo.findById(eventId);
        if (exists.isEmpty()) {
            throw new EventNotFoundException("Event id: " + eventId + " does not exist.");
        } else {
            Event event = exists.get();
            if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Image> eventImages = event.getImageList();
                boolean found = false;
                for (Image image : eventImages) {
                    log.info("current image id" + image.getId() + " while the inserted id is " + imageId);
                    if (image.getId() == imageId || image.getId().equals(imageId)) {
                        log.info("the image has been found");
                        found = true;
                        eventImages.remove(image);
                        imageService.deleteImage(image);
                        break;
                    }
                }
                if (!found) { //not found
                    throw new ImageNotFoundException("Event does not contain this image!");
                }
                event.setImageList(eventImages);
                eventRepo.save(event);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
    }

    @Override
    public Event editAnEvent(Long eventId, Event newEvent) throws NoAccessRightsException, EventNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Event> exists = eventRepo.findById(eventId);
        if (exists.isEmpty()) {
            throw new EventNotFoundException("Event id: " + eventId + " does not exist.");
        } else {
            Event event = exists.get();
            if (user.getRoles().contains(Role.ADMIN)) {
                event.setEventName(newEvent.getEventName());
                event.setEventDescription(newEvent.getEventDescription());
                event.setEventLocation(newEvent.getEventLocation());
                event.setEventHostName(newEvent.getEventHostName());
                event.setEventDateAndTime(newEvent.getEventDateAndTime());
                event.setEventSignupStartDate(newEvent.getEventSignupStartDate());
                event.setEventSignupEndDate(newEvent.getEventSignupEndDate());
                event.setPricePerPax(newEvent.getPricePerPax());
                event.setMaximumCapacity(newEvent.getMaximumCapacity());
                event.setAdditionalInformation(newEvent.getAdditionalInformation());
                event.setEventEnum(newEvent.getEventEnum());
                eventRepo.save(event);
                return event;
            } else {
                throw new NoAccessRightsException("You do not have the access rights to perform this method!");
            }
        }
    }

    @Override
    public void deleteEvent(Long eventId) throws NoAccessRightsException, EventNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Event> exists = eventRepo.findById(eventId);
        if (exists.isEmpty()) {
            throw new EventNotFoundException("Event id: " + eventId + " does not exist.");
        } else {
            if (user.getRoles().contains(Role.ADMIN)) {
                Event event = exists.get();
                eventRepo.delete(event);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to perform this method!");
            }
        }
    }

    @Override
    public List<Event> retrieveAllEvents() throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.ADMIN)) {
            return eventRepo.findAll();
        } else {
            throw new NoAccessRightsException("You do not have the access rights to perform this method!");
        }
    }

    @Override
    public List<Event> retrieveAllOpenEvents() {
//        return eventRepo.findAllOpenEvents();
        return eventRepo.findByEventEnumIn(Arrays.asList(EventEnum.OPEN));
    }

    @Override
    public List<Event> retrieveAllFullEvents() {
//        return eventRepo.findAllFullEvents();
        return eventRepo.findByEventEnumIn(Arrays.asList(EventEnum.FULL));
    }

    @Override
    public List<Event> retrieveAllUpcomingEvents() {
//        return eventRepo.findAllUpcomingEvents();
        return eventRepo.findByEventEnumIn(Arrays.asList(EventEnum.UPCOMING));
    }

    @Override
    public List<Event> retrieveAllClosedEvents() throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.ADMIN)) {
//            return eventRepo.findAllClosedEvents();
            return eventRepo.findByEventEnumIn(Arrays.asList(EventEnum.CLOSED));
        } else {
            throw new NoAccessRightsException("You do not have the access rights to perform this method!");
        }
    }

    @Override
    public List<Event> retrieveOwnEvents()  {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        List<Long> eventIds = user.getEventIds();
        List<Event> events = new ArrayList<>();
        for (int i = 0; i < events.size(); i++) {
            Event event = eventRepo.getById(eventIds.get(i));
            events.add(event);
        }
        return events;
    }

    @Override
    public Event viewEvent(Long eventId) throws NoAccessRightsException, EventNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Event> exists = eventRepo.findById(eventId);
        if (exists.isEmpty()) {
            throw new EventNotFoundException("Event id: " + eventId + " does not exist.");
        } else {
            Event event = exists.get();
            if (event.getEventEnum().equals(EventEnum.OPEN) || user.getRoles().contains(Role.ADMIN)) {
                return event;
            } else {
                throw new NoAccessRightsException("You do not have the access rights to perform this method!");
            }
        }
    }

    @Override
    public Event signUpForEvent(Long eventId, Integer numberOfPax) throws EventNotFoundException, InsufficientSlotsForEventException, InvalidOfferException, NoAccessRightsException, OfferNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Event> exists = eventRepo.findById(eventId);
        if (exists.isEmpty()) {
            throw new EventNotFoundException("Event id: " + eventId + " does not exist.");
        } else {
            Event event = exists.get();
            Integer eventCapacity = event.getMaximumCapacity();
            Integer currCapacity = event.getCurrentCount();
            if (currCapacity + numberOfPax <= eventCapacity) {
                for (int i = 0; i < numberOfPax; i++) {
                    user.getEventIds().add(event.getId());
                    event.getParticipants().add(user.getUsername());
                    //make payment
                }
                event.setCurrentCount(currCapacity + numberOfPax);
            } else {
                if (currCapacity == eventCapacity) {
                    event.setEventEnum(EventEnum.FULL);
                }
                throw new InsufficientSlotsForEventException("There are insufficient slots for this event!");
            }
            return event;
        }
    }
}
