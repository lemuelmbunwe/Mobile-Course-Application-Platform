package com.mobilecourse.controller;

import com.mobilecourse.entity.User;
import com.mobilecourse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getProfile(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(Principal principal, @RequestBody Map<String, String> updates) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        if (updates.containsKey("country")) user.setCountry(updates.get("country"));
        if (updates.containsKey("region")) user.setRegion(updates.get("region"));
        if (updates.containsKey("defaultLanguage")) user.setDefaultLanguage(updates.get("defaultLanguage"));
        if (updates.containsKey("role")) user.setRole(updates.get("role"));
        if (updates.containsKey("profilePictureUrl")) user.setProfilePictureUrl(updates.get("profilePictureUrl"));
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
} 