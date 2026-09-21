// seed.js

async function seed() {
    const API_URL = 'http://localhost:8080/api';

    console.log('Seeding Hospitals...');
    const hospitals = [];
    for (let i = 1; i <= 50; i++) {
        const res = await fetch(`${API_URL}/hospitals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `City Hospital ${i}`,
                address: `${i} Main St, City`,
                email: `contact@hospital${i}.com`,
                contactNumber: `98765432${i.toString().padStart(2, '0')}`,
                totalBeds: 500,
                availableBeds: 200
            })
        });
        if (res.ok) {
            hospitals.push(await res.json());
        }
    }
    console.log(`Created ${hospitals.length} hospitals.`);

    console.log('Seeding Users (Registration) and Doctors...');
    let token = '';
    const users = [];
    const doctors = [];
    for (let i = 1; i <= 50; i++) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: `UserFirst${i}`,
                lastName: `UserLast${i}`,
                email: `user${i}@healwise.com`,
                password: 'password123',
                role: i === 1 ? 'ADMIN' : 'USER'
            })
        });
        if (res.ok) {
            const data = await res.json();
            users.push(data);
            if (i === 1) token = data.token; // save admin/user token
        }

        // Create doctors (no auth required)
        const docRes = await fetch(`${API_URL}/doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Dr. Specialist ${i}`,
                qualification: i % 2 === 0 ? 'MD' : 'MBBS',
                specialization: i % 3 === 0 ? 'Cardiology' : (i % 2 === 0 ? 'Neurology' : 'General'),
                fee: 300 + (i * 10),
                hospitalId: hospitals[i % hospitals.length]?.hospitalId || 1
            })
        });
        if (docRes.ok) {
            doctors.push(await docRes.json());
        }
    }
    console.log(`Created ${users.length} users, ${doctors.length} doctors. Using token for auth calls...`);

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    console.log('Seeding Patients...');
    const patients = [];
    for (let i = 1; i <= 50; i++) {
        const res = await fetch(`${API_URL}/patient`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: `Patient Name ${i}`,
                email: `patient${i}@test.com`,
                address: `Avenue ${i}`,
                phone: `99988877${i.toString().padStart(2, '0')}`,
                gender: i % 2 === 0 ? 'Male' : 'Female',
                birthDate: '1990-01-01',
                emergencyContact: `99911122${i.toString().padStart(2, '0')}`,
                bloodGroup: 'O+',
                alergies: 'None',
                chronicConditions: 'None'
            })
        });
        if (res.ok) {
            patients.push(await res.json());
        }
    }
    console.log(`Created ${patients.length} patients.`);

    console.log('Seeding Appointments...');
    const appointments = [];
    for (let i = 1; i <= 50; i++) {
        // First create a doctor slot
        const docId = doctors[i % doctors.length]?.id || 1;
        const slotRes = await fetch(`${API_URL}/doctors/${docId}/slots`, {
            method: 'POST',
            headers: authHeaders, // Slot might need auth or not, let's supply it
            body: JSON.stringify({
                date: '2026-10-10',
                startTime: '09:00:00',
                endTime: '09:30:00'
            })
        });

        let slotId = null;
        if (slotRes.ok) {
            const slot = await slotRes.json();
            slotId = slot.id;
        }

        if (slotId) {
            const apptRes = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    patientId: patients[i % patients.length]?.id || 1,
                    doctorId: docId,
                    hospitalId: hospitals[i % hospitals.length]?.hospitalId || 1,
                    slotId: slotId,
                    notes: `Routine checkup ${i}`
                })
            });
            if (apptRes.ok) {
                appointments.push(await apptRes.json());
            }
        }
    }
    console.log(`Created ${appointments.length} appointments.`);

    console.log('Seeding Bed Allotments and Medicine Orders...');
    let beds = 0;
    let medicines = 0;
    for (let i = 1; i <= 50; i++) {
        const hospId = hospitals[i % hospitals.length]?.hospitalId || 1;
        const patId = patients[i % patients.length]?.id || 1;

        const bedRes = await fetch(`${API_URL}/hospitals/${hospId}/beds/allot?patientId=${patId}&category=GENERAL`, {
            method: 'POST',
            headers: authHeaders
        });
        if (bedRes.ok) beds++;

        const medRes = await fetch(`${API_URL}/medicines/orders`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                patientId: patId,
                deliveryAddress: `Home Address ${i}`,
                items: [{
                    medicineName: `Painkiller ${i}`,
                    quantity: 2,
                    price: 15.5,
                    requiresPrescription: false
                },
                {
                    medicineName: `Antibiotic ${i}`,
                    quantity: 1,
                    price: 25.0,
                    requiresPrescription: true
                }]
            })
        });
        if (medRes.ok) medicines++;
    }
    console.log(`Created ${beds} bed allotments and ${medicines} medicine orders.`);
    console.log('Seed completed successfully!');
}

seed().catch(err => console.error('Seed Failed:', err));
