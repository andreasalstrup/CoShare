import {randomUUID} from 'expo-crypto';

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
        this.id = parseInt(randomUUID());
      }
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

export const calculateExpenses = (balance: { user: string; amount: number }[]): Transaction[] => {
  const transactions: Transaction[] = [];

  // Separate positive and negative balances
  const positiveBalances = balance.filter((entry) => entry.amount > 0);
  const negativeBalances = balance.filter((entry) => entry.amount < 0);

  // Iterate through positive balances
  for (const positiveEntry of positiveBalances) {
    let remainingAmount = positiveEntry.amount;

    // Find corresponding negative balances
    for (const negativeEntry of negativeBalances) {
      if (remainingAmount > 0) {
        const transferAmount = Math.min(remainingAmount, -negativeEntry.amount);

        // Create a transaction
        transactions.push({
          from: negativeEntry.user,
          to: positiveEntry.user,
          amount: transferAmount,
        });

        remainingAmount -= transferAmount;
      } else {
        break;
      }
    }
  }

  return transactions;
};