using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Services
{
    public interface ITransactionService
    {
        Task<IEnumerable<TransactionDto>> GetTransactionsAsync();
        Task<TransactionDto> GetTransactionByIdAsync(Guid id);
        Task<TransactionDto> CreateTransactionAsync(TransactionDto transactionDto);
        Task<bool> UpdateTransactionAsync(Guid id, TransactionDto transactionDto);
        Task<bool> DeleteTransactionAsync(Guid id);
    }
}
