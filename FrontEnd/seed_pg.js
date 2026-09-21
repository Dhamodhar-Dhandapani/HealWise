import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pkg;

async function seed() {
    const client = new Client({
        user: 'postgres',
        password: 'dhamo_2005',
        host: 'localhost',
        port: 5432,
        database: 'HealWise'
    });

    await client.connect();

    try {
        console.log('Clearing old data...');
        await client.query("TRUNCATE TABLE users, hospitals, doctors, patients, doctor_slots, appointments, bed_inventory, bed_allotments, medicine_orders, order_items RESTART IDENTITY CASCADE;");

        console.log('Seeding Hospitals...');
        for (let i = 1; i <= 50; i++) {
            let n = i < 10 ? '0' + i : '' + i;
            await client.query(
                "INSERT INTO hospitals (name, address, email, contact_number, total_beds, available_beds) VALUES ($1, $2, $3, $4, $5, $6)",
                ["City Hospital " + i, "Address " + i, "hosp" + i + "@healwise.com", "90000000" + n, 100, 50]
            );
        }

        console.log('Seeding Users & Doctors & Patients...');
        const hash = bcrypt.hashSync('password123', 10);
        for (let i = 1; i <= 50; i++) {
            let n = i < 10 ? '0' + i : '' + i;
            await client.query(
                "INSERT INTO users (email, first_name, last_name, password, role) VALUES ($1, $2, $3, $4, $5)",
                ["user" + i + "@healwise.com", "First" + i, "Last" + i, hash, i === 1 ? "ADMIN" : "USER"]
            );

            await client.query(
                "INSERT INTO doctors (name, qualification, specialization, fee, hospital_id) VALUES ($1, $2, $3, $4, $5)",
                ["Dr. Doc " + i, "MBBS", "General", 500, (i % 50) + 1]
            );

            await client.query(
                "INSERT INTO patients (name, email, phone, address, gender, birth_date, emergency_contact, blood_group, alergies, chronic_conditions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                ["Patient " + i, "pat" + i + "@healwise.com", "80000000" + n, "Pat Address " + i, "Male", "1990-01-01", "1234567890", "O+", "None", "None"]
            );
        }

        console.log('Seeding Doctor Slots & Appointments...');
        for (let i = 1; i <= 50; i++) {
            await client.query(
                "INSERT INTO doctor_slots (doctor_id, date, start_time, end_time, is_booked) VALUES ($1, $2, $3, $4, $5)",
                [(i % 50) + 1, "2026-10-10", "09:00:00", "09:30:00", true]
            );

            // Appointments (needs patient_id, doctor_id, hospital_id, slot_id)
            await client.query(
                "INSERT INTO appointments (patient_id, doctor_id, hospital_id, slot_id, appointment_date, appointment_time, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                [(i % 50) + 1, (i % 50) + 1, (i % 50) + 1, i, "2026-10-10", "09:00:00", "CONFIRMED", "Checkup"]
            );
        }

        console.log('Seeding Bed Inventory, Allotments, Medicine Orders...');
        for (let i = 1; i <= 50; i++) {
            await client.query(
                "INSERT INTO bed_inventory (hospital_id, category, total_count, available_count) VALUES ($1, $2, $3, $4)",
                [(i % 50) + 1, "GENERAL", 50, 20]
            );

            await client.query(
                "INSERT INTO bed_allotments (hospital_id, patient_id, category, allotted_at, discharged_at, status) VALUES ($1, $2, $3, $4, $5, $6)",
                [(i % 50) + 1, (i % 50) + 1, "GENERAL", new Date(), null, "ALLOTTED"]
            );

            await client.query(
                "INSERT INTO medicine_orders (patient_id, delivery_address, prescription_url, status, total_amount, order_date) VALUES ($1, $2, $3, $4, $5, $6)",
                [(i % 50) + 1, "Delivery Addr", "", "COMPLETED", 100.0, new Date()]
            );

            await client.query(
                "INSERT INTO order_items (order_id, medicine_name, quantity, price, requires_prescription) VALUES ($1, $2, $3, $4, $5)",
                [i, "Paracetamol", 2, 10.0, false]
            );
        }

        console.log("Database successfully seeded with 50 rows each!");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

seed();
