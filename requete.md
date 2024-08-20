INSERT INTO roles (role_uuid, role_name, created_at, updated_at)
VALUES
(uuid_generate_v4(), 'admin', NOW(), NOW()),
(uuid_generate_v4(), 'membre', NOW(), NOW()),
(uuid_generate_v4(), 'modérateur', NOW(), NOW());


INSERT INTO users (user_uuid, username, email, password, is_active, created_at, updated_at, role_uuid)
VALUES (
    uuid_generate_v4(), 
    'admin_user', 
    'admin@example.com', 
    'password_hash', 
    true, 
    NOW(), 
    NOW(), 
    (SELECT role_uuid FROM roles WHERE role_name = 'admin' ORDER BY created_at LIMIT 1)
);

INSERT INTO users (user_uuid, username, email, password, is_active, created_at, updated_at, role_uuid)
VALUES (
    uuid_generate_v4(), 
    'membre_user', 
    'membre@example.com', 
    'password_hash', 
    true, 
    NOW(), 
    NOW(), 
    (SELECT role_uuid FROM roles WHERE role_name = 'membre' ORDER BY created_at LIMIT 1)
);

INSERT INTO users (user_uuid, username, email, password, is_active, created_at, updated_at, role_uuid)
VALUES (
    uuid_generate_v4(), 
    'moderateur_user', 
    'moderateur@example.com', 
    'password_hash', 
    true, 
    NOW(), 
    NOW(), 
    (SELECT role_uuid FROM roles WHERE role_name = 'modérateur' ORDER BY created_at LIMIT 1)
);

INSERT INTO ressources_status (name) VALUES ('en cours de moderation'), ('publie'), ('rejete'); 

INSERT INTO ressource_types (type_name) VALUES ('articles'); 

INSERT INTO ressources (title) VALUES ('articles sur IA');

--------------------------trigger sur ressources.status_uuid
CREATE OR REPLACE FUNCTION log_status_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.ressource_status_uuid IS DISTINCT FROM NEW.ressource_status_uuid THEN
        INSERT INTO "ressources_status_history" (
            ressource_status_history_uuid,
            status_changed_at,
            created_at,
            updated_at,
            preview_state_uuid,
            new_state_uuid,
            ressource_uuid
        ) VALUES (
            gen_random_uuid(),  
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP,  
            CURRENT_TIMESTAMP,  
            OLD.ressource_status_uuid,  
            NEW.ressource_status_uuid,  
            NEW.ressource_uuid   
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER trigger_status_update
AFTER UPDATE OF ressource_status_uuid ON ressources
FOR EACH ROW
EXECUTE FUNCTION log_status_update();


UPDATE ressources
SET ressource_status_uuid = '73292f30-7cb1-4c14-81d0-cd570826a859'
WHERE ressource_uuid = 'aca10f08-9076-45ed-9619-d05e25d0cf79';
