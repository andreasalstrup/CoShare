import { calculateBalance } from '../../helpers/calculateBalance';
import { calculateExpenses, Expense, Transaction } from '../../helpers/calculateExpenses';

describe('calculateExpenses', () => {
    it('should handle no expenses', () => {
        const result = calculateExpenses([]);
        expect(result).toEqual([]);
    });

    it('should handle a single expense', () => {
        const expenses = [{ user: 'Alice', amount: 50 }];
        const result = calculateExpenses(expenses);
        expect(result).toEqual([]);
    });
    
    it('should correctly calculate the transaction between 2 people', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 100, JSON.stringify(['Alice', 'Bob'])),
            new Expense('Bob', 0, JSON.stringify(['Alice', 'Bob'])),
            new Expense('Charlie', 0, JSON.stringify(['Charlie']))
        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 50 },
        ];
        const result = calculateExpenses(calculateBalance(expenses, ['Alice', 'Bob', 'Charlie'], []));
        expect(result).toEqual(expect.arrayContaining(expectedTransactions));
    });

    it('should correctly calculate the transaction between more than 2 people', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 90, JSON.stringify(['Alice', 'Bob', 'Charlie'])),
            new Expense('Bob', 45, JSON.stringify(['Alice', 'Bob', 'Charlie'])),
            new Expense('Charlie', 30, JSON.stringify(['Alice', 'Bob', 'Charlie'])),
        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 10 },
            { from: 'Charlie', to: 'Alice', amount: 25 },
        ];
        const result = calculateExpenses(calculateBalance(expenses, ['Alice', 'Bob', 'Charlie'], []));
        expect(result).toEqual(expect.arrayContaining(expectedTransactions));
    });

    it('should correctly calculate transactions when decimals are involved', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 49.95, JSON.stringify(['Alice', 'Bob'])),
            new Expense('Bob', 0, JSON.stringify(['Alice', 'Bob'])),
        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 24.98 },
        ];
        const result = calculateExpenses(calculateBalance(expenses, ['Alice', 'Bob'], []));
        expect(result).toEqual(expect.arrayContaining(expectedTransactions));
    });

    it('should handle rounded numbers with 2 decimals', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 100, JSON.stringify(['Alice', 'Bob', 'Charlie'])),
            new Expense('Bob', 0, JSON.stringify(['Alice', 'Bob', 'Charlie'])),
            new Expense('Charlie', 0, JSON.stringify(['Alice', 'Bob', 'Charlie'])),

        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 100/3 }, //33.33 repeating of course
            { from: 'Charlie', to: 'Alice', amount: 100/3 },
        ];
        const result = calculateExpenses(expenses);
        result.forEach((transaction, i) => expect(transaction.amount).toBeCloseTo(expectedTransactions[i].amount, 2));
    });
});