package team.cryptonians.Scheduler.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import team.cryptonians.Scheduler.model.Booking;
import team.cryptonians.Scheduler.model.User;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;



@Service
public class EmailService {

    @Autowired
    IcsGeneratorService icsGeneratorService;

    @Autowired
    JavaMailSender mailSender;

    private static final DateTimeFormatter DISPLAY_FORMAT =
            DateTimeFormatter.ofPattern("EEE, dd MMM yyyy 'at' hh:mm a z");

    private static final String FROM_EMAIL = "satyamsagar305@gmail.com";
    private static final String FROM_NAME  = "MentorSync Scheduler";


    @Async
    public void sendBookingConfirmation(Booking booking, String meetLink) {
        System.out.println("Sending confirmation emails for booking "+ booking.getId());

        // Generate shared assets once
        String icsContent        = icsGeneratorService.generateIcsContent(booking, meetLink);
        String googleCalendarUrl = icsGeneratorService.generateGoogleCalendarUrl(booking, meetLink);

        // Send to student (time shown in student's timezone)
        sendToStudent(booking, meetLink, icsContent, googleCalendarUrl);

        // Send to mentor (time shown in mentor's timezone)
        sendToMentor(booking, meetLink, icsContent, googleCalendarUrl);

        System.out.println("Confirmation emails sent for booking "+ booking.getId());
    }


    // ─────────────────────────────────────────────
    // Email to student
    // ─────────────────────────────────────────────

    private void sendToStudent(Booking booking, String meetLink,
                               String icsContent, String googleCalendarUrl) {
        User student      = booking.getStudent();
        User   mentor       = booking.getMentor();
        String sessionTime  = formatTime(booking, student.getTimezone());
        String agenda       = booking.getSessionAgenda() != null
                ? booking.getSessionAgenda()
                : "Not specified";

        String subject = "✅ Your session with " + mentor.getUsername() + " is confirmed";

        String body = buildStudentEmailHtml(
                student.getUsername(),
                mentor,
                sessionTime,
                agenda,
                meetLink,
                googleCalendarUrl,
                booking.getId()
        );

        sendEmail(student.getEmail(), subject, body, icsContent, "session.ics");
    }




    // ─────────────────────────────────────────────
    // Email to mentor
    // ─────────────────────────────────────────────

    private void sendToMentor(Booking booking, String meetLink,
                              String icsContent, String googleCalendarUrl) {
        User   mentor      = booking.getMentor();
        User   student     = booking.getStudent();
        String sessionTime = formatTime(booking, mentor.getTimezone());
        String agenda      = booking.getSessionAgenda() != null
                ? booking.getSessionAgenda()
                : "Not specified";

        String subject = "📅 New session booked — "
                + student.getUsername() + ", "
                + formatDateOnly(booking, mentor.getTimezone());

        String body = buildMentorEmailHtml(
                mentor.getUsername(),
                student,
                sessionTime,
                agenda,
                meetLink,
                googleCalendarUrl,
                booking.getId()
        );

        sendEmail(mentor.getEmail(), subject, body, icsContent, "session.ics");
    }

