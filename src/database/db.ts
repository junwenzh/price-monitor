import { Pool } from 'pg';

const url = '';

const pool = new Pool({
  connectionString: url,
});

async function query(sql: string, params?: any[]) {
  const client = await pool.connect();

  let results;

  try {
    results = await client.query(sql, params);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }

  return results;
}

// async
// returns a client
//const client = pool.connect(); // exporting a promise of a client
// pool.connect()
// .then(() => {

// })
// .catch((err) => {
//     console.log(err);
// });

async function testConnection() {
  const results = await query('select * from users;');
  console.log(results);
}

function endPool() {
  pool.end();
  console.log('Postgres closed');
}

export { query, testConnection, endPool };
