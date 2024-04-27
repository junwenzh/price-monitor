import { QueryResult } from 'pg';
import { db, DB } from './db';

type User = {
  username: string;
  email: string;
  password: string;
};

class UserDB {
  pool;
  query;

  constructor(db: DB) {
    this.pool = db.getPool();
    this.query = db.query;
  }

  async getUser(username: string) {
    const sql = `select username, email, password from users where username = $1`;
    const results = await this.query(sql, [username]);
    return this.validateResults(results);
  }

  async createUser(username: string, hash: string, email: string) {
    const sql =
      'insert into users (username, password, email) values ($1, $2, $3) returning username, password, email';
    const results = await this.query(sql, [username, hash, email]);
    return this.validateResults(results);
  }

  async updateUser(username: string, newHash?: string, newEmail?: string) {
    //allow user to update either password, email or both
    let sql = 'update users set ';
    let updatedValues = '';
    const params = [];

    if (newHash) {
      updatedValues += 'password = $1';
      params.push(newHash);
    }

    if (newEmail) {
      if (params.length) {
        updatedValues += ', ';
      }
      updatedValues += `email = $${params.length + 1}`;
      params.push(newEmail);
    }

    sql += `${updatedValues} where username = $${params.length + 1}`;
    params.push(username);

    const results = await this.query(sql, params);
    return this.validateResults(results);
  }

  validateResults(results: QueryResult | { error: unknown }): {
    message?: string;
    error?: unknown;
    username?: string;
    email?: string;
    password?: string;
  } {
    if ('error' in results) {
      return {
        message: 'Database connection failed',
        error: results.error,
      };
    }

    if (results.rowCount === 0) {
      return {
        message: 'Operation failed',
      };
    }

    const user: User = results.rows[0];

    return {
      username: user.username,
      email: user.email,
      password: user.password,
    };
  }
}

const userDb = new UserDB(db);

export { userDb };
