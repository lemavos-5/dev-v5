package tech.lemnova.continuum.application.service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import tech.lemnova.continuum.domain.user.User;

@Service
public class UserService {

    private final MongoTemplate mongoTemplate;

    public UserService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public void incrementNoteCount(String userId) {
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("_id").is(userId)),
            new Update().inc("noteCount", 1),
            User.class
        );
    }

    public void incrementEntityCount(String userId) {
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("_id").is(userId)),
            new Update().inc("entityCount", 1),
            User.class
        );
    }

    public void decrementNoteCount(String userId) {
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("_id").is(userId)),
            new Update().inc("noteCount", -1),
            User.class
        );
    }

    public void decrementEntityCount(String userId) {
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("_id").is(userId)),
            new Update().inc("entityCount", -1),
            User.class
        );
    }
}