export class Expense {
    readonly id: number;
    readonly timestamp: number;
    public user: string;
    public amount: number;
    public users: string;
  
    public constructor(user: string, amount: number, users: string, timestamp?: number, id?: number) {
      this.user = user;
      this.amount = amount;
      this.users = users;

      if (timestamp != undefined) {
        this.timestamp = timestamp;
      } else {
        this.timestamp = Date.now();
      }

      if (id != undefined) {
        this.id = id;
      } else {
        this.id = this.generateUniqueId();
      }
    }
  
    private generateUniqueId(): number {
      return parseInt(`${this.timestamp}${Math.floor(Math.random() * 1000)}`);
    }
  
    public equals(cmp: Expense): boolean {
      return cmp.id === this.id;
    }
}

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