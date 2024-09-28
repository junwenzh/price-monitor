//import { createUpdateQuery, UpdateQueryParams } from '@/utils/sqlHelpers';
export interface UpdateDetails {
  field: string;
  value: any;
}

import { DatabaseError, QueryResult } from 'pg';
import { DB } from './db';

class PriceDB {
  db: DB;

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

    return res.rows;
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
              ROW_NUMBER() OVER(PARTITION BY u.url ORDER BY ph.price_timestamp DESC) as rownumber,
              ph.price_timestamp
      FROM    user_products up
      JOIN    urls u ON up.url=u.url
      JOIN    pricehistory ph ON up.url=ph.url
      WHERE   u.valid_url=true AND u.valid_selector=true`;

    const response = await this.db.query(sql);
    return this.validateQueryResponse(response);
  }

  //method to get all products for use in refreshController when checking against target price
  async getAllProducts() {
    const sql = `
      SELECT  up.target_price, up.url, us.email
      FROM    user_products up
      JOIN    users us ON up.username = us.username
      WHERE   up.notify = true`;

    const response = await this.db.query(sql);
    return this.validateQueryResponse(response);
  }

  //method for use in refreshController, to update valid_url and valid_selector and use_fetch from urls
  async updateValidity(
    url: string,
    valid_url: boolean,
    valid_selector: boolean,
    use_fetch: boolean
  ) {
    const sql = `
      UPDATE urls
      SET valid_url = $2,
      valid_selector = $3,
      use_fetch = $4
      WHERE url = $1
      RETURNING url;`;

    const response = await this.db.query(sql, [
      url,
      valid_url,
      valid_selector,
      use_fetch,
    ]);
    return this.validateQueryResponse(response);
  }
  //method for use in refreshController, to update price from pricehistory
  async addPriceRecord(url: string, price: number) {
    const sql = `INSERT INTO pricehistory (url, price) VALUES ($1, $2) RETURNING url, price;`;
    const response = await this.db.query(sql, [url, price]);
    return this.validateQueryResponse(response);
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

    const sql = `
      UPDATE user_products
      SET ${setClauses.join(', ')}
      WHERE username = $${updates.length + 1}
        AND url = $${updates.length + 2}
      RETURNING username, url;`;

    values.push(username, url); // Add username and url to the end of the values array

    const response = await this.db.query(sql, values);
    return this.validateQueryResponse(response);
  }

  //method to delete a user product
  async deleteTrackedItem(username: string, url: string) {
    console.log(url);
    const sql = `DELETE FROM user_products WHERE username = $1 and url = $2 RETURNING username, url;`;

    const response = await this.db.query(sql, [username, url]);
    return this.validateQueryResponse(response);
  }

  //method to add new base url

  //method to get all user products for a single user

  async getProducts(username: string) {
    // used for the user products table
    // url, note, target price, current price, notify

    const sql = `
      SELECT 
        *
      FROM (
        SELECT
          up.url,
          up.user_note,
          up.target_price,
          ph.price,
          ph.price_timestamp,
          up.notify,
          ROW_NUMBER() OVER(PARTITION BY up.url ORDER BY ph.price_timestamp ASC) as rn
        FROM
          user_products up
        JOIN
          pricehistory ph
          ON  up.url = ph.url
        WHERE
          up.username = $1
      ) a
      WHERE rn = 1;
    `;

    const response = await this.db.query(sql, [username]);
    return this.validateQueryResponse(response);
  }

  //method for base URL update

  async hasBaseUrl(baseurl: string) {
    const sql = 'SELECT * FROM baseurls WHERE baseurl = $1;';

    const response = await this.db.query(sql, [baseurl]);
    return this.validateQueryResponse(response);
  }

  async createBaseUrl(baseurl: string, selector: string) {
    const sql =
      'INSERT INTO baseurls (baseurl, selector) values ($1, $2) RETURNING baseurl, selector;';

    const response = await this.db.query(sql, [baseurl, selector]);
    return this.validateQueryResponse(response);
  }

  async updateBaseUrl(baseurl: string, selector: string) {
    const sql =
      'UPDATE baseurls SET selector = $2 WHERE baseurl = $1 RETURNING baseurl;';

    const response = await this.db.query(sql, [baseurl, selector]);
    return this.validateQueryResponse(response);
  }

  async newTrackedItem(
    url: string,
    selector: string,
    username: string,
    user_note: string,
    price: number,
    target_price: number
  ): Promise<any> {
    const sqlInsertUrl = `
      INSERT INTO urls (url, selector)
      VALUES ($1, $2)
      ON CONFLICT (url)
      DO UPDATE
      SET selector = EXCLUDED.selector;`;
    const sqlInsertPriceHistory =
      'INSERT INTO pricehistory (url, price) VALUES ($1, $2)';
    const sqlInsertUserProducts = `
      INSERT INTO user_products (url, username, user_note, target_price)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (url, username)
      DO UPDATE
      SET user_note = EXCLUDED.user_note
      RETURNING username, url;`;

    const response = await this.db.queries(
      [sqlInsertUrl, sqlInsertPriceHistory, sqlInsertUserProducts],
      [
        [url, selector],
        [url, price],
        [url, username, user_note, target_price],
      ]
    );

    return this.validateQueryResponse(response);
  }
}

const priceDb = new PriceDB();

export { priceDb };
