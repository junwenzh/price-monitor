import dotenv from 'dotenv';
import { DatabaseError, Pool, PoolClient, QueryResult } from 'pg';

dotenv.config();

type DatabaseResponseError = {
  code: string;
  message: string;
};

class DB {
  private static instance: DB | null = null;
  private pool: Pool;

  private constructor() {
    const url = process.env.PGDB_URL;
    if (!url) {
      throw new Error('PGDB_URL environment variable is not set.');
    }
    this.pool = new Pool({ connectionString: url });
    console.log('Connected to the database.');
  }

  public static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  // get a client
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // Method to execute queries using pool
  async query(
    sql: string,
    params?: any[]
  ): Promise<QueryResult | DatabaseError> {
    const client = await this.pool.connect();

    try {
      const results = await client.query(sql, params);
      return results;
    } catch (e) {
      return e as DatabaseError;
    } finally {
      client.release();
    }
  }

  async queries(
    sqls: string[],
    params?: any[]
  ): Promise<QueryResult | DatabaseError> {
    const client = await this.pool.connect();

    try {
      let results;

      await client.query('BEGIN');

      for (let i = 0; i < sqls.length; i++) {
        const sql = sqls[i];
        const param = params?.[i];
        results = await client.query(sql, param);
      }

      await client.query('COMMIT');

      return results as QueryResult;
    } catch (e) {
      await client.query('ROLLBACK');
      return e as DatabaseError;
    } finally {
      client.release();
    }
  }

  public static async closeConnection() {
    if (DB.instance) {
      await DB.instance.pool.end();
      DB.instance = null;
      console.log('Database connection closed.');
    }
  }
}

export { DatabaseResponseError, DB };
