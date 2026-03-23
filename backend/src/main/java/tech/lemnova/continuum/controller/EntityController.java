package tech.lemnova.continuum.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tech.lemnova.continuum.application.service.EntityService;
import tech.lemnova.continuum.controller.dto.entity.EntityContextResponse;
import tech.lemnova.continuum.controller.dto.entity.EntityCreateRequest;
import tech.lemnova.continuum.controller.dto.entity.EntityResponse;
import tech.lemnova.continuum.controller.dto.entity.EntityUpdateRequest;
import tech.lemnova.continuum.domain.entity.Entity;
import tech.lemnova.continuum.domain.note.Note;
import tech.lemnova.continuum.infra.security.CustomUserDetails;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/entities")
public class EntityController {

    private final EntityService entityService;

    public EntityController(EntityService entityService) { this.entityService = entityService; }

    @PostMapping
    public ResponseEntity<EntityResponse> create(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody EntityCreateRequest req) {
        Entity entity = entityService.create(user.getUserId(), user.getVaultId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(EntityResponse.from(entity));
    }

    @GetMapping
    public ResponseEntity<List<EntityResponse>> list(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<Entity> entities = entityService.listByUser(user.getUserId());
        List<EntityResponse> responses = entities != null && !entities.isEmpty() 
            ? entities.stream().map(EntityResponse::from).toList()
            : Collections.emptyList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse> getEntity(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        Entity entity = entityService.getEntity(user.getVaultId(), id);
        return ResponseEntity.ok(EntityResponse.from(entity));
    }

    @GetMapping("/{id}/context")
    public ResponseEntity<EntityContextResponse> getEntityContext(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        return ResponseEntity.ok(entityService.getEntityContext(user.getUserId(), id));
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<List<Note>> getNotesForEntity(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        List<Note> notes = entityService.getNotesForEntity(user.getUserId(), user.getVaultId(), id);
        return ResponseEntity.ok(notes != null ? notes : Collections.emptyList());
    }

    @GetMapping("/{id}/connections")
    public ResponseEntity<List<EntityResponse>> getConnections(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        List<Entity> connections = entityService.getConnections(user.getUserId(), user.getVaultId(), id);
        List<EntityResponse> responses = connections != null && !connections.isEmpty()
            ? connections.stream().map(EntityResponse::from).toList()
            : Collections.emptyList();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse> update(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id,
            @Valid @RequestBody EntityUpdateRequest req) {
        Entity entity = entityService.update(user.getUserId(), user.getVaultId(), id, req);
        return ResponseEntity.ok(EntityResponse.from(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        entityService.delete(user.getUserId(), user.getVaultId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/track")
    public ResponseEntity<EntityResponse> trackHabit(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        Entity entity = entityService.trackHabit(user.getUserId(), id);
        return ResponseEntity.ok(EntityResponse.from(entity));
    }
}
