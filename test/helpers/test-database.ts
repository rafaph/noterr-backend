import { spawn } from "child_process";
import path from "path";
import { ConnectionString } from "connection-string";
import { Client } from "pg";
import { UUID } from "@app/lib/uuid";
import { PrismaService } from "@app/shared/application/prisma-service";

const makeQuery = async (query: string): Promise<void> => {
  const client = new Client(<string>process.env.DATABASE_URL);
  await client.connect();
  await client.query(query);
  await client.end();
};

const createDatabase = (database: string): Promise<void> => {
  return makeQuery(`CREATE DATABASE ${database};`);
};

const dropDatabase = (database: string): Promise<void> => {
  return makeQuery(`DROP DATABASE IF EXISTS ${database};`);
};

const migrate = (databaseUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
      cwd: path.join(__dirname, "..", ".."),
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("Failed to run 'migrate'."));
      }
    });
  });
};

export class TestDatabase {
  private readonly database = `noterr_${UUID.new().toString().replaceAll("-", "")}`;

  private get databaseUrl(): string {
    const connectionString = new ConnectionString(process.env.DATABASE_URL);
    connectionString.path = [this.database];

    return connectionString.toString();
  }

  public async up(): Promise<void> {
    await createDatabase(this.database);
    await migrate(this.databaseUrl);
  }

  public down(): Promise<void> {
    return dropDatabase(this.database);
  }

  public createPrisma(): PrismaService {
    return new PrismaService({
      datasources: {
        db: {
          url: this.databaseUrl,
        },
      },
      log: ["error"],
    });
  }

  public async run(callback: (prisma: PrismaService) => Promise<void>): Promise<void> {
    await this.up();

    const prisma = this.createPrisma();
    await prisma.$connect();

    try {
      await callback(prisma);
    } finally {
      await prisma.$disconnect();
      await this.down();
    }
  }
}
