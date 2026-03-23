package tech.lemnova.continuum.controller.dto.entity;

import tech.lemnova.continuum.domain.entity.Entity;

import java.util.List;

public record EntityContextResponse(
    Entity entity,
    List<NoteSummary> connectedNotes
) {
    public record NoteSummary(String id, String title) {}
}