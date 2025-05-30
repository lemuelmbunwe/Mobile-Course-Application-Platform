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
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getRecommendations(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        List<UserProgress> enrolled = userProgressRepository.findByUserId(user.getId());
        Set<Long> enrolledCourseIds = enrolled.stream().map(up -> up.getCourse().getId()).collect(Collectors.toSet());
        List<Course> recommended = courseRepository.findAll().stream()
                .filter(course -> !enrolledCourseIds.contains(course.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(recommended);
    }
} 