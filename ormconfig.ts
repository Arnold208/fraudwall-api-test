import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import ApplicationEntities from "./src/shared/base-entities/app-entities";
import { InitialMigration1707568976535 } from "./migrations/1707568976535-InitialMigration";
import { CreateSuperUser1713913862994 } from "./migrations/1713913862994-CreateSuperUser";
import { ReportPlatforms1713916453429 } from "./migrations/1713916453429-ReportPlatforms";
import { ReportThreshold1713917021136 } from "./migrations/1713917021136-ReportThreshold";
import { SeedRiskLevels1713948598720 } from "./migrations/1713948598720-SeedRiskLevels";
import { SeedCaseFileStatuses1713949574932 } from "./migrations/1713949574932-SeedCaseFileStatuses";
import { AddReportPlatFormIdColumn1719258825718 } from "./migrations/1719258825718-AddReportPlatFormIdColumn";
import { AddSubscription1719313101036 } from "./migrations/1719313101036-AddSubscription";
import { LastMessageHashProperty1723802405790 } from "./migrations/1723802405790-lastMessageHashProperty";
import { Feedback1724145118512 } from "./migrations/1724145118512-Feedback";
import { OriginLogEntity1726223507061 } from "./migrations/1726223507061-OriginLogEntity";


dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host:
    process.env.NODE_ENV === "development"
      ? process.env.PGHOST_DEV
      : process.env.PGHOST,
  username:
    process.env.NODE_ENV === "development"
      ? process.env.PGUSER_DEV
      : process.env.PGUSER,
  database:
    process.env.NODE_ENV === "development"
      ? process.env.PGDATABASE_DEV
      : process.env.PGDATABASE,
  password:
    process.env.NODE_ENV === "development"
      ? process.env.PGPASSWORD_DEV
      : process.env.PGPASSWORD,
  port:
    process.env.NODE_ENV === "development"
      ? +process.env.PGPORT_DEV
      : +process.env.PGPORT,
  entities: [...ApplicationEntities],
  migrations: [
    InitialMigration1707568976535,
    CreateSuperUser1713913862994,
    ReportPlatforms1713916453429,
    ReportThreshold1713917021136,
    SeedRiskLevels1713948598720,
    SeedCaseFileStatuses1713949574932,
    AddReportPlatFormIdColumn1719258825718,
    LastMessageHashProperty1723802405790,
    AddSubscription1719313101036,
    Feedback1724145118512,
    OriginLogEntity1726223507061
  ],
  ssl:
    process.env.NODE_ENV === "development"
      ? false
      : {
          rejectUnauthorized: false,
        },
});
