package tech.lemnova.continuum.infra.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tech.lemnova.continuum.domain.entity.Entity;
import tech.lemnova.continuum.domain.entity.EntityType;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntityRepository extends MongoRepository<Entity, String> {
    List<Entity> findByUserId(String userId);
    long countByUserId(String userId);
    List<Entity> findByVaultId(String vaultId);
    List<Entity> findByVaultIdAndType(String vaultId, EntityType type);
    List<Entity> findByIdIn(List<String> ids);
}
