import pkg from 'pg';
import ExcelJS from 'exceljs';
import path from 'path';

const { Client } = pkg;

async function exportData() {
    const client = new Client({
        user: 'postgres',
        password: 'dhamo_2005',
        host: 'localhost',
        port: 5432,
        database: 'HealWise'
    });

    await client.connect();

    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'HealWise System';
        workbook.created = new Date();

        // Get all tables
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        const tables = res.rows.map(r => r.table_name);

        for (const tableName of tables) {
            const worksheet = workbook.addWorksheet(tableName);

            // Get data
            const dataRes = await client.query(`SELECT * FROM ${tableName}`);
            const data = dataRes.rows;

            if (data.length > 0) {
                // Generate columns based on the keys of the first row
                const columns = Object.keys(data[0]).map(key => ({
                    header: key,
                    key: key,
                    width: 20
                }));
                worksheet.columns = columns;

                // Add rows
                for (const row of data) {
                    worksheet.addRow(row);
                }
            } else {
                // If table is empty, just fetch the columns to provide schema
                const colRes = await client.query(`
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = $1
                `, [tableName]);

                const columns = colRes.rows.map(r => ({
                    header: r.column_name,
                    key: r.column_name,
                    width: 20
                }));
                worksheet.columns = columns;
            }
        }

        // Save to Artifacts directory so it can be easily downloaded
        const outPath = 'C:/Users/dhamo/.gemini/antigravity/brain/ef6de1d8-3cf4-4611-9783-f2686d24a260/HealWise_Sample_Data.xlsx';
        await workbook.xlsx.writeFile(outPath);
        console.log('Successfully saved to ' + outPath);

        // Also save a copy to the project root for safety
        const rootPath = 'C:/Users/dhamo/IdeaProjects/HealWise/HealWise_Sample_Data.xlsx';
        await workbook.xlsx.writeFile(rootPath);
        console.log('Successfully saved to ' + rootPath);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

exportData();
