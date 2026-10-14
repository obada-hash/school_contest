package com.obada.ezz_contest.controller;

import com.obada.ezz_contest.entity.AppUser;
import com.obada.ezz_contest.entity.Role;
import com.obada.ezz_contest.repository.AppUserRepository;
import com.obada.ezz_contest.repository.RoleRepository;
import com.obada.ezz_contest.security.JwtService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Role userRole = roleRepository.findByName("USER").orElseThrow();

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);

        userRepository.save(user);

        // Return a simple message instead of a token
        return ResponseEntity.ok("User registered successfully. Please log in.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        AppUser user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        return ResponseEntity.ok(jwtService.generateToken(user));
    }

    // method for updating
}

// --- Simple DTOs for the JSON Payloads ---
@Data
class RegisterRequest {
    private String name;
    private String email;
    private String password;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}