import { Expense, Transaction } from "../helpers/calculateExpenses";
interface IExpenses {
    getExpenses(groupId: string, callback: (expenses: Expense[]) => void): void;
    settleExpenses(groupId: string, transaction: Transaction): void;
}

class ExpensesHandle implements IExpenses{

    constructor(private gun: Gun) {
    }

    public getExpenses(groupId: string, callback: (expenses: Expense[]) => void): void{
        let expenses: Expense[] = [];
        let currentExpense: Expense = {user: '', amount: 0};
        gun.get('groups').get(groupId).get('expenses').open((data: any) =>{
            for(const key in data){
                if(this.isValidExpenseData(data[key])) {
                    currentExpense = {user: data[key].user, amount: data[key].amount};
                    expenses.push(currentExpense);
                }
            }
            callback(expenses);
        });
    }

    public settleExpenses(groupId: string, transaction: Transaction): void {
        this.settle(groupId, transaction.from, false, transaction.amount);
        this.settle(groupId, transaction.to, true, transaction.amount);
    }

    private settle(groupId: string, user: string, isReceiver: boolean, amount: number): void {
        gun.get('groups').get(groupId).get('expenses').set({user: user, amount: isReceiver ? -amount : amount});
    }

    private isValidExpenseData(expense: Expense): Boolean {
        return expense.amount != undefined &&
        expense.user != undefined;
    }

}

export function expensesHandle(gun: Gun): IExpenses{
    return new ExpensesHandle(gun);
}