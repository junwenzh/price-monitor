import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class DB {
  pool: Pool;

  constructor() {
    const url = process.env.PGDB_URL;
    // const url =
    //   'postgresql://pricemonitor:popeyes@129.153.238.140:5433/pricemonitor';
    // console.log(url);
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

export { db, DB };
