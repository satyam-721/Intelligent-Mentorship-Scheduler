package team.cryptonians.Scheduler.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id")
    private AvailabilitySlot slot;


    //SESSION time window (not nullable)

    @Column(name = "start_utc", nullable = false)
    private Instant startUtc;

    @Column(name = "end_utc", nullable = false)
    private Instant endUtc;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    //Booking Status Lifecycle
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    public enum BookingStatus{
        PENDING,
        CONFIRMED,
        COMPLETED,
        CANCELLED,         //may implement later
        REJECTED
    }


    //-------------------------------
    //Google integration
    //-------------------------------

    //Google calender
    private String googleEventId;

    //GoogleMeet
    private String meetLink;

    //more to add based on Google


    //__________________________
    //Session Content
    //________________________

    private String sessionAgenda;

    private Integer studentRating;

    private String studentReview;

    private Instant reviewSubmittedAt;


    private Boolean confirmationEmailSent = false;


    private Instant createdAt;



    public boolean isPending() {
        return BookingStatus.PENDING.equals(this.status);
    }

    public boolean isConfirmed() {
        return BookingStatus.CONFIRMED.equals(this.status);
    }

    public boolean isCancelled() {
        return BookingStatus.CANCELLED.equals(this.status);
    }

    public boolean isCompleted() {
        return BookingStatus.COMPLETED.equals(this.status);
    }

    /** True if the session is in the future and not cancelled/rejected. */
    public boolean isUpcoming() {
        return (isPending() || isConfirmed()) && startUtc.isAfter(Instant.now());
    }

    /** True if a student review can still be submitted. */
    public boolean isReviewable() {
        return isCompleted() && studentRating == null;
    }
}
