package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;

public interface RevenueService {
    Double retrieveRevenueByDate(DateDto dates);

    Double retrieveRefashionerRevenueByDate();
}
