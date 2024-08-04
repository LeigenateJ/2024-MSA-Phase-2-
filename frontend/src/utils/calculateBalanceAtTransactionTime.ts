export const calculateBalanceAtTransactionTime = (accountId: string, transactionId: string, transactions: any[], accounts: any[]) => {

    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return 0; 
  
    let balance = account.balance;
  
    // sort
    const relevantTransactions = transactions
      .filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => {
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        return dateComparison !== 0 ? dateComparison : a.id.localeCompare(b.id);
      });
  
    for (const transaction of relevantTransactions) {
      balance += transaction.type === 'Income' ? transaction.amount : -transaction.amount;
      if (transaction.id === transactionId) break;
    }
  
    return balance;
  };
  