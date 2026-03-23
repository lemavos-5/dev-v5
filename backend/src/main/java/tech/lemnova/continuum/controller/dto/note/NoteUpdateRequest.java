package tech.lemnova.continuum.controller.dto.note;

public record NoteUpdateRequest(
    String title,
    String content,
    String folderId
) {}
