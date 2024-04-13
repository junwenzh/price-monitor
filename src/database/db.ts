import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

class DB {
  pool: Pool;

  constructor() {
    const url = process.env.PGDB_URL;
    this.pool = new Pool({ connectionString: url });
  }

  getPool() {
    return this.pool;
  }

  async closeConnection() {
    await this.pool.end();
    console.log('Database connection closed.');
  }

  async query(sql: string, params?: any[]) {
    const client = await this.pool.connect();

    let results;

    try {
      results = await client.query(sql, params);
    } catch (e) {
      results = {
        error: e,
      };
    } finally {
      client.release();
    }

    return results;
  }
}

const db = new DB();

export { DB, db };
