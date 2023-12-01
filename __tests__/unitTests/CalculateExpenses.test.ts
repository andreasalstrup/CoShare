import { calculateExpenses } from '../../helpers/calculateExpenses';

type Expense = {
    user: string;
    amount: number;
};

type Transaction = {
    from: string;
    to: string;
    amount: number;
};

const testData: Expense[] = [
    { user: 'Test User1', amount: 100 },
    { user: 'Test User2', amount: 0 },
  ];
  
  const calculatedExpenses = calculateExpenses(testData);

test('Correct amount', () => {
    console.log(calculatedExpenses)
    //expect(calculatedExpenses).toBe;
});