import { QueryResult } from 'pg';
import { db, DB } from './db';
import {
  createUpdateQuery,
  UpdateQueryParams,
  UpdateQueryResult,
} from '@/utils/sqlHelpers';

class PriceDB {
  db: DB;
  pool;
  query;

  constructor(db: DB) {
    this.db = db;
    this.pool = db.getPool();
    this.query = db.query;
  }
  //crud

  //method that gets all urls
  async getUrls() {
    const sql = `SELECT DISTINCT up.url, u.selector FROM user_products up JOIN urls u ON up.url =u.url`;
    try {
      const results = (await this.query(sql)) as QueryResult;
      return results.rows;
    } catch (error) {
      console.error('Error fetching urls', error);
      throw error;
    }
  }

  //methods that allow user to update specific field

  //method to delete a user product

  //method to add new base url

  //method to get all user products for a single user

  async getProducts(username: string) {
    const sql = `SELECT up.username, up.url, up.user_note, up.target_price, u.selector, ph.price,ph.price_timestamp FROM user_products up JOIN urls u ON up.url = u.url JOIN pricehistory ph ON u.url = ph.url WHERE up.username = $1`;
    try {
      const results = (await this.query(sql, [username])) as QueryResult;
      console.log('Results:', results.rows);
      return results.rows;
    } catch (error) {
      console.error('Error fetching product info:', error);
      throw error;
    }
  }

  async updateProduct(params: UpdateQueryParams) {
    const queryData = createUpdateQuery(params);
    if (!queryData) {
      throw new Error('No valid fields provided for update');
    }

    try {
      const { sqlString, values } = queryData;
      const result = await this.pool.query(sqlString, values);
      return result.rows; // Or handle the response as needed
    } catch (error) {
      console.error('Error executing update query:', error);
      throw error;
    }
  }

  async deleteProduct(username: string, url: string) {
    const sql = `DELETE FROM user_products WHERE username = $1 AND url = $2`;
    try {
      const results = (await this.query(sql, [username, url])) as QueryResult;
      return results.rows;
    } catch (error) {
      console.error('Database error', error);
      throw error;
    }
  }

  //method for base URL update

  async createBaseUrl(baseurl: string, selector: string) {
    const sql =
      'insert into baseurls (baseurl, selector) values ($1, $2) returning baseurl, selector';
    try {
      const results = (await this.query(sql, [
        baseurl,
        selector,
      ])) as QueryResult;
      return results.rows;
    } catch (error) {
      console.error('Database error', error);
      throw error;
    }
  }

  //method to query a base url

  async newTrackedItem(
    url: string,
    selector: string,
    username: string,
    user_note: string,
    price: number,
    target_price: number
  ): Promise<any> {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO urls (url, selector) VALUES ($1, $2) ON CONFLICT (url) DO UPDATE SET selector = EXCLUDED.selector',
        [url, selector]
      );
      await client.query(
        'INSERT INTO pricehistory (url, price) VALUES ($1, $2)',
        [url, price]
      );
      await client.query(
        'INSERT INTO user_products (url, username, user_note, target_price) VALUES ($1, $2, $3, $4) ON CONFLICT (url, username) DO UPDATE SET user_note = EXCLUDED.user_note',
        [url, username, user_note, target_price]
      );

      await client.query('COMMIT');
      return { success: true };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e; // Properly throw the error after rollback
    } finally {
      client.release();
    }
  }
}

const priceDb = new PriceDB(db);

export { priceDb };
// type User = {
//   username: string;
//   email: string;
//   password: string;
// };

//users: username, password, email
//urls: url, selector
//baseurls: baseurl, selector
//pricehistory: url+price_timestamp, url (ref), price, price_timestamp
//user_products: username+url, username (ref), url (ref), user_note, target_price

// class PriceDB {
//   pool;
//   query;

//   constructor(db: DB) {
//     this.pool = db.getPool();
//     this.query = db.query;
//   }

//   async getPrice(username: string) {
//     const sql = `select username, email, password from users where username = $1`;
//     const results = await this.query(sql, [username]);
//     return this.validateResults(results);
//   }

//   async newProductTracking(url: string, selector: string, username: string, user_note: string, price: number) {
//     try {
//         await this.query('BEGIN');

//         const insertUrl = 'insert into urls (url, selector) values ($1, $2) on conflict (url) do update set selector = excluded.selector';
//         await this.query(insertUrl, [url, selector]);

//         const insertPrice = 'insert into pricehistory (url, price) VALUES ($1, $2)';
//         await this.query(insertPrice, [url, price]);

//         const insertUserProduct = 'insert into user_products (url, username, user_note, target_price) VALUES ($1, $2, $3, $4) on conflict (url, username) do update set user_note = excluded.user_note';
//         await this.query(insertUserProduct, [url, username, user_note]);

//         await this.query('COMMIT');
//         return { success: true };
//     } catch (e) {
//         await this.query('ROLLBACK');
//         throw e;  // Rethrow the error after rollback
//     } finally {
//         this.release();
//     }
// }
// (url: string, selector: string) {
//     const sql =
//       'insert into urls (url, selector) values ($1, $2) returning url, selector';
//     const results = await this.query(sql, [url, selector]);
//     return this.validateResults(results);
//   }

//   async createSelector(url: string, selector: string) {
//     const sql =
//       'insert into urls (url, selector) values ($1, $2) returning url, selector';
//     const results = await this.query(sql, [url, selector]);
//     return this.validateResults(results);
//   }
//   async createPriceHistory(url: string, price: number) {
//     const sql =
//       'insert into pricehistory (url, price) VALUES ($1, $2)';
//     const results = await this.query(sql, [url, price]);
//     return this.validateResults(results);
//   }

//   async createUserProduct(url: string, username: string, user_note: string, target_price: number) {
//     const sql =
//       'insert into user_products (url, username, user_note, target_price) VALUES ($1, $2, $3, $4)';
//     const results = await this.query(sql, [url, username, user_note, target_price]);
//     return this.validateResults(results);
//   }
//   await client.query(
//     `INSERT INTO urls (url, selector) VALUES ($1, $2)
//     ON CONFLICT (url) DO UPDATE SET selector = EXCLUDED.selector`,
//     [url, selector]
// );

// // Insert new price history entry
// await client.query(
//     `INSERT INTO pricehistory (url, price, price_timestamp) VALUES ($1, $2, $3)`,
//     [url, price, price_timestamp]
// );

// // Insert or update user products entry
// await client.query(
//     `INSERT INTO user_products (url, username, user_note) VALUES ($1, $2, $3)
//     ON CONFLICT (url, username) DO UPDATE SET user_note = EXCLUDED.user_note`,
//     [url, username, user_note]
// );
//   async updateUser(username: string, newHash?: string, newEmail?: string) {
//     //allow user to update either password, email or both
//     let sql = 'update users set ';
//     let updatedValues = '';
//     const params = [];

//     if (newHash) {
//       updatedValues += 'password = $1';
//       params.push(newHash);
//     }

//     if (newEmail) {
//       if (params.length) {
//         updatedValues += ', ';
//       }
//       updatedValues += `email = $${params.length + 1}`;
//       params.push(newEmail);
//     }

//     sql += `${updatedValues} where username = $${params.length + 1}`;
//     params.push(username);

//     const results = await this.query(sql, params);
//     return this.validateResults(results);
//   }

//   validateResults(results: QueryResult | { error: unknown }): {
//     message?: string;
//     error?: unknown;
//     username?: string;
//     email?: string;
//     password?: string;
//   } {
//     if ('error' in results) {
//       return {
//         message: 'Database connection failed',
//         error: results.error,
//       };
//     }

//     if (results.rowCount === 0) {
//       return {
//         message: 'Operation failed',
//       };
//     }

//     const user: User = results.rows[0];

//     return {
//       username: user.username,
//       email: user.email,
//       password: user.password,
//     };
//   }
// }

// const priceDb = new PriceDB(db);

// export { priceDb };

// pricemonitor=# CREATE TABLE users (
//     pricemonitor(# username VARCHAR(50) PRIMARY KEY,
//     pricemonitor(# password VARCHAT(100) NOT NULL,
//     pricemonitor(# password VARCHAR(100) NOT NULL,
//     pricemonitor(# email VARCHAR(100) UNIQUE NOT NULL
//     pricemonitor(# );
//     ERROR:  type "varchat" does not exist
//     LINE 3: password VARCHAT(100) NOT NULL,
//                      ^
//     pricemonitor=# CREATE TABLE users (
//     pricemonitor(# username VARCHAR(50) PRIMARY KEY,
//     pricemonitor(# password VARCHAR(100) NOT NULL,
//     pricemonitor(# email VARCHAR(100) UNIQUE NOT NULL
//     pricemonitor(# );
//     CREATE TABLE
//     pricemonitor=# CREATE TABLE urls (
//     pricemonitor(# url VARCHAR PRIMARY KEY,
//     pricemonitor(# selector VARCHAR NOT NULL
//     pricemonitor(# );
//     CREATE TABLE
//     pricemonitor=# CREATE TABLE baseurls (
//     pricemonitor(# baseurl VARCHAR PRIMARY KEY,
//     pricemonitor(# selector VARCHAR NOT NULL
//     pricemonitor(# );
//     CREATE TABLE
//     pricemonitor=# CREATE TABLE pricehistory (
//     pricemonitor(# url VARCHAR urls(url),
//     pricemonitor(# price REAL NOT NULL,
//     pricemonitor(# ;
//     pricemonitor(# ;
//     pricemonitor(# );
//     ERROR:  syntax error at or near "urls"
//     LINE 2: url VARCHAR urls(url),
//                         ^
//     pricemonitor=# CREATE TABLE pricehistory (
//     pricemonitor(# url VARCHAR REFERENCES urls(url),
//     pricemonitor(# price REAL NOT NULL,
//     pricemonitor(# price_timestamp TIMESTAMP DEFAULT NOW(),
//     pricemonitor(# PRIMARY KEY(url price_timestamp)
//     pricemonitor(# );
//     ERROR:  syntax error at or near "price_timestamp"
//     LINE 5: PRIMARY KEY(url price_timestamp)
//                             ^
//     pricemonitor=# CREATE TABLE pricehistory (
//     url VARCHAR REFERENCES urls(url),
//     price REAL NOT NULL,
//     price_timestamp TIMESTAMP DEFAULT NOW(),
//     PRIMARY KEY(url, price_timestamp)
//     );
//     CREATE TABLE
//     pricemonitor=# CREATE TABLE user_products (
//     pricemonitor(# username VARCHAR REFERENCES users(username),
//     pricemonitor(# url VARCHAR REFERENCES urls(url),
//     pricemonitor(# user_note VARCHAR,
//     pricemonitor(# target_price REAL,
//     pricemonitor(# PRIMARY KEY(username, url)
//     pricemonitor(# );
//     CREATE TABLE
//     pricemonitor=#
