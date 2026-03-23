package tech.lemnova.continuum.controller.dto.search;

import java.util.List;

public record SearchResponseDTO(
    List<SearchResultNoteDTO> notes,
    List<SearchResultEntityDTO> entities
) {}
