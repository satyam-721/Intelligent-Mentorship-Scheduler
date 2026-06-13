package team.cryptonians.Scheduler.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {


    @GetMapping("hello")
    public String greet(){
        return "HelloWorld";
    }

    @PostMapping("post")
    public String postgreet(){
        return "HELLO POST";
    }
}
