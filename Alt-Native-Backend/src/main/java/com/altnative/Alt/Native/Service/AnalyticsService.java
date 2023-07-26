package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.analytics.Refashioners;
import com.altnative.Alt.Native.Dto.analytics.Searches;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoReviewsFoundException;
import com.altnative.Alt.Native.Exceptions.ReviewNotFoundException;
import com.altnative.Alt.Native.Model.AdminRecord;
import com.altnative.Alt.Native.Model.Review;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface AnalyticsService {
    void saveTopSearches(List<Searches> searches);

    List<String> getTopSearches();

    AdminRecord createRecord(AdminRecord adminRecord);

    void saveTopRefashioners(List<Refashioners> refashioners);

    List<String> getTopRefashioners();

    List<AdminRecord> retrieveAllRecords();
}
