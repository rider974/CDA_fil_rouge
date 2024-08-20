import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateScheduleBackup1724094499263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS pg_cron; 
            SELECT cron.schedule('daily_backup_db_beginners', '0 24 * * *', $$ /bin/bash /home/schedule_backup_bdd.sh $$);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
