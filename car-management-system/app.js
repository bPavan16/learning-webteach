const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'car_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '/pages/homepage.html'), err => {
        if (err) res.status(500).send(err.message);
    });
});

app.get('/admin', (_, res) => {
    res.sendFile(path.join(__dirname, '/pages/addCar.html'), err => {
        if (err) res.status(500).send(err.message);
    });
});

app.get('/display', (_, res) => {
    res.sendFile(path.join(__dirname, '/pages/displayPage.html'), err => {
        if (err) res.status(500).send(err.message);
    });
});

app.post('/addCar', (req, res) => {
    const { vehicle_id, vehicle_type, staff_id, price, available } = req.body;

    const query2 = 'SELECT * FROM staff WHERE staff_id = ?';
    db.query(query2, [staff_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.json({ message: 'No Staff having that Id is found, add one!' });
        }

        const query = 'INSERT INTO vehicle (vehicle_id, vehicle_type, staff_id, price, availability) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [vehicle_id, vehicle_type, staff_id, price, available], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: 'Car Registration successful!' });
        });
    });
});

app.post('/addStaff', (req, res) => {
    const { staff_id_2, staff_name, staff_role } = req.body;

    const query = 'INSERT INTO staff (staff_id, staff_name, staff_role) VALUES (?, ?, ?)';
    db.query(query, [staff_id_2, staff_name, staff_role], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Staff Registration successful!' });
    });
});

app.post('/deleteVehicle', (req, res) => {
    const { vehicle_id_2 } = req.body;

    const query = 'DELETE FROM vehicle WHERE vehicle_id = ?';
    db.query(query, [vehicle_id_2], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Vehicle Delete successful!' });
    });
});

app.post('/updatePrice', (req, res) => {
    const { myprice, vehicle_id_3 } = req.body;

    const query = 'UPDATE vehicle SET price = ? WHERE vehicle_id = ?';
    db.query(query, [myprice, vehicle_id_3], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Vehicle Update successful!' });
    });
});

app.post('/getCars', (req, res) => {
    const query = 'SELECT * FROM vehicle JOIN staff ON vehicle.staff_id = staff.staff_id';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
