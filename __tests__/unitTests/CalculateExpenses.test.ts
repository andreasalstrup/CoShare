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
            { user: 'Alice', amount: 100 },
            { user: 'Bob', amount: 0 },
        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 50 },
        ];
        const result = calculateExpenses(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedTransactions));
    });

    it('should correctly calculate the transaction between more than 2 people', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 90 },
            { user: 'Bob', amount: 45 },
            { user: 'Charlie', amount: 30 },
        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 10 },
            { from: 'Charlie', to: 'Alice', amount: 25 },
        ];
        const result = calculateExpenses(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedTransactions));
    });

    it('should correctly calculate transactions when decimals are involved', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 49.95 },
            { user: 'Bob', amount: 0 },
        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 24.975 },
        ];
        const result = calculateExpenses(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedTransactions));
    });

    it('should handle rounded numbers with 2 decimals', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 100 },
            { user: 'Bob', amount: 0 },
            { user: 'Charlie', amount: 0 },

        ];
        const expectedTransactions: Transaction[] = [
            { from: 'Bob', to: 'Alice', amount: 100/3 }, //33.33 repeating of course
            { from: 'Charlie', to: 'Alice', amount: 100/3 },
        ];
        const result = calculateExpenses(expenses);
        result.forEach((transaction, i) => expect(transaction.amount).toBeCloseTo(expectedTransactions[i].amount, 2));
    });
});