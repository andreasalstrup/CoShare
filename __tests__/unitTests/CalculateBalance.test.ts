import { calculateBalance, Expense } from '../../helpers/calculateBalance';

describe('calculateExpenses', () => {
    it('should handle no balances', () => {
        const result = calculateBalance([]);
        expect(result).toEqual([]);
    });

    it('should handle a single user balance', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 50 },
        ];
        const expectedBalance: Expense[] = [
            { user: 'Alice', amount: 0 }
        ];
        const result = calculateBalance(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });
    
    it('should handle multiple user balances', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 50 },
            { user: 'Bob', amount: 0 },
        ];
        const expectedBalance: Expense[] = [
            { user: 'Alice', amount: 25 },
            { user: 'Bob', amount: -25 },
        ];
        const result = calculateBalance(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should handle multiple users with no balance', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 0 },
            { user: 'Bob', amount: 0 },
            { user: 'Charlie', amount: 0 },
        ];
        const expectedBalance: Expense[] = [
            { user: 'Alice', amount: 0 },
            { user: 'Bob', amount: 0 },
            { user: 'Charlie', amount: 0 },
        ];
        const result = calculateBalance(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should handle multiple user balances', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: 50 },
            { user: 'Bob', amount: 0 },
        ];
        const expectedBalance: Expense[] = [
            { user: 'Alice', amount: 25 },
            { user: 'Bob', amount: -25 },
        ];
        const result = calculateBalance(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should handle large numbers', () => {
        const expenses: Expense[] = [
            { user: 'Alice', amount: Number.MAX_VALUE },
            { user: 'Bob', amount: 0 },
        ];
        const expectedBalance: Expense[] = [
            { user: 'Alice', amount: Number.MAX_VALUE/2 },
            { user: 'Bob', amount: -Number.MAX_VALUE/2 },
        ];
        const result = calculateBalance(expenses);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });
});