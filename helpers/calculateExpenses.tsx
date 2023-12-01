export type Expense = {
    user: string;
    amount: number;
};

export type Transaction = {
    from: string;
    to: string;
    amount: number;
};

export const calculateExpenses = (expenses: Expense[]): Transaction[] => {
    // Calculate total spent by each user
    const totalSpent: { [name: string]: number } = {};
    expenses.forEach((expense) => {
        totalSpent[expense.user] = (totalSpent[expense.user] || 0) + expense.amount;
    });

    // Calculate the average amount spent by all users
    const numUsers = Object.keys(totalSpent).length;
    const totalAmountSpent = Object.values(totalSpent).reduce((total, amount) => total + amount, 0);
    const averageAmount = totalAmountSpent / numUsers;

    // Calculate who owes or is owed how much
    const transactions: Transaction[] = [];
    Object.keys(totalSpent).forEach((creditor) => {
        let amountOwed = totalSpent[creditor] - averageAmount;

        if (amountOwed > 0) {
            Object.keys(totalSpent).forEach((debitor) => {
                if (creditor !== debitor && totalSpent[debitor] < averageAmount && averageAmount != totalSpent[creditor]) {
                    const settleAmount = Math.min(amountOwed, averageAmount - totalSpent[debitor]);
                    transactions.push({ to: creditor, from: debitor, amount: settleAmount });
                    totalSpent[creditor] -= settleAmount;
                    totalSpent[debitor] += settleAmount;
                    amountOwed -= settleAmount;
                }
            });
        }
    });
    return transactions;
};