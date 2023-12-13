import { Expense } from "./calculateExpenses";

export const calculateBalance = (expenses: Expense[], members: string[]) => {
    const balanceMap: Record<string, number[]> = {};
    const balance: { user: string, amount: number }[] = [];

    members.forEach((name) => {
        if (!balanceMap[name]) {
            balanceMap[name] = [];
        }

        balanceMap[name][0] = 0;
        balanceMap[name][1] = 0;
    })

    //Calculate the amount paid for each user and initialse balanceMap
    expenses.forEach((expense) => {
        const { user, amount} = expense;

        balanceMap[user][0] += amount;
    });

    // Calculate the total expenses each user has been a part of
    expenses.forEach((expense) => {
        const { user, amount} = expense;
        const users: string[] = JSON.parse(expense.users);

        if(users.includes(user)){
            balanceMap[user][1] += amount / users.length;
        }
    });

    for(var user in balanceMap){
        balanceMap[user][0] -= balanceMap[user][1];
    }

    for (const user in balanceMap) {
        if (balanceMap[user][0] != undefined) {
            balance.push({ user, amount: balanceMap[user][0] });
        }
    }


    return balance;
  }