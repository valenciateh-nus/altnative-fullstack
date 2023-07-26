package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.analytics.Refashioners;
import com.altnative.Alt.Native.Dto.analytics.Searches;
import com.altnative.Alt.Native.Model.AdminRecord;
import com.altnative.Alt.Native.Repository.AdminRecordRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AdminRecordRepo adminRecordRepo;

    @Override
    public AdminRecord createRecord(AdminRecord adminRecord) {
        adminRecord.setDateCreated(new Date());
        return adminRecordRepo.save(adminRecord);
    }

    @Override
    public void saveTopSearches(List<Searches> searches) {
        List<AdminRecord> records = retrieveAllRecords();
        AdminRecord record = records.get(0);

        Map<String, Integer> queries = new HashMap<>();
        for (Searches s : searches) {
            String query = s.getValue();
            Integer occurrence = s.getOccurrence();
            queries.put(query, occurrence);
        }
        record.setTopSearches(queries);
        record.setDateCreated(new Date());
        adminRecordRepo.save(record);
    }

    @Override
    public List<String> getTopSearches() {
        List<AdminRecord> records = retrieveAllRecords();
        AdminRecord record = records.get(0);
        Map<String, Integer> map = record.getTopSearches();
        Map<String, Integer> sorted = map.entrySet().stream()
                .sorted(Comparator.comparingInt(e -> -e.getValue()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> { throw new AssertionError(); },
                        LinkedHashMap::new
                ));
        List<String> searches = new ArrayList<String>(sorted.keySet());
        return searches;
    }

    @Override
    public void saveTopRefashioners(List<Refashioners> refashioners) {
        List<AdminRecord> records = retrieveAllRecords();
        AdminRecord record = records.get(0);

        Map<String, Integer> usernames = new HashMap<>();
        for (Refashioners r : refashioners) {
            String username = r.getUsername();
            Integer occurrence = r.getOccurrence();
            usernames.put(username, occurrence);
        }
        record.setTopRefashioners(usernames);
        record.setDateCreated(new Date());
        adminRecordRepo.save(record);
    }

    @Override
    public List<String> getTopRefashioners() {
        List<AdminRecord> records = retrieveAllRecords();
        AdminRecord record = records.get(0);
        Map<String, Integer> map = record.getTopRefashioners();
        Map<String, Integer> sorted = map.entrySet().stream()
                .sorted(Comparator.comparingInt(e -> -e.getValue()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> { throw new AssertionError(); },
                        LinkedHashMap::new
                ));
        List<String> usernames = new ArrayList<String>(map.keySet());
        return usernames;
    }

    @Override
    public List<AdminRecord> retrieveAllRecords() {
        return adminRecordRepo.findAll();
    }
}

