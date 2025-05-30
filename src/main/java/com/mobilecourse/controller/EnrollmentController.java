package com.mobilecourse.controller;

import com.mobilecourse.entity.Course;
import com.mobilecourse.entity.User;
import com.mobilecourse.entity.UserProgress;
import com.mobilecourse.repository.CourseRepository;
import com.mobilecourse.repository.UserProgressRepository;
import com.mobilecourse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/enroll")
@CrossOrigin(origins = "*")
public class EnrollmentController {
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;

    @PostMapping("/{courseId}")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        Course course = courseRepository.findById(courseId).orElseThrow();
        if (userProgressRepository.findByUserIdAndCourseId(user.getId(), courseId) != null) {
            return ResponseEntity.badRequest().body("Already enrolled");
        }
        UserProgress progress = new UserProgress();
        progress.setUser(user);
        progress.setCourse(course);
        progress.setStudyTime(0);
        progress.setAccuracyRate(0);
        progress.setAchievementPoints(0);
        progress.setPercentComplete(0);
        userProgressRepository.save(progress);
        return ResponseEntity.ok("Enrolled successfully");
    }
} 