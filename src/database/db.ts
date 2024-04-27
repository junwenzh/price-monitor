import dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';

dotenv.config();

class DB {
  private pool: Pool;

  constructor() {
    const url = process.env.PGDB_URL;
    this.pool = new Pool({ connectionString: url });
  }

  // get the pool
  getPool() {
    return this.pool;
  }

  // get a client
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // Method to execute queries using pool
  async query(sql: string, params?: any[]) {
    const client = await this.pool.connect();

    try {
      const results = await client.query(sql, params);
      return results;
    } catch (e) {
      return { error: e };
    } finally {
      client.release();
    }
  }

  async closeConnection() {
    await this.pool.end();
    console.log('Database connection closed.');
  }
}

const db = new DB();
export { DB, db };
