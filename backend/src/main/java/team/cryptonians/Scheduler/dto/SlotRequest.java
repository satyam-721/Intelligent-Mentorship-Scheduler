package team.cryptonians.Scheduler.dto;

import team.cryptonians.Scheduler.model.AvailabilitySlot;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public record SlotRequest(
    AvailabilitySlot.SlotType slotType,
    Integer mentorId,

    LocalTime startTime,
    LocalTime endTime,

    DayOfWeek dayOfWeek,
    LocalDate slotDate,

    Integer sessionDurationMinutes,
    Integer bufferMinutes,

    String notes


) {
}
