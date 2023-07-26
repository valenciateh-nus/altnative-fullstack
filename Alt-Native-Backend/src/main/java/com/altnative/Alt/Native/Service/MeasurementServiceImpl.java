package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.MeasurementExistsAlreadyException;
import com.altnative.Alt.Native.Exceptions.MeasurementNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Measurement;
import com.altnative.Alt.Native.Repository.MeasurementRepo;
import com.amazonaws.services.connect.model.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MeasurementServiceImpl implements MeasurementService {
    private final MeasurementRepo measurementRepo;
    private final AppUserService appUserService;
    private final UserService userService;

    @Override
    public Measurement createMeasurement() { //would not be used typically
        Measurement measurement = new Measurement();
        measurementRepo.save(measurement);
        return measurement;
    }

    @Override
    public Measurement createMeasurement(Measurement measurement) throws MeasurementExistsAlreadyException { //would not be used typically
        Optional<Measurement> measurementOptional = measurementRepo.findById(measurement.getId());
        if (measurementOptional.isPresent()) {
            throw new MeasurementExistsAlreadyException("Measurement with ID: " + measurement.getId() + " exists already!");
        } else {
            measurementRepo.save(measurement);
            return measurement;
        }
    }

    @Override
    public Measurement updateMeasurement(Measurement measurement) throws MeasurementNotFoundException {
        Optional<Measurement> measurementToBeUpdated = measurementRepo.findById(measurement.getId());
        if (measurementToBeUpdated.isEmpty()) {
            throw new MeasurementNotFoundException("Measurement with ID: " + measurement.getId() + " not found!");
        } else {
            Measurement measurement1 = measurementToBeUpdated.get();

            if (measurement.getDown() != 0) {
                measurement1.setDown(measurement.getDown());
            }
            if (measurement.getCalfCircumference() != 0) {
                measurement1.setCalfCircumference(measurement.getCalfCircumference());
            }

            if (measurement.getHips() != 0) {
                measurement1.setHips(measurement.getHips());
            }

            if (measurement.getChestCircumference() != 0) {
                measurement1.setChestCircumference(measurement.getChestCircumference());
            }

            if (measurement.getPtp() != 0) {
                measurement1.setPtp(measurement.getPtp());
            }

            if (measurement.getKneeCircumference() != 0) {
                measurement1.setKneeCircumference(measurement.getKneeCircumference());
            }

            if (measurement.getShoulderWidth() != 0) {
                measurement1.setShoulderWidth(measurement.getShoulderWidth());
            }

            if (measurement.getSleeveCircumference() != 0) {
                measurement1.setSleeveCircumference(measurement.getSleeveCircumference());
            }

            if (measurement.getSleeveLength() != 0) {
                measurement1.setSleeveLength(measurement.getSleeveLength());
            }

            if (measurement.getWaist() != 0) {
                measurement1.setWaist(measurement.getWaist());
            }

            if (measurement.getTorsoLength() != 0) {
                measurement1.setTorsoLength(measurement.getTorsoLength());
            }

            if (measurement.getThighCircumference() != 0) {
                measurement1.setThighCircumference(measurement.getThighCircumference());
            }


            measurement1.setId(measurement.getId());
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            user.setMeasurement(measurement1);
            measurementRepo.save(measurement1);
            measurementRepo.flush();

            return measurement1;
        }
    }

    @Override
    public Measurement retrieveMeasurementById(Long id) throws MeasurementNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Measurement> measurementOptional = measurementRepo.findById(id);
        if (measurementOptional.isEmpty()) {
            throw new MeasurementNotFoundException("Measurement with ID: " + id + " not found!");
        } else {
            return measurementOptional.get();
        }
    }


    @Override
    public Measurement retrieveMeasurementByUser() throws MeasurementNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        Measurement m = user.getMeasurement();
        if (m == null) {
            throw new MeasurementNotFoundException("Measurement not found for user with user id: " + user.getId());
        }
        return user.getMeasurement();
//        return new Measurement();
    }

    @Override
    public Measurement retrieveMeasurementByUsername(String username) throws MeasurementNotFoundException, UserNotFoundException {
        AppUser user = appUserService.getUser(username);
        if (user.getMeasurement() == null) {
            throw new MeasurementNotFoundException("Measurement for user has not been set up yet!");
        } else {
            return user.getMeasurement();
        }
    }

    @Override
    public Measurement retrieveMeasurementByUserId(Long id) throws MeasurementNotFoundException, UserNotFoundException {
        AppUser user = appUserService.getUserById(id);
        if (user.getMeasurement() == null) {
            throw new MeasurementNotFoundException("Measurement for user has not been set up yet!");
        } else {
            return user.getMeasurement();
        }
    }

    @Override
    public void deleteMeasurementById(Long id) throws MeasurementNotFoundException, NoAccessRightsException { //should not be used, can remove values but cannot delete the measurement
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getMeasurement().getId() == id || user.getRoles().contains(Role.valueOf("ADMIN"))) {
            Optional<Measurement> measurementOptional = measurementRepo.findById(id);
            if (measurementOptional.isEmpty()) {
                throw new MeasurementNotFoundException("Measurement with id: " + id + " not found!");
            } else {
                user.setMeasurement(new Measurement());
                measurementRepo.deleteById(id);
                measurementRepo.flush();
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }
}
