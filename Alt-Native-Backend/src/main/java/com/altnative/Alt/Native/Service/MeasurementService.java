package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.MeasurementExistsAlreadyException;
import com.altnative.Alt.Native.Exceptions.MeasurementNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Measurement;
import com.amazonaws.services.connect.model.UserNotFoundException;

public interface MeasurementService {
    Measurement createMeasurement();

    Measurement createMeasurement(Measurement measurement) throws MeasurementExistsAlreadyException;

    Measurement updateMeasurement(Measurement measurement) throws MeasurementNotFoundException;

    Measurement retrieveMeasurementById(Long id) throws MeasurementNotFoundException, NoAccessRightsException;

    Measurement retrieveMeasurementByUser() throws MeasurementNotFoundException;

    Measurement retrieveMeasurementByUsername(String username) throws MeasurementNotFoundException, UserNotFoundException;

    Measurement retrieveMeasurementByUserId(Long id) throws MeasurementNotFoundException, UserNotFoundException;

    void deleteMeasurementById(Long id) throws MeasurementNotFoundException, NoAccessRightsException;
}
