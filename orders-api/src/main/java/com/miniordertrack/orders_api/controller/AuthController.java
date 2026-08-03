package com.miniordertrack.orders_api.controller;

import com.miniordertrack.orders_api.domain.User;
import com.miniordertrack.orders_api.dto.AuthResponseDTO;
import com.miniordertrack.orders_api.dto.LoginDTO;
import com.miniordertrack.orders_api.dto.RegisterDTO;
import com.miniordertrack.orders_api.dto.UserDTO;
import com.miniordertrack.orders_api.repository.UserRepository;
import com.miniordertrack.orders_api.security.JwtService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: E-mail já cadastrado!");
        }

        String encryptedPassword = passwordEncoder.encode(dto.getPassword());
        User newUser = new User(dto.getName(), dto.getEmail(), encryptedPassword);
        User savedUser = userRepository.save(newUser);

        String token = jwtService.generateToken(savedUser.getEmail());
        UserDTO userDTO = new UserDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDTO(token, userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO dto) {
        var userOptional = userRepository.findByEmail(dto.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos");
        }

        String token = jwtService.generateToken(user.getEmail());
        UserDTO userDTO = new UserDTO(user.getId(), user.getName(), user.getEmail());

        return ResponseEntity.ok(new AuthResponseDTO(token, userDTO));
    }
}