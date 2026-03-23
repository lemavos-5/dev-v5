package tech.lemnova.continuum.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tech.lemnova.continuum.application.exception.NotFoundException;
import tech.lemnova.continuum.controller.dto.note.NoteCreateRequest;
import tech.lemnova.continuum.controller.dto.note.NoteResponse;
import tech.lemnova.continuum.controller.dto.note.NoteUpdateRequest;
import tech.lemnova.continuum.domain.entity.Entity;
import tech.lemnova.continuum.domain.note.Note;
import tech.lemnova.continuum.infra.persistence.NoteRepository;
import tech.lemnova.continuum.infra.persistence.EntityRepository;
import tech.lemnova.continuum.infra.security.CustomUserDetails;
import tech.lemnova.continuum.infra.vault.VaultStorageService;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepo;
    private final EntityRepository entityRepo;
    private final ExtractionService extractionService;
    private final VaultStorageService storageService;
    private final UserService userService;

    public NoteService(NoteRepository noteRepo, EntityRepository entityRepo, ExtractionService extractionService, VaultStorageService storageService, UserService userService) {
        this.noteRepo = noteRepo;
        this.entityRepo = entityRepo;
        this.extractionService = extractionService;
        this.storageService = storageService;
        this.userService = userService;
    }

    public NoteResponse create(NoteCreateRequest req) {
        String userId = getCurrentUserId();
        String vaultId = getCurrentVaultId();
        String content = req.content() != null ? req.content() : "";
        String title = req.title() != null && !req.title().isBlank() ? req.title() : extractTitle(content);
        List<String> entityIds = findMatchingEntityIds(userId, content);

        // Gerar ID do MongoDB primeiro
        String noteId = UUID.randomUUID().toString();

        // Fazer upload para B2
        String fileKey = storageService.saveNoteContent(vaultId, noteId, content);

        // Se upload bem-sucedido, salvar no MongoDB
        Note note = new Note();
        note.setId(noteId);
        note.setUserId(userId);
        note.setTitle(title);
        note.setContent(content);
        note.setFileKey(fileKey);
        note.setEntityIds(entityIds);
        note.setCreatedAt(Instant.now());
        note.setUpdatedAt(Instant.now());

        note = noteRepo.save(note);

        userService.incrementNoteCount(userId);

        return NoteResponse.from(note, content);
    }

    public NoteResponse update(String noteId, NoteUpdateRequest req) {
        String userId = getCurrentUserId();
        String vaultId = getCurrentVaultId();
        Note note = noteRepo.findById(noteId)
            .filter(n -> n.getUserId().equals(userId))
            .orElseThrow(() -> new NotFoundException("Note not found: " + noteId));

        String newContent = req.content() != null ? req.content() : note.getContent();
        note.setTitle(req.title() != null ? req.title() : note.getTitle());
        note.setContent(newContent);
        note.setEntityIds(findMatchingEntityIds(userId, newContent));
        note.setUpdatedAt(Instant.now());

        // Fazer upload para B2 primeiro
        String fileKey = storageService.saveNoteContent(vaultId, noteId, newContent);
        note.setFileKey(fileKey);

        // Depois salvar no MongoDB com o fileKey atualizado
        noteRepo.save(note);

        return NoteResponse.from(note, newContent);
    }

    public NoteResponse getById(String noteId) {
        String userId = getCurrentUserId();
        String vaultId = getCurrentVaultId();
        Note note = noteRepo.findById(noteId)
            .filter(n -> n.getUserId().equals(userId))
            .orElseThrow(() -> new NotFoundException("Note not found: " + noteId));
        String content = storageService.loadNoteContent(vaultId, noteId).orElse("");
        return NoteResponse.from(note, content);
    }

    public List<Note> listByUser() {
        return noteRepo.findByUserId(getCurrentUserId());
    }

    public void deleteNote(String noteId, String userId) {
        String vaultId = getCurrentVaultId();
        Note note = noteRepo.findById(noteId)
            .filter(n -> n.getUserId().equals(userId))
            .orElseThrow(() -> new NotFoundException("Note not found: " + noteId));

        // Delete file from B2 if fileKey exists
        if (note.getFileKey() != null && !note.getFileKey().isEmpty()) {
            storageService.deleteNote(vaultId, noteId);
        }

        // Delete from MongoDB
        noteRepo.deleteById(noteId);

        // Decrement user count
        userService.decrementNoteCount(userId);
    }

    private List<String> findMatchingEntityIds(String userId, String content) {
        List<Entity> userEntities = entityRepo.findByUserId(userId);
        return extractionService.extractEntityIds(content, userEntities);
    }

    private String getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUserId();
        }
        throw new IllegalStateException("Authenticated user not found");
    }

    private String getCurrentVaultId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getVaultId();
        }
        throw new IllegalStateException("Authenticated user not found");
    }

    private String extractTitle(String content) {
        if (content == null || content.isBlank()) return "Untitled";
        String firstLine = content.trim().split("\\n")[0];
        return firstLine.length() > 80 ? firstLine.substring(0, 80) : firstLine;
    }
}