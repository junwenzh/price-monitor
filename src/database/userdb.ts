import { DatabaseError, QueryResult } from 'pg';
import { DB, DatabaseResponseError } from './db';

type User = {
  username: string;
  email: string;
  password: string;
};

class UserDB {
  private db: DB;

  constructor() {
    this.db = DB.getInstance();
  }

  validateQueryResponse(res: QueryResult | DatabaseError) {
    if (res instanceof DatabaseError) {
      return {
        message: res.detail,
        code: 500,
      };
    }

    if (!res.rowCount) {
      return {
        message: 'User does not exist',
        code: 400,
      };
    }

    return res.rows[0];
  }

  async getUser(username: string): Promise<User | DatabaseResponseError> {
    const sql = `select username, email, password from users where username = $1`;
    const response = await this.db.query(sql, [username]);
    return this.validateQueryResponse(response);
  }

  async createUser(
    username: string,
    password: string,
    email: string
  ): Promise<User | DatabaseResponseError> {
    const sql =
      'insert into users (username, password, email) values ($1, $2, $3) returning username, email, password';
    const results = await this.db.query(sql, [username, password, email]);
    return this.validateQueryResponse(results);
  }

  async updateUser(
    username: string,
    password?: string,
    email?: string
  ): Promise<User | DatabaseResponseError> {
    const user = await this.getUser(username);

    if ('code' in user) {
      return user;
    }

    const params = [username, password || user.password, email || user.email];

    const sql = `
      UPDATE USER
      SET password = $2, email = $3
      WHERE username = $1
    `;

    const response = await this.db.query(sql, params);
    return this.validateQueryResponse(response);
  }

  async deleteUser(username: string) {
    const sqlDeleteProducts = 'DELETE FROM user_products WHERE username = $1;';
    const sqlDeleteUser = 'DELETE FROM users WHERE username = $1;';

    const response = await this.db.queries(
      [sqlDeleteProducts, sqlDeleteUser],
      [[username], [username]]
    );

    if (response instanceof DatabaseError) {
      return {
        message: response.detail,
        code: 500,
      };
    }

    if (response.rowCount === 1) {
      return {
        message: 'Successfully deleted user.',
        code: 200,
      };
    } else if (response.rowCount === 0) {
      return {
        message: 'User does not exist.',
        code: 400,
      };
    } else {
      return {
        message: 'Unknown error.',
        code: 500,
      };
    }
  }
}

const userDb = new UserDB();

export { User, UserDB, userDb };
