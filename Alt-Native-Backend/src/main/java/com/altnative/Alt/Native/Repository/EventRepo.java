package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Model.Event;
import com.altnative.Alt.Native.Model.ProjectRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.altnative.Alt.Native.Enum.EventEnum;

import javax.persistence.NamedQuery;
import java.util.List;

public interface EventRepo extends JpaRepository<Event, Long> {

//    @Query("SELECT e FROM Event e WHERE e.eventEnum = EventEnum.OPEN")
//    List<Event> findAllOpenEvents();
//
//    @Query("SELECT e FROM Event e WHERE e.eventEnum = UPCOMING")
//    List<Event> findAllUpcomingEvents();
//
//    @Query("SELECT e FROM Event e WHERE e.eventEnum = CLOSED")
//    List<Event> findAllClosedEvents();
//
//    @Query("SELECT e FROM Event e WHERE e.eventEnum = FULL")
//    List<Event> findAllFullEvents();

    List<Event> findByEventEnumIn(List<EventEnum> eventEnums);

//    @Query("SELECT e FROM Event e WHERE e.eventEnum in ?0")
//    List<Event> findAllOpenEvents();
//
//    @Query("SELECT e FROM Event e WHERE e.eventEnum in ?1")
//    List<Event> findAllUpcomingEvents();
//
//    @Query("SELECT e FROM Event e WHERE e.eventEnum in ?2")
//    List<Event> findAllClosedEvents();
//
//    @Query("SELECT e FROM Event e WHERE e.eventEnum in ?3")
//    List<Event> findAllFullEvents();

}
