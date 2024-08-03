using PersonalFinanceManager.Dtos;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PersonalFinanceManager.Data;

namespace PersonalFinanceManager.Services
{
    public class AccountService : IAccountService
    {
        private readonly IRepository<Account> _accountRepository;
        private readonly IMapper _mapper;

        public AccountService(IRepository<Account> accountRepository, IMapper mapper)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AccountDto>> GetAccountsByUserIdAsync(Guid userId)
        {
            var accounts = await _accountRepository.GetAllAsync();
            var userAccounts = accounts.Where(a => a.UserId == userId);
            return _mapper.Map<IEnumerable<AccountDto>>(userAccounts);
        }

        public async Task<AccountDto> GetAccountByIdAsync(Guid accountId)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            return _mapper.Map<AccountDto>(account);
        }

        public async Task<AccountDto> CreateAccountAsync(AccountDto accountDto)
        {
            var account = _mapper.Map<Account>(accountDto);
            await _accountRepository.AddAsync(account);
            return _mapper.Map<AccountDto>(account);
        }

        public async Task<bool> UpdateAccountAsync(Guid id, AccountDto accountDto)
        {
            var account = await _accountRepository.GetByIdAsync(id);
            if (account == null)
            {
                return false;
            }

            _mapper.Map(accountDto, account);
            await _accountRepository.UpdateAsync(account);
            return true;
        }

        public async Task<bool> DeleteAccountAsync(Guid id)
        {
            var account = await _accountRepository.GetByIdAsync(id);
            if (account == null)
            {
                return false;
            }

            await _accountRepository.DeleteAsync(id);
            return true;
        }
    }
}
