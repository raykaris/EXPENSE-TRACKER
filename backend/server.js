import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();


const app = express();

// middleware
app.use(express.json());

const PORT = process.env.PORT || 5001;

// DB initialization 
async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initializing DB",error)
        process.exit(1);
    }
}

app.post("/api/transactions", async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;
    } catch (error) {
        
    }
})

// initialize DB first then run the App
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is running on port:", PORT);
    });
});