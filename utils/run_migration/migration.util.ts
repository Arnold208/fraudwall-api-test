import { DataSource } from 'typeorm';
import { Umzug } from 'umzug';
import { TypeORMStorage } from 'typeorm-storage-umzug';
import { Logger } from '@nestjs/common';
import ApplicationEntities from 'src/shared/base-entities/app-entities';
import { InitialMigration1707568976535 } from 'migrations/1707568976535-InitialMigration';
import { CreateSuperUser1713913862994 } from 'migrations/1713913862994-CreateSuperUser';
import { ReportPlatforms1713916453429 } from 'migrations/1713916453429-ReportPlatforms';
import { ReportThreshold1713917021136 } from 'migrations/1713917021136-ReportThreshold';
import { SeedRiskLevels1713948598720 } from 'migrations/1713948598720-SeedRiskLevels';
import { SeedCaseFileStatuses1713949574932 } from 'migrations/1713949574932-SeedCaseFileStatuses';

const MAX_RETRIES = 3;

export async function runMigrations(retries = 0): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host:
      process.env.NODE_ENV === 'development'
        ? process.env.PGHOST_DEV
        : process.env.PGHOST,
    username:
      process.env.NODE_ENV === 'development'
        ? process.env.PGUSER_DEV
        : process.env.PGUSER,
    database:
      process.env.NODE_ENV === 'development'
        ? process.env.PGDATABASE_DEV
        : process.env.PGDATABASE,
    password:
      process.env.NODE_ENV === 'development'
        ? process.env.PGPASSWORD_DEV
        : process.env.PGPASSWORD,
    port:
      process.env.NODE_ENV === 'development'
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
    ],
    ssl:
      process.env.NODE_ENV === 'development'
        ? false
        : {
            rejectUnauthorized: false,
          },
    synchronize: false, // Disable synchronize as we are running migrations
  });

  try {
    await dataSource.initialize();

    const umzug = new Umzug({
      migrations: {
        glob: 'dist/migrations/*{.ts,.js}', // Path to migration files
        resolve: ({ name, path }) => {
          const migration = require(path);
          return {
            name,
            up: async () => migration.up(dataSource.createQueryRunner()),
            down: async () => migration.down(dataSource.createQueryRunner()),
          };
        },
      },
      context: dataSource.createQueryRunner(),
      storage: new TypeORMStorage({
        dataSource,
        tableName: 'migrations', // Specify the name of the migrations table
      }),
      logger: console,
    });

    await umzug.up();
    Logger.log('Migrations applied successfully');
  } catch (error) {
    Logger.error('Error applying migrations', error);

    if (retries < MAX_RETRIES) {
      Logger.log(`Retrying migrations (Attempt ${retries + 1})`);
      await runMigrations(retries + 1);
    } else {
      Logger.error(`Failed to apply migrations after ${MAX_RETRIES} attempts`);
      throw error;
    }
  } finally {
    await dataSource.destroy();
  }
}
