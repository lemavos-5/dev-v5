package tech.lemnova.continuum.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import tech.lemnova.continuum.domain.entity.Entity;
import tech.lemnova.continuum.domain.note.Note;
import tech.lemnova.continuum.infra.persistence.NoteRepository;
import tech.lemnova.continuum.infra.persistence.EntityRepository;
import tech.lemnova.continuum.infra.vault.VaultStorageService;
import tech.lemnova.continuum.infra.security.CustomUserDetails;
import tech.lemnova.continuum.domain.user.User;
import tech.lemnova.continuum.infra.config.PlanConfiguration;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class NoteServiceUnitTest {

    @Mock NoteRepository noteRepo;
    @Mock EntityRepository entityRepo;
    @Mock VaultStorageService storageService;
    @Mock UserService userService;
    @Mock ExtractionService extractionService;
    @Mock PlanConfiguration planConfig;
    @Mock tech.lemnova.continuum.domain.user.UserRepository userRepository;

    NoteService noteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        noteService = new NoteService(noteRepo, entityRepo, extractionService, storageService, userService, planConfig, userRepository);
    }

    private void setAuthenticatedUser(String userId) {
        User user = new User();
        user.setId(userId);
        user.setUsername("tester");
        user.setEmail("tester@example.com");

        CustomUserDetails details = new CustomUserDetails(user);
        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken(details, null));
    }

    @Test
    void create_savesNoteWithContent() {
        setAuthenticatedUser("user1");

        Note savedNote = new Note();
        savedNote.setId("n1");
        savedNote.setUserId("user1");
        savedNote.setTitle("Test");
        savedNote.setContent("Test content");
        savedNote.setCreatedAt(Instant.now());

        when(noteRepo.save(any(Note.class))).thenReturn(savedNote);
        when(entityRepo.findByUserId("user1")).thenReturn(List.of());

        var result = noteService.create(new tech.lemnova.continuum.controller.dto.note.NoteCreateRequest("Test", "Test content", ""));

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo("n1");
        assertThat(result.content()).isEqualTo("Test content");
    }

    @Test
    void get_returnsNoteForValidUserAndId() {
        setAuthenticatedUser("user1");
        String noteId = "n1";
        Note note = new Note();
        note.setId(noteId);
        note.setUserId("user1");
        note.setTitle("Test");
        note.setContent("Content");

        when(noteRepo.findById(noteId)).thenReturn(Optional.of(note));

        var result = noteService.getById(noteId);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(noteId);
    }

    @Test
    void list_returnsAllNotesForUser() {
        setAuthenticatedUser("user1");
        Note note1 = new Note();
        note1.setId("n1");
        note1.setUserId("user1");

        Note note2 = new Note();
        note2.setId("n2");
        note2.setUserId("user1");

        when(noteRepo.findByUserId("user1")).thenReturn(List.of(note1, note2));

        var result = noteService.listByUser();

        assertThat(result).hasSize(2);
    }
}

