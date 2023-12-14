import { Expense } from "./calculateExpenses";

export const calculateBalance = (expenses: Expense[], members: string[], previousBalance: { user: string, amount: number }[]) => {
    const balanceMap: Record<string, number[]> = {};
    const balance: { user: string, amount: number }[] = [];

    members.forEach((name) => {
        if(name){
            if (!balanceMap[name]) {
                balanceMap[name] = [];
            }
    
            balanceMap[name][0] = 0;
            balanceMap[name][1] = 0;
        }
    })

    //Calculate the amount paid for each user
    expenses.forEach((expense) => {
        if(expense && expense.user){
            const { user, amount} = expense;

            if (!balanceMap[user]){
                return;
            }

            balanceMap[user][0] += amount;
        }
    });

    // Calculate the total expenses each user has been a part of
    expenses.forEach((expense) => {
        if(expense && expense.users){
            const { amount } = expense;
            
            try {
                let usersString = expense.users.replace(/^"/, '')
                                           .replace(/"$/, '')
                                           .replace(/\\"/g, '"');

                const parsedUsers = JSON.parse(usersString);
                const users = Array.isArray(parsedUsers) ? parsedUsers : [parsedUsers];
                console.log(users)
                users.forEach((user) => {
                    if(user !== undefined && balanceMap[user] !== undefined && balanceMap[user][1] !== undefined){
                        balanceMap[user][1] += amount / parsedUsers.length;
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    });

    if(balanceMap){
        for(var user in balanceMap){
            balanceMap[user][0] -= balanceMap[user][1];
        }

        for (const user in balanceMap) {
            if (balanceMap[user][0] != undefined) {
                balance.push({ user, amount: parseFloat(balanceMap[user][0].toFixed(2)) });
            }
        }
    }

    if(balance.length == 0){
        balance == previousBalance;
    }

    return balance;
  }