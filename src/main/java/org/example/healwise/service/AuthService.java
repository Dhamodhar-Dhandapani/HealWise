package org.example.healwise.service;

import org.example.healwise.dto.auth.AuthResponseDTO;
import org.example.healwise.dto.auth.LoginRequestDTO;
import org.example.healwise.dto.auth.RegisterRequestDTO;
import org.example.healwise.dto.auth.UserResponseDTO;
import org.example.healwise.entity.UserEntity;
import org.example.healwise.repository.UserRepo;
import org.example.healwise.security.jwt.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepo userRepo,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO requestDTO) {
        if (userRepo.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        String role = requestDTO.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        } else {
            role = role.trim().toUpperCase();
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
        }

        UserEntity user = UserEntity.builder()
                .firstName(requestDTO.getFirstName())
                .lastName(requestDTO.getLastName())
                .email(requestDTO.getEmail())
                .password(passwordEncoder.encode(requestDTO.getPassword()))
                .role(role)
                .build();

        UserEntity savedUser = userRepo.save(user);

        String jwt = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());

        return AuthResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO requestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDTO.getEmail(),
                        requestDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserEntity user = userRepo.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + requestDTO.getEmail()));

        String jwt = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole());

        return AuthResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    public UserResponseDTO getCurrentUser(String email) {
        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        return UserResponseDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
