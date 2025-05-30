package com.mobilecourse.repository;

import com.mobilecourse.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUserId(Long userId);
    List<UserProgress> findByCourseId(Long courseId);
    UserProgress findByUserIdAndCourseId(Long userId, Long courseId);
} 