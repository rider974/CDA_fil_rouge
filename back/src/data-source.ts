import "reflect-metadata"
import { DataSource } from "typeorm"
import {User} from "./entity/user"
import {Role} from "./entity/role"
import {Comment} from "./entity/comment"
import {Have} from "./entity/have"
import {Ressource} from "./entity/ressource"
import {RessourceStatus} from "./entity/ressourceStatus"
import {RessourceStatusHistory} from "./entity/ressourceStatusHistory"
import {Tag} from "./entity/tag"
import {Follow} from "./entity/follow"
import {Refer} from "./entity/refer"
import {RessourceType} from "./entity/ressourceType"
import {SharingSession} from "./entity/sharingSession"
import {Reference} from "./entity/reference"
import {InitialSchema1641211240000} from './migrations/1723112057042-initMigration'
import {AddStatusUpdateTrigger1641211250000} from './migrations/1641211250000-AddStatusUpdateTrigger'
import { config } from "dotenv";

config();

const dbType = process.env.DB_TYPE as "postgres" | "mysql" | "mariadb" | "sqlite" | "mssql" | "oracle";
if (!dbType) {
    throw new Error("DB_TYPE is not set or is invalid");
}

const db_name = process.env.DB_DB as "postgres" | "mysql" | "mariadb" | "sqlite" | "mssql" | "oracle";
if (!db_name) {
    throw new Error("DB_TYPE is not set or is invalid");
}

export const AppDataSource = new DataSource({
    type: dbType,
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: db_name,
    synchronize: true,
    logging: "all",
    entities: [User, Role, Comment, Tag, Have, Ressource, RessourceStatus, RessourceStatusHistory, Follow, Refer, Reference, RessourceType, SharingSession],
    migrations: [InitialSchema1641211240000,AddStatusUpdateTrigger1641211250000],
    subscribers: [],
})


export const initializeDataSource = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("DataSource initialized");
    } 
};

