using PersonalFinanceManager.Dtos;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PersonalFinanceManager.Data;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceManager.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IRepository<Transaction> _transactionRepository;
        private readonly IRepository<Account> _accountRepository;
        private readonly IMapper _mapper;

        public TransactionService(IRepository<Transaction> transactionRepository, IRepository<Account> accountRepository, IMapper mapper)
        {
            _transactionRepository = transactionRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TransactionDto>> GetTransactionsByAccountIdAsync(Guid accountId)
        {
            var transactions = await _transactionRepository.GetAllAsync();
            var accountTransactions = transactions.Where(t => t.AccountId == accountId);
            return _mapper.Map<IEnumerable<TransactionDto>>(accountTransactions);
        }

        public async Task<TransactionDto> GetTransactionByIdAsync(Guid transactionId)
        {
            var transaction = await _transactionRepository.GetByIdAsync(transactionId);
            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<IEnumerable<TransactionDto>> GetTransactionsByUserIdAsync(Guid userId)
        {
            var accounts = await _accountRepository.GetAllAsync()
                                                   .Result
                                                   .Where(a => a.UserId == userId)
                                                   .ToListAsync();

            var accountIds = accounts.Select(a => a.Id).ToList();

            var transactions = await _transactionRepository.GetAllAsync()
                                                           .Result
                                                           .Where(t => accountIds.Contains(t.AccountId))
                                                           .ToListAsync();

            return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
        }


        public async Task<TransactionDto> AddTransactionAsync(TransactionDto transactionDto)
        {
            var transaction = _mapper.Map<Transaction>(transactionDto);
            await _transactionRepository.AddAsync(transaction);

            var account = await _accountRepository.GetByIdAsync(transaction.AccountId);
            if (transaction.Type == "Expense")
            {
                account.Balance -= transaction.Amount;
            }
            else if (transaction.Type == "Income")
            {
                account.Balance += transaction.Amount;
            }

            await _accountRepository.UpdateAsync(account);
            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<bool> UpdateTransactionAsync(Guid transactionId, TransactionDto transactionDto)
        {
            var transaction = await _transactionRepository.GetByIdAsync(transactionId);
            if (transaction == null)
            {
                throw new Exception("Transaction not found");
            }

            var account = await _accountRepository.GetByIdAsync(transaction.AccountId);
            if (account == null)
            {
                throw new Exception("Account not found");
            }

            // calculate previous transaction effect
            if (transaction.Type == "Expense")
            {
                account.Balance += transaction.Amount;
            }
            else if (transaction.Type == "Income")
            {
                account.Balance -= transaction.Amount;
            }

            // update transaction
            transaction.Amount = transactionDto.Amount;
            transaction.Type = transactionDto.Type;
            transaction.Category = transactionDto.Category;
            transaction.Description = transactionDto.Description;
            transaction.Date = transactionDto.Date;

            // calculate new transaction effect
            if (transaction.Type == "Expense")
            {
                account.Balance -= transaction.Amount;
            }
            else if (transaction.Type == "Income")
            {
                account.Balance += transaction.Amount;
            }

            await _transactionRepository.UpdateAsync(transaction);
            await _accountRepository.UpdateAsync(account);
            return true;
        }

        public async Task<bool> DeleteTransactionAsync(Guid transactionId)
        {
            var transaction = await _transactionRepository.GetByIdAsync(transactionId);
            if (transaction == null)
            {
                throw new Exception("Transaction not found");
            }

            var account = await _accountRepository.GetByIdAsync(transaction.AccountId);
            if (transaction.Type == "Expense")
            {
                account.Balance += transaction.Amount;
            }
            else if (transaction.Type == "Income")
            {
                account.Balance -= transaction.Amount;
            }

            await _transactionRepository.DeleteAsync(transactionId);
            await _accountRepository.UpdateAsync(account);
            return true;
        }
    }
}
