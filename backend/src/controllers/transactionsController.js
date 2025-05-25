import { sql } from '../config/db.js';

// This controller handles all the transaction related operations
export async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params;

        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        res.status(200).json({
            message: "Transactions fetched successfully",
            transactions: transactions
        });

    } catch (error) {
        console.log("Error fetching transactions", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// This controller creates a new transaction
export async function createTransaction(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;

        if(!title || !category || amount === undefined || !user_id) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category) 
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;

        // console.log("Transaction created successfully", transaction);

        res.status(201).json({
            message: "Transaction created successfully",
            transaction: transaction[0]
        });
    } catch (error) {
        console.log("Error creating transaction", error);
        res.status(500).json({
            message : "Internal server error"
        });
    }
};

// This controller deletes a transaction by ID
export async function deleteTransaction(req, res)  {
    try {
        const { id } = req.params;

        // check if id is a valid number
        if(isNaN(parseInt(id))) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.log("Error deleting transaction", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// This controller fetches the summary of transactions for a user
export async function getSummaryByUserId (req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance
            FROM transactions 
            WHERE user_id = ${userId}
        `;
        // income is + (amount > 0) and expense is - (amount < 0)   
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income
            FROM transactions 
            WHERE user_id = ${userId} AND amount > 0
        `;
        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses
            FROM transactions 
            WHERE user_id = ${userId} AND amount < 0
        `;

        res.status(200).json({
            message: "Transaction summary fetched successfully",
            summary: {
                balance: balanceResult[0].balance,
                income: incomeResult[0].income,
                expenses: expensesResult[0].expenses
            }
        });

    } catch (error) {
        console.log("Error fetching transaction summary", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}