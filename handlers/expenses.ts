import { Expense, Transaction } from "../helpers/calculateExpenses";
interface IExpenses {
    getExpenses(groupId: string, callback: (expenses: Expense[]) => void): void;
    settleExpenses(groupId: string, transaction: Transaction): void;
}

class ExpensesHandle implements IExpenses{

    constructor(private gun: Gun) {
    }

    public getExpenses(groupId: string, callback: (expenses: Expense[]) => void): void{
        
        gun.get('groups').get(groupId).get('expenses').open((expenseData : any) =>{
            let expenses: Expense[] = [];
            for (const key in expenseData){                
                if (!(expenseData[key].user == undefined || expenseData[key].amount == undefined)){
                    let currentExpense = new Expense(expenseData[key].user, (expenseData[key].amount));            
                    expenses.push(currentExpense);
                }   
            }      
            callback(expenses)
        })
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