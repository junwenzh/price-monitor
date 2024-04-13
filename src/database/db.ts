// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// class DB {
//   pool: Pool;

//   constructor() {
//     const url = process.env.PGDB_URL;
//     this.pool = new Pool({ connectionString: url });
//   }

//   getPool() {
//     return this.pool;
//   }

//   async closeConnection() {
//     await this.pool.end();
//     console.log('Database connection closed.');
//   }

//   async query(sql: string, params?: any[]) {
//     const client = await this.pool.connect();

//     let results;

//     try {
//       results = await client.query(sql, params);
//     } catch (e) {
//       results = {
//         error: e,
//       };
//     } finally {
//       client.release();
//     }

//     return results;
//   }
// }

// const db = new DB();

// export { db, DB };

import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

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
export { db, DB };