    private void sendEmail(String to, String subject, String htmlBody,
                           String icsContent, String icsFilename) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(FROM_EMAIL, FROM_NAME);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);   // true = HTML

            // Attach .ics file
            // Content type "text/calendar" is what triggers calendar apps to recognize it
            helper.addAttachment(
                    icsFilename,
                    new ByteArrayResource(icsContent.getBytes()),
                    "text/calendar; charset=UTF-8; method=REQUEST"
            );

            mailSender.send(message);
            System.out.println("Email sent to "+to+": " + subject);

        } catch (Exception e) {
            System.out.println("Failed to send email to "+to+": " + e.getMessage());
            System.out.println(e);
            e.printStackTrace();
            // Don't throw — a failed email should not rollback the booking
        }
    }
    private String formatTime(Booking booking, String timezone) {
        ZonedDateTime zdt = booking.getStartUtc().atZone(ZoneId.of(timezone));
        ZonedDateTime end = booking.getEndUtc().atZone(ZoneId.of(timezone));
        return DISPLAY_FORMAT.format(zdt)
                + " – "
                + DateTimeFormatter.ofPattern("hh:mm a z").format(end);
    }

    private String formatDateOnly(Booking booking, String timezone) {
        ZonedDateTime zdt = booking.getStartUtc().atZone(ZoneId.of(timezone));
        return DateTimeFormatter.ofPattern("EEE dd MMM").format(zdt);
    }

    //htmls

    private String baseTemplate(String title, String content) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <style>
          body        { margin:0; padding:0; background:#1a1a1a; font-family: 'Segoe UI', sans-serif; color:#e0e0e0; }
          .wrapper    { max-width:560px; margin:32px auto; background:#242424; border-radius:12px; overflow:hidden; }
          .header     { background:#1e3a2f; padding:24px 32px; }
          .header h1  { margin:0; font-size:20px; color:#4ade80; letter-spacing:0.5px; }
          .header p   { margin:4px 0 0; font-size:13px; color:#86efac; }
          .body       { padding:28px 32px; }
          .body p     { margin:0 0 16px; line-height:1.6; }
          .card       { background:#1a1a1a; border:1px solid #2d2d2d; border-radius:8px; padding:20px; margin:20px 0; }
          .card h3    { margin:0 0 14px; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#4ade80; }
          table       { width:100%%; border-collapse:collapse; }
          td          { padding:8px 0; font-size:14px; vertical-align:top; }
          td:first-child { color:#9ca3af; width:110px; padding-right:12px; }
          .btn-primary  { display:inline-block; background:#4ade80; color:#0d1f16; text-decoration:none;
                          padding:12px 28px; border-radius:8px; font-weight:600; font-size:15px; }
          .btn-secondary{ display:inline-block; border:1px solid #4ade80; color:#4ade80; text-decoration:none;
                          padding:10px 24px; border-radius:8px; font-size:14px; }
          .muted      { color:#6b7280; font-size:13px; }
          .footer     { padding:20px 32px; text-align:center; border-top:1px solid #2d2d2d; }
          .footer p   { margin:0; font-size:12px; color:#4b5563; }
        </style>
        </head>
        <body>
        <div class="wrapper">
          <div class="header">
            <h1>Mentorship Scheduler</h1>
            <p>%s</p>
          </div>
          <div class="body">%s</div>
          <div class="footer">
            <p>© 2025 Mentorship Scheduler · You received this because you have a session booked.</p>
          </div>
        </div>
        </body>
        </html>
        """.formatted(title, content);

    }


    private String buildMentorEmailHtml(String mentorFirstName, User student,
                                        String sessionTime, String agenda,
                                        String meetLink, String googleCalendarUrl,
                                        Integer bookingId) {
        return baseTemplate(
                "New session booked 📅",
                """
                <p>Hi <strong>%s</strong>,</p>
                <p>A student has booked a session with you.</p>
     
                <div class="card">
                  <h3>Session Details</h3>
                  <table>
                    <tr><td>Student</td>    <td><strong>%s</strong>%s</td></tr>
                    <tr><td>Date & Time</td><td><strong>%s</strong></td></tr>
                    <tr><td>Their Agenda</td><td><em>"%s"</em></td></tr>
                  </table>
                </div>
     
                <p style="text-align:center; margin: 28px 0">
                  <a href="%s" class="btn-primary">Join Meeting ↗</a>
                </p>
     
                <div class="card" style="text-align:center">
                  <p style="margin:0 0 12px">Add this session to your calendar</p>
                  <a href="%s" class="btn-secondary">Add to Google Calendar</a>
                  <p class="muted" style="margin:12px 0 0">
                    Or open the attached <strong>session.ics</strong> file
                  </p>
                </div>
     
                <p class="muted" style="text-align:center; margin-top:24px">Booking ID: #%d</p>
                """.formatted(
                        mentorFirstName,
                        student.getUsername(),
                        student.getGithubUsername() != null
                                ? "<br><span class=\"muted\">github.com/" + student.getGithubUsername() + "</span>"
                                : "",
                        sessionTime,
                        agenda,
                        meetLink,
                        googleCalendarUrl,
                        bookingId
                )
        );
    }

    private String buildStudentEmailHtml(String studentFirstName, User mentor,
                                         String sessionTime, String agenda,
                                         String meetLink, String googleCalendarUrl,
                                         Integer bookingId) {
        return baseTemplate(
                "Your session is confirmed ✅",
                """
                <p>Hi <strong>%s</strong>,</p>
                <p>Your mentorship session has been booked successfully.</p>
     
                <div class="card">
                  <h3>Session Details</h3>
                  <table>
                    <tr><td>Mentor</td>    <td><strong>%s</strong><br><span class="muted">%s</span></td></tr>
                    <tr><td>Date & Time</td><td><strong>%s</strong></td></tr>
                    <tr><td>Your Agenda</td><td>%s</td></tr>
                  </table>
                </div>
     
                <p style="text-align:center; margin: 28px 0">
                  <a href="%s" class="btn-primary">Join Meeting ↗</a>
                </p>
     
                <div class="card" style="text-align:center">
                  <p style="margin:0 0 12px">Add this session to your calendar</p>
                  <a href="%s" class="btn-secondary">Add to Google Calendar</a>
                  <p class="muted" style="margin:12px 0 0">
                    Or open the attached <strong>session.ics</strong> file to add to Outlook or Apple Calendar
                  </p>
                </div>
     
                <p class="muted" style="text-align:center; margin-top:24px">
                  Need to cancel? You can cancel up to 2 hours before the session
                  from your <a href="http://localhost:3000/dashboard">dashboard</a>.
                  <br>Booking ID: #%d
                </p>
                """.formatted(
                        studentFirstName,
                        mentor.getUsername(),
                        mentor.getJobTitle() != null ? mentor.getJobTitle() : "",
                        sessionTime,
                        agenda,
                        meetLink,
                        googleCalendarUrl,
                        bookingId
                )
        );
    }




}
