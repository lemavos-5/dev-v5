package tech.lemnova.continuum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tech.lemnova.continuum.application.service.AuthService;
import tech.lemnova.continuum.controller.dto.auth.UserContextResponse;
import tech.lemnova.continuum.infra.security.CustomUserDetails;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AuthService authService;

    public AccountController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserContextResponse> getMe(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(authService.getContext(user.getUserId()));
    }

    @PatchMapping("/me")
    public ResponseEntity<Void> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, String> body) {
        
        String username = body.get("username");
        String email = body.get("email");

        if (username != null && !username.isBlank()) {
            authService.updateUsername(user.getUserId(), username.trim());
        }
        
        if (email != null && !email.isBlank()) {
            authService.initiateEmailChange(user.getUserId(), email.trim());
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password/change")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, String> body) {
        
        String current = body.get("currentPassword");
        String next = body.get("newPassword");
        
        if (current == null || next == null) return ResponseEntity.badRequest().build();
        
        authService.changePassword(user.getUserId(), current, next);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) return ResponseEntity.badRequest().build();
        
        authService.initiatePasswordReset(email.trim());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPass = body.get("newPassword");
        
        if (token == null || newPass == null) return ResponseEntity.badRequest().build();
        
        authService.completePasswordReset(token, newPass);
        return ResponseEntity.noContent().build();
    }
}