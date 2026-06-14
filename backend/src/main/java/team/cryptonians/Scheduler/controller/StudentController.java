package team.cryptonians.Scheduler.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team.cryptonians.Scheduler.dto.AvailabilitySlotResponse;
import team.cryptonians.Scheduler.service.StudentService;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    StudentService studentService;

    @GetMapping("mentorSlots")
    public List<AvailabilitySlotResponse> getSlots(){
        return studentService.getAllSlots();
    }


}
