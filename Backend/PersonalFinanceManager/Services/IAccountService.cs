using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Services
{
    public interface IAccountService
    {
        Task<IEnumerable<AccountDto>> GetAccountsByUserIdAsync(Guid userId);
        Task<AccountDto> GetAccountByIdAsync(Guid accountId);
        Task<AccountDto> CreateAccountAsync(AccountDto accountDto);
        Task<bool> UpdateAccountAsync(Guid id, AccountDto accountDto);
        Task<bool> DeleteAccountAsync(Guid id);
    }
}
