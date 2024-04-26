import { db, DB } from './db';

class UrlDb {
  constructor(public db: DB) {
    this.db = db;
  }

  async getSelector(url: string) {
    const sql = 'SELECT * FROM url WHERE url=$1';
    const results = await db.query(sql, [url]);
    return results;
  }

  async getUsers(url: string, price: number) {
    const sql = 'SELECT * FROM users WHERE url=$1 and price<$2';
    const results = await db.query(sql, [url, price]);
    return results;
  }

  async updateUseFetch(url: string, useFetch: boolean) {
    const sql = 'UPDATE urls SET use_fetch = $2 WHERE url = $1';
    const results = await db.query(sql, [url, useFetch]);
    return results;
  }

  async invalidateUrl(url: string) {
    const sql = 'UPDATE urls SET valid_url = false WHERE url = $1';
    const results = await db.query(sql, [url]);
    return results;
  }
}

export default new UrlDb(db);
