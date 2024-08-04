using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Services
{
    public interface ITransactionService
    {
        Task<IEnumerable<TransactionDto>> GetTransactionsByAccountIdAsync(Guid accountId);
        Task<TransactionDto> GetTransactionByIdAsync(Guid transactionId);
        Task<TransactionDto> AddTransactionAsync(TransactionDto transactionDto);
        Task<bool> UpdateTransactionAsync(Guid id, TransactionDto transactionDto);
        Task<bool> DeleteTransactionAsync(Guid id);
        Task<IEnumerable<TransactionDto>> GetTransactionsByUserIdAsync(Guid userId);

    }
}
