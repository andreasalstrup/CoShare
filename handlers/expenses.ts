import { Expense, Transaction } from "../helpers/calculateExpenses";
interface IExpenses {
    getExpenses(callback: (expenses: Expense[]) => void): void;
    settleExpenses(transaction: Transaction): void;
    getGroupMembers(callback: (users: string) => void): void
}

class ExpensesHandle implements IExpenses{
    readonly gun: Gun;

    groupId: string = '';

    constructor(gun: Gun) {
        this.gun = gun;
        this.gun.user(userPub).get("group").get("groupId").on((data: string) => {
            this.groupId = data
        })
    }

    public getExpenses(callback: (expenses: Expense[]) => void): void{
        this.gun.get('groups').get('groupId').get(this.groupId).get('expenses').open((expenseData : any) =>{
            let expensesData: Expense[] = [];
            for (const key in expenseData){                
                if (this.isValidExpenseData(expenseData[key])){
                    let currentExpense = new Expense(expenseData[key].user, expenseData[key].amount, expenseData[key].users, expenseData[key].timestamp, expenseData[key].id);            
                    expensesData.push(currentExpense);
                }
            }
            callback(expensesData)
        })
    }

    public settleExpenses(transaction: Transaction): void {
        this.settle(transaction.from, [transaction.from, transaction.to], false, transaction.amount);
        this.settle(transaction.to, [transaction.from, transaction.to], true, transaction.amount);
    }

    public getGroupMembers(callback: (user: string) => void): void{
        this.gun.get('groups').get('groupId').get(this.groupId).get('members').open((data: any) => {
            for (const key in data)
            {
                if(data[key].members != undefined)
                {
                    this.gun.user(data[key].members).get('fullName').once((name: string) => {
                        if (name != null)
                        {
                            callback(name)
                        }
                    })
                }
            }
        });
    }

    private settle(user: string, users: string[], isReceiver: boolean, amount: number): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('expenses').set(new Expense(user, isReceiver? -amount : amount, JSON.stringify(users)));
    }

    private isValidExpenseData(expense: Expense): boolean{
        return expense.id != undefined &&
        expense.user != undefined &&
        expense.amount != undefined;
    }
}

export function expensesHandle(gun: Gun): IExpenses{
    return new ExpensesHandle(gun);
}