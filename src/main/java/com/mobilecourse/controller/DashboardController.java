package com.mobilecourse.controller;

import com.mobilecourse.entity.UserProgress;
import com.mobilecourse.service.UserProgressService;
import com.mobilecourse.repository.UserRepository;
import com.mobilecourse.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    @Autowired
    private UserProgressService userProgressService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getDashboard(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        List<UserProgress> progressList = userProgressService.getProgressByUser(user.getId());
        double totalStudyTime = progressList.stream().mapToDouble(UserProgress::getStudyTime).sum();
        double avgAccuracy = progressList.isEmpty() ? 0 : progressList.stream().mapToDouble(UserProgress::getAccuracyRate).average().orElse(0);
        int totalPoints = progressList.stream().mapToInt(UserProgress::getAchievementPoints).sum();
        Map<String, Object> response = new HashMap<>();
        response.put("studyTime", totalStudyTime);
        response.put("accuracyRate", avgAccuracy);
        response.put("achievementPoints", totalPoints);
        response.put("subjectProgress", progressList);
        return ResponseEntity.ok(response);
    }
} 