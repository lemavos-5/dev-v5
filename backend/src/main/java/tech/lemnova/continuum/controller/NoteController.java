package tech.lemnova.continuum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tech.lemnova.continuum.application.service.NoteService;
import tech.lemnova.continuum.controller.dto.note.NoteCreateRequest;
import tech.lemnova.continuum.controller.dto.note.NoteResponse;
import tech.lemnova.continuum.controller.dto.note.NoteUpdateRequest;
import tech.lemnova.continuum.domain.note.Note;
import tech.lemnova.continuum.infra.security.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) { this.noteService = noteService; }

    @PostMapping
    public ResponseEntity<NoteResponse> create(@AuthenticationPrincipal CustomUserDetails user,
            @RequestBody NoteCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<Note>> list(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(noteService.listByUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> get(@AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        return ResponseEntity.ok(noteService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> update(@AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id,
            @RequestBody NoteUpdateRequest req) {
        return ResponseEntity.ok(noteService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}