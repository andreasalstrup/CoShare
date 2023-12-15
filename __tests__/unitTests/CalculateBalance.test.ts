import { calculateBalance } from '../../helpers/calculateBalance';
import { Expense } from '../../helpers/calculateExpenses';

describe('calculateBalance', () => {
    it('should handle no balances', () => {
        const result = calculateBalance([], [], []);
        expect(result).toEqual([]);
    });

    it('should handle a single user balance', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 50, JSON.stringify(['Alice'])),
            new Expense('Bob', 0, JSON.stringify(['Bob'])),
        ];
        const expectedBalance: { user: string, amount: number }[] = [
            { user: 'Alice', amount: 0 },
            { user: 'Bob', amount: 0 },
        ];
        const result = calculateBalance(expenses, ['Alice', 'Bob'], []);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });
    
    it('should handle multiple user balances', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 50, JSON.stringify(['Alice', 'Bob'])),
            new Expense('Bob', 0, JSON.stringify(['Bob'])),
        ];
        const expectedBalance: { user: string, amount: number }[] = [
            { user: 'Alice', amount: 25 },
            { user: 'Bob', amount: -25 },
        ];
        const result = calculateBalance(expenses, ['Alice', 'Bob'], []);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should handle multiple users with no balance', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 0, JSON.stringify(['Alice'])),
            new Expense('Bob', 0, JSON.stringify(['Bob'])),
            new Expense('Charlie', 0, JSON.stringify(['Charlie'])),
        ];
        const expectedBalance: { user: string, amount: number}[] = [
            { user: 'Alice', amount: 0 },
            { user: 'Bob', amount: 0 },
            { user: 'Charlie', amount: 0 },
        ];
        const result = calculateBalance(expenses, ['Alice', 'Bob', 'Charlie'], []);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should handle multiple users with one user who is not part of an expense', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 50, JSON.stringify(['Alice', 'Charlie'])),
            new Expense('Bob', 0, JSON.stringify(['Bob'])),
            new Expense('Charlie', 0, JSON.stringify(['Charlie'])),
        ];
        const expectedBalance: { user: string, amount: number}[] = [
            { user: 'Alice', amount: 25 },
            { user: 'Bob', amount: 0 },
            { user: 'Charlie', amount: -25 },
        ];
        const result = calculateBalance(expenses, ['Alice', 'Bob', 'Charlie'], []);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should return previous_balance if the new balance would be empty', () => {
        const expenses: Expense[] = [
            new Expense('Alice', 30, JSON.stringify(['Alice', 'Bob', 'Charlie'])),
            new Expense('Bob', 0, JSON.stringify(['Bob'])),
            new Expense('Charlie', 0, JSON.stringify(['Charlie'])),
        ];
        const expectedBalance: { user: string, amount: number}[] = [
            { user: 'Alice', amount: 20 },
            { user: 'Bob', amount: -10 },
            { user: 'Charlie', amount: -10 },
        ];
        const result = calculateBalance([], [], calculateBalance(expenses, ['Alice', 'Bob', 'Charlie'], []));
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });

    it('should handle large numbers', () => {
        const expenses: Expense[] = [
            new Expense('Alice', Number.MAX_VALUE, JSON.stringify(['Alice', 'Bob'])),
            new Expense('Bob', 0, JSON.stringify(['Bob'])),
        ];
        const expectedBalance: { user: string, amount: number}[] = [
            { user: 'Alice', amount: Number.MAX_VALUE/2 },
            { user: 'Bob', amount: -Number.MAX_VALUE/2 },
        ];
        const result = calculateBalance(expenses, ['Alice', 'Bob'], []);
        expect(result).toEqual(expect.arrayContaining(expectedBalance));
    });
});