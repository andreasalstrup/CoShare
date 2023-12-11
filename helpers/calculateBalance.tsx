import { Expense } from "./calculateExpenses";

/*export const calculateBalance = (expenses: Expense[]) => {
    
    const totalSpent: { [name: string]: number } = {};
    const userCount: { [name: string]: number } = {};

    expenses.forEach(({ user, amount }) => {
        totalSpent[user] = (totalSpent[user] || 0) + amount;
        userCount[user] = (userCount[user] || 0) + 1;
    });

    const users = Object.keys(totalSpent);
    const totalUsers = users.length;
    const averageAmount = users.reduce((acc, user) => acc + (totalSpent[user] / userCount[user]), 0) / totalUsers;

    const calculatedBalances: { [name: string]: number } = {};
    users.forEach((user) => {
        calculatedBalances[user] = parseFloat(((totalSpent[user] / userCount[user]) - averageAmount).toFixed(2));
    });

    const calculatedBalances: { [name: string]: number } = {};
    

    const calculatedBalancesArray: {user: string, amount: number}[] = Object.entries(calculatedBalances).map(([user, amount]) => ({
        user,
        amount,
    }));
    
    return calculatedBalancesArray;
};*/

export const calculateBalance = (expenses: Expense[]) => {
    const balanceMap: Record<string, number> = {};
    let averageAmount = 0;
    let total = 0;
    let uniqueUsers = new Set<string>();


    // Calculate the total expenses and add users to set
    expenses.forEach((expense) => {
        uniqueUsers.add(expense.user)
        total += expense.amount;
    });

    averageAmount = total/uniqueUsers.size;


    //Calculate the balance for each user
    expenses.forEach((expense) => {
        const { user, amount } = expense;
        if (!balanceMap[user]) {
          balanceMap[user] = 0;
        }
        balanceMap[user] += amount;
    });
    for(var user in balanceMap){
        balanceMap[user] -= averageAmount;
    }

    // Convert the balanceMap to an array of { user, amount }
    const balance: {user: string, amount: number}[] = Object.entries(balanceMap).map(([user, amount]) => ({ user, amount }));
  
    return balance;
  }