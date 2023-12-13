import { Expense, Transaction } from "../helpers/calculateExpenses";
interface IExpenses {
    getExpenses(groupId: string, callback: (expenses: Expense[]) => void): void;
    settleExpenses(groupId: string, transaction: Transaction): void;
    getGroupMembers(groupId: string, callback: (users: string[]) => void): void
}

class ExpensesHandle implements IExpenses{

    constructor(private gun: Gun) {
    }

    public getExpenses(groupId: string, callback: (expenses: Expense[]) => void): void{
        
        gun.get('groups').get('groupId').get(groupId).get('expenses').open((expenseData : any) =>{
            let expensesData: Expense[] = [];
            for (const key in expenseData){                
                if (this.isValidExpenseData(expenseData[key])){
                    let currentExpense = new Expense(expenseData[key].user, (expenseData[key].amount), expenseData[key].timestamp, expenseData[key].id);            
                    expensesData.push(currentExpense);
                }   
            }      
            callback(expensesData)
        })
    }

    public settleExpenses(groupId: string, transaction: Transaction): void {
        this.settle(groupId, transaction.from, [transaction.from, transaction.to], false, transaction.amount);
        this.settle(groupId, transaction.to, [transaction.from, transaction.to], true, transaction.amount);
    }

    public getGroupMembers(groupId: string, callback: (users: string[]) => void): void{
        let users: string[] = [];
        gun.get('groups').get('groupId').get(groupId).get('members').open((data: any) => {
            for (const key in data)
            {
                if(data[key].members != undefined)
                {
                    gun.user(data[key].members).get('fullName').open((name: string) => {
                        users.push(name);
                    })
                }
            }
            callback(users)
        });
    }

    private settle(groupId: string, user: string, users: string[], isReceiver: boolean, amount: number): void {
        gun.get('groups').get('groupId').get(groupId).get('expenses').set(new Expense(user, isReceiver? -amount : amount, JSON.stringify(users)));
    }

    private isValidExpenseData(expense: Expense): boolean{
        return expense.id != undefined &&
        expense.timestamp != undefined &&
        expense.user != undefined &&
        expense.amount != undefined;
    }

}

export function expensesHandle(gun: Gun): IExpenses{
    return new ExpensesHandle(gun);
}