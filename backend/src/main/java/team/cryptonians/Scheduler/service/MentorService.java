package team.cryptonians.Scheduler.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import team.cryptonians.Scheduler.dto.SlotRequest;
import team.cryptonians.Scheduler.model.AvailabilitySlot;
import team.cryptonians.Scheduler.model.User;
import team.cryptonians.Scheduler.repo.SlotRepo;
import team.cryptonians.Scheduler.repo.UserRepo;

import java.time.*;

@Service
public class MentorService {

    @Autowired
    SlotRepo slotRepo;

    @Autowired
    UserRepo userRepo;

    public AvailabilitySlot save(SlotRequest request) {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String mentorName = auth.getName();



        User mentor = userRepo.findByUsername(mentorName);

        ZoneId zoneId = ZoneId.of(mentor.getTimezone());

        ZoneOffset offset =
                zoneId.getRules().getOffset(Instant.now());

        LocalDateTime startTimeUtc = request.startTime().minusSeconds(offset.getTotalSeconds());
        LocalDateTime endTimeUtc = request.endTime().minusSeconds(offset.getTotalSeconds());


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
                .is_active(true)
                .createdAt(Instant.now())
                .build();

        return slotRepo.save(slot);

    }
}
