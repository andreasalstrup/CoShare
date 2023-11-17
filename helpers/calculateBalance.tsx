type Expense = {
    user: string;
    amount: number;
};

export const calculateBalance = (expenses: Expense[]) => {
    const totalSpent: { [name: string]: number } = {};
    const userCount: { [name: string]: number } = {};
    expenses.forEach((expense) => {
        totalSpent[expense.user] = (totalSpent[expense.user] || 0) + expense.amount;
        userCount[expense.user] = (userCount[expense.user] || 0) + 1;
    });

    const users = Object.keys(totalSpent);
    const totalUsers = users.length;
    const averageAmount = users.reduce((acc, user) => acc + (totalSpent[user] / userCount[user]), 0) / totalUsers;

    const calculatedBalances: { [name: string]: number } = {};
    users.forEach((user) => {
        calculatedBalances[user] = parseFloat(((totalSpent[user] / userCount[user]) - averageAmount).toFixed(2));
    });

    const calculatedBalancesArray: Expense[] = Object.entries(calculatedBalances).map(([user, amount]) => ({
        user,
        amount,
    }));

    return calculatedBalancesArray;
};