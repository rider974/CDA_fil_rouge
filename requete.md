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
    (SELECT role_uuid FROM role WHERE role_name = 'membre' ORDER BY created_at LIMIT 1)
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