import express from 'express';
import { createTransaction, deleteTransaction, getSummaryByUserId, getTransactionsByUserId,  } from '../controllers/transactionsController.js';


const router = express.Router();

// API endpoint to get transactions by userId
router.get("/:userId", getTransactionsByUserId);

// API endpoint to create a new transaction
router.post("/", createTransaction);

// API endpoint to delete a transaction by ID
router.delete("/:id", deleteTransaction);

// API endpoint to update transaction summary by userId
router.get("/summary/:userId", getSummaryByUserId);

export default router;