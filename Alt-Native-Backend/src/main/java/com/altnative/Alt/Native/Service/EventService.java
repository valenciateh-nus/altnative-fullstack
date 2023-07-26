package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.EventEnum;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Event;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

public interface EventService {

    Event createEvent(List<MultipartFile> files, Event event) throws InvalidFileException, S3Exception, NoAccessRightsException;
    void addImageToEvent(Long eventId, MultipartFile image) throws NoAccessRightsException, EventNotFoundException, InvalidFileException, S3Exception;
    void removeImageFromEvent(Long eventId, Long imageId) throws NoAccessRightsException, EventNotFoundException;
    Event editAnEvent(Long eventId, Event newEvent) throws NoAccessRightsException, EventNotFoundException;
    void deleteEvent(Long eventId) throws NoAccessRightsException, EventNotFoundException;
    List<Event> retrieveAllEvents() throws NoAccessRightsException;
    List<Event> retrieveAllOpenEvents();
    List<Event> retrieveAllFullEvents();
    List<Event> retrieveAllUpcomingEvents();
    List<Event> retrieveAllClosedEvents() throws NoAccessRightsException;
    List<Event> retrieveOwnEvents();
    Event viewEvent(Long eventId) throws NoAccessRightsException, EventNotFoundException;
    Event signUpForEvent(Long eventId, Integer numberOfPax) throws EventNotFoundException, InsufficientSlotsForEventException, InvalidOfferException, NoAccessRightsException, OfferNotFoundException;
}
