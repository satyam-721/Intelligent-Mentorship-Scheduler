package team.cryptonians.Scheduler.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.cryptonians.Scheduler.dto.SlotRequest;
import team.cryptonians.Scheduler.model.AvailabilitySlot;
import team.cryptonians.Scheduler.model.User;
import team.cryptonians.Scheduler.repo.SlotRepo;
import team.cryptonians.Scheduler.repo.UserRepo;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

@Service
public class MentorService {

    @Autowired
    SlotRepo slotRepo;

    @Autowired
    UserRepo userRepo;

    public AvailabilitySlot save(SlotRequest request) {
        //TODO: Mentor id should fetch from jwt

        User mentor = userRepo.findById(request.mentorId())
                .orElseThrow(() ->
                        new RuntimeException("Mentor not found"));

        ZoneId zoneId = ZoneId.of(mentor.getTimezone());

        ZoneOffset offset =
                zoneId.getRules().getOffset(Instant.now());

        LocalTime startTimeUtc = request.startTime().minusSeconds(offset.getTotalSeconds());
        LocalTime endTimeUtc = request.endTime().minusSeconds(offset.getTotalSeconds());


        AvailabilitySlot slot = AvailabilitySlot.builder()
                .mentor(mentor)
                .slotType(request.slotType())
                .startTimeUtc(startTimeUtc)
                .endTimeUtc(endTimeUtc)
                .dayOfWeek(request.dayOfWeek())
                .slotDate(request.slotDate())
                .sessionDurationMinutes(request.sessionDurationMinutes())
                .bufferMinutes(request.bufferMinutes())
                .notes(request.notes())
                .build();

        return slotRepo.save(slot);

    }
}
