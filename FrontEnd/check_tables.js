import pkg from 'pg';
const { Client } = pkg;

async function check() {
    const client = new Client({
        user: 'postgres',
        password: 'dhamo_2005',
        host: 'localhost',
        port: 5432,
        database: 'HealWise'
    });

    await client.connect();
    const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `);
    console.log(res.rows.map(r => r.table_name));
    await client.end();
}

check().catch(console.error);
