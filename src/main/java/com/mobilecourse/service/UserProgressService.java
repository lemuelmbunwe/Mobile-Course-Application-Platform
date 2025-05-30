package com.mobilecourse.service;

import com.mobilecourse.entity.UserProgress;
import com.mobilecourse.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProgressService {
    @Autowired
    private UserProgressRepository userProgressRepository;

    public List<UserProgress> getProgressByUser(Long userId) {
        return userProgressRepository.findByUserId(userId);
    }

    public UserProgress getProgressByUserAndCourse(Long userId, Long courseId) {
        return userProgressRepository.findByUserIdAndCourseId(userId, courseId);
    }

    public UserProgress saveProgress(UserProgress progress) {
        return userProgressRepository.save(progress);
    }
} 