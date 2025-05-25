import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();


const app = express();

// middleware
app.use(ratelimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Home route
app.get('/', (req, res) => {
    res.send("Welcome to the Expense Tracker");
});

app.use("/api/transactions", transactionsRoute);

// initialize DB first then run the App
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is running on port:", PORT);
    });
});