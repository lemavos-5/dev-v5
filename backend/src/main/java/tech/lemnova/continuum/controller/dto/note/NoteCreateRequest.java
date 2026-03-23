package tech.lemnova.continuum.controller.dto.note;

public record NoteCreateRequest(
    String title,
    String content,
    String folderId
) {}
