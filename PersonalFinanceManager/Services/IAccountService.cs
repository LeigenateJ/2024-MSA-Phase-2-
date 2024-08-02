using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Services
{
    public interface IAccountService
    {
        Task<IEnumerable<AccountDto>> GetAccountsAsync();
        Task<AccountDto> GetAccountByIdAsync(Guid id);
        Task<AccountDto> CreateAccountAsync(AccountDto accountDto);
        Task<bool> UpdateAccountAsync(Guid id, AccountDto accountDto);
        Task<bool> DeleteAccountAsync(Guid id);
    }
}
