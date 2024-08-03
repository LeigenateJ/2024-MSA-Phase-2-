export const mockAccounts = [
    { id: '1', name: 'Checking Account', type: 'Checking', balance: 1500, userId: 'user1' },
    { id: '2', name: 'Savings Account', type: 'Savings', balance: 3000, userId: 'user1' },
    { id: '3', name: 'Credit Card', type: 'Credit', balance: -500, userId: 'user1' },
  ];
  
  export const mockTransactions = [
    { id: '1', accountId: '1', amount: -50, type: 'Expense', category: 'Grocery', date: new Date('2024-07-01'), description: 'Grocery shopping' },
    { id: '2', accountId: '1', amount: -100, type: 'Expense', category: 'Restaurant', date: new Date('2024-07-02'), description: 'Dinner at restaurant' },
    { id: '3', accountId: '2', amount: 500, type: 'Income', category: 'Salary', date: new Date('2024-07-03'), description: 'Monthly salary' },
    { id: '4', accountId: '1', amount: -30, type: 'Expense', category: 'Transport', date: new Date('2024-07-04'), description: 'Bus fare' },
    { id: '5', accountId: '2', amount: 200, type: 'Income', category: 'Investment', date: new Date('2024-07-05'), description: 'Investment return' },
    { id: '6', accountId: '1', amount: -75, type: 'Expense', category: 'Utilities', date: new Date('2024-07-06'), description: 'Electricity bill' },
    { id: '7', accountId: '3', amount: -150, type: 'Expense', category: 'Shopping', date: new Date('2024-07-07'), description: 'Online shopping' },
    { id: '8', accountId: '2', amount: 1000, type: 'Income', category: 'Bonus', date: new Date('2024-07-08'), description: 'Yearly bonus' },
    { id: '9', accountId: '1', amount: -25, type: 'Expense', category: 'Entertainment', date: new Date('2024-07-09'), description: 'Movie ticket' },
    { id: '10', accountId: '3', amount: -200, type: 'Expense', category: 'Travel', date: new Date('2024-07-10'), description: 'Flight booking' },
  ];
  