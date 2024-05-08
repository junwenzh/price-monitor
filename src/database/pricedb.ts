//import { createUpdateQuery, UpdateQueryParams } from '@/utils/sqlHelpers';
export interface UpdateDetails {
  field: string;
  value: any;
}

import { QueryResult } from 'pg';
import { db, DB } from './db';

class PriceDB {
  db: DB;
  pool;
  query;

  constructor(db: DB) {
    this.db = db;
    this.pool = db.getPool();
    this.query = db.query;
  }

  // TypeScript interface for type-safe updates

  //crud

  //METHODS FOR USE IN REFRESHCONTROLLER
  //method that gets all urls
  async getUrls() {
    const sql = `
      SELECT  DISTINCT
              up.url,
              u.selector,
              u.use_fetch,
              ph.price,
              rownumber=ROW_NUMBER() OVER(PARTITION BY u.url ORDER BY ph.price_timestamp DESC),
              ph.price_timestamp
      FROM    user_products up
      JOIN    urls u ON up.url=u.url
      JOIN    pricehistory ph ON up.url=ph.url
      WHERE   u.valid_url=true AND u.valid_selector=true`;
    try {
      const results = (await this.query(sql)) as QueryResult;
      return results.rows.filter(row => row.rownumber === 1);
    } catch (error) {
      console.error('Error fetching urls', error);
      throw error;
    }
  }

  //method to get all products for use in refreshController when checking against target price
  async getAllProducts() {
    const sql = `
      SELECT  up.target_price, up.url, us.email
      FROM    user_products up
      JOIN    users us ON up.username = us.username
      WHERE   up.notify = true`;

    const results = (await this.query(sql)) as QueryResult;

    // @ts-expect-error ts error only
    if (results['error']) {
      return [];
    }

    return results.rows;
  }

  //method for use in refreshController, to update valid_url and valid_selector and use_fetch from urls
  async updateValidity(
    url: string,
    valid_url: boolean,
    valid_selector: boolean,
    use_fetch: boolean
  ) {
    const sql = `UPDATE urls
              SET valid_url = $2,
              valid_selector = $3,
              use_fetch = $4
              WHERE url = $1`;

    const result = await db.query(sql, [
      url,
      valid_url,
      valid_selector,
      use_fetch,
    ]);
    return result;
  }
  //method for use in refreshController, to update price from pricehistory
  async addPriceRecord(url: string, price: number) {
    const sql = `INSERT INTO pricehistory (url, price) VALUES ($1, $2)`;
    const result = await db.query(sql, [url, price]);
    return result;
  }

  //methods that allow user to update specific field
  // async updateField() {
  //   const sql = ``;
  //   try {
  //     const results = (await this.query(sql, [username])) as QueryResult;
  //     console.log('Results:', results.rows);
  //     return results.rows;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async updateProductInfo(
    username: string,
    url: string,
    updates: UpdateDetails[]
  ) {
    const setClauses = updates.map(
      (upd, index) => `${upd.field} = $${index + 1}`
    );
    const values = updates.map(upd => upd.value);

    const sql = `UPDATE user_products SET ${setClauses.join(', ')} WHERE username = $${updates.length + 1} AND url = $${updates.length + 2}`;
    values.push(username, url); // Add username and url to the end of the values array

    try {
      await this.db.query(sql, values);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //method to delete a user product
  async deleteTrackedItem(username: string, url: string) {
    console.log(url);
    const sql = ``;
    try {
      const results = (await this.query(sql, [username])) as QueryResult;
      console.log('Results:', results.rows);
      return results.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
