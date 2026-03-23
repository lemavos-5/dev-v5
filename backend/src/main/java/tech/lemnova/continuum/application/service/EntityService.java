package tech.lemnova.continuum.application.service;

import org.springframework.stereotype.Service;
import tech.lemnova.continuum.application.exception.NotFoundException;
import tech.lemnova.continuum.application.exception.PlanLimitException;
import tech.lemnova.continuum.controller.dto.entity.EntityContextResponse;
import tech.lemnova.continuum.controller.dto.entity.EntityCreateRequest;
import tech.lemnova.continuum.controller.dto.entity.EntityUpdateRequest;
import tech.lemnova.continuum.domain.entity.Entity;
import tech.lemnova.continuum.domain.entity.EntityType;
import tech.lemnova.continuum.domain.note.Note;
import tech.lemnova.continuum.domain.plan.PlanConfiguration;
import tech.lemnova.continuum.domain.user.User;
import tech.lemnova.continuum.domain.user.UserRepository;
import tech.lemnova.continuum.infra.persistence.EntityRepository;
import tech.lemnova.continuum.infra.persistence.NoteRepository;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntityService {

    private final EntityRepository entityRepo;
    private final NoteRepository noteRepo;
    private final UserRepository userRepo;
    private final UserService userService;
    private final PlanConfiguration planConfig;

    public EntityService(EntityRepository entityRepo, NoteRepository noteRepo, UserRepository userRepo, UserService userService, PlanConfiguration planConfig) {
        this.entityRepo = entityRepo;
        this.noteRepo = noteRepo;
        this.userRepo = userRepo;
        this.userService = userService;
        this.planConfig = planConfig;
    }
    
    private User getUser(String userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
    }
    
    public Entity get(String userId, String entityId) {
        User user = getUser(userId);
        return getEntity(user.getVaultId(), entityId);
    }
    
    public List<Entity> listByType(String userId, EntityType type) {
        User user = getUser(userId);
        return entityRepo.findByVaultIdAndType(user.getVaultId(), type);
    }

    public Entity create(String userId, String vaultId, EntityCreateRequest req) {
        // Verificar limite de entidades baseado no plano do usuário
        User user = getUser(userId);
        long currentEntityCount = entityRepo.countByUserId(userId);
        if (!planConfig.canCreateEntity(user.getPlan(), currentEntityCount)) {
            throw new PlanLimitException("Limite de entidades atingido para seu plano. Atualize para uma assinatura superior.");
        }
        
        Entity entity = Entity.builder()
                .userId(userId)
                .vaultId(vaultId)
                .title(req.title().trim())
                .description(req.description())
                .type(req.type() != null ? req.type() : EntityType.PERSON)
                .fileKey(null) // TODO: set fileKey when uploading to B2
                .createdAt(Instant.now())
                .build();
        Entity saved = entityRepo.save(entity);
        userService.incrementEntityCount(userId);
        return saved;
    }

    public Entity getEntity(String vaultId, String entityId) {
        return entityRepo.findById(entityId)
                .filter(e -> e.getVaultId().equals(vaultId))
                .orElseThrow(() -> new NotFoundException("Entity not found: " + entityId));
    }

    public List<Note> getNotesForEntity(String vaultId, String entityId) {
        // Busca notas que contenham o ID desta entidade na lista de conexões
        return noteRepo.findAll().stream()
                .filter(n -> n.getEntityIds() != null && n.getEntityIds().contains(entityId))
                .collect(Collectors.toList());
    }

    public List<Entity> getConnections(String vaultId, String entityId) {
        // 1. Encontrar IDs de notas que citam esta entidade
        List<String> noteIdsWithThisEntity = noteRepo.findAll().stream()
                .filter(n -> n.getEntityIds() != null && n.getEntityIds().contains(entityId))
                .map(Note::getId)
                .collect(Collectors.toList());

        // 2. Encontrar outras entidades que aparecem nessas mesmas notas
        List<String> connectedEntityIds = noteRepo.findAll().stream()
                .filter(n -> noteIdsWithThisEntity.contains(n.getId()))
                .flatMap(n -> n.getEntityIds().stream())
                .filter(id -> !id.equals(entityId))
                .distinct()
                .collect(Collectors.toList());

        return entityRepo.findByIdIn(connectedEntityIds);
    }

    public Entity update(String vaultId, String entityId, EntityUpdateRequest req) {
        Entity entity = getEntity(vaultId, entityId);
        if (req.title() != null && !req.title().isBlank()) entity.setTitle(req.title().trim());
        if (req.description() != null) entity.setDescription(req.description());
        if (req.type() != null) entity.setType(req.type());
        return entityRepo.save(entity);
    }

    public void delete(String vaultId, String entityId) {
        Entity entity = getEntity(vaultId, entityId);
        entityRepo.delete(entity);
    }

    public List<Entity> listByVault(String vaultId) {
        return entityRepo.findByVaultId(vaultId);
    }
    
    public List<Entity> listByUser(String userId) {
        return entityRepo.findByUserId(userId);
    }
    
    public EntityContextResponse getEntityContext(String userId, String entityId) {
        User user = getUser(userId);
        
        // CORREÇÃO: Usamos o vaultId para validar a posse da entidade, 
        // já que o campo 'userId' pode não existir na coleção de Entidades
        Entity entity = entityRepo.findById(entityId)
            .filter(e -> e.getVaultId() != null && e.getVaultId().equals(user.getVaultId()))
            .orElseThrow(() -> new NotFoundException("Entity not found: " + entityId));

        List<Note> connectedNotes = noteRepo.findByUserId(userId).stream()
            .filter(note -> note.getEntityIds() != null && note.getEntityIds().contains(entityId))
            .collect(Collectors.toList());

        List<EntityContextResponse.NoteSummary> summaries = connectedNotes.stream()
            .map(note -> new EntityContextResponse.NoteSummary(note.getId(), note.getTitle()))
            .collect(Collectors.toList());

        return new EntityContextResponse(entity, summaries);
    }
}