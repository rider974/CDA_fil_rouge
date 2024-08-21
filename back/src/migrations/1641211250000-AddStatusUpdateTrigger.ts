import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusUpdateTrigger1641211250000 implements MigrationInterface {
    name = 'AddStatusUpdateTrigger1641211250000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
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
        `);

        await queryRunner.query(`
            CREATE OR REPLACE TRIGGER trigger_status_update
            AFTER UPDATE OF ressource_status_uuid ON ressources
            FOR EACH ROW
            EXECUTE FUNCTION log_status_update();
        `);

        console.log('Trigger and function for status updates created successfully.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_status_update ON ressources;
        `);

        await queryRunner.query(`
            DROP FUNCTION IF EXISTS log_status_update();
        `);

        console.log('Trigger and function for status updates removed successfully.');
    }
}
