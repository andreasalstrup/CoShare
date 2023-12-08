import { Expense, Transaction } from "../helpers/calculateExpenses";
interface IExpenses {
    getExpenses(groupId: string): Expense[];
    settleExpenses(groupId: string, transaction: Transaction): void;
}

class ExpensesHandle implements IExpenses{

    constructor(private gun: Gun) {
    }

    public getExpenses(groupId: string): Expense[]{
        let expenses: Expense[] = [];
        let currentExpense: Expense = {user: '', amount: 0};
        gun.get('groups').get('1').get('expenses').map().on(function(expenseData){
            currentExpense = {user: (expenseData.user).toString(), amount: parseFloat(expenseData.amount)};
            expenses.push(currentExpense);
        });
        return expenses;
    }

    public settleExpenses(groupId: string, transaction: Transaction): void {
        this.settle(groupId, transaction.from, false, transaction.amount);
        this.settle(groupId, transaction.to, true, transaction.amount);
    }

    private settle(groupId: string, user: string, isReceiver: boolean, amount: number): void {
        gun.get('groups').get(groupId).get('expenses').set({user: user, amount: isReceiver ? -amount : amount});
    }
}

export function expensesHandle(gun: Gun): IExpenses{
    return new ExpensesHandle(gun);
}