package tech.lemnova.continuum.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "entities")
public class Entity {

    @Id
    private String id;
    private String userId;
    private String vaultId;
    private String title;
    private EntityType type;
    private String description;
    private String fileKey;
    private Instant createdAt;

    // Método solicitado pelo TrackingService
    public boolean isTrackable() {
        return type == EntityType.HABIT || type == EntityType.PROJECT;
    }
}