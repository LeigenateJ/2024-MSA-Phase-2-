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
    public class TransactionService : ITransactionService
    {
        private readonly IRepository<Transaction> _transactionRepository;
        private readonly IMapper _mapper;

        public TransactionService(IRepository<Transaction> transactionRepository, IMapper mapper)
        {
            _transactionRepository = transactionRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TransactionDto>> GetTransactionsAsync()
        {
            var transactions = await _transactionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
        }

        public async Task<TransactionDto> GetTransactionByIdAsync(Guid id)
        {
            var transaction = await _transactionRepository.GetByIdAsync(id);
            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<TransactionDto> CreateTransactionAsync(TransactionDto transactionDto)
        {
            var transaction = _mapper.Map<Transaction>(transactionDto);
            await _transactionRepository.AddAsync(transaction);
            return _mapper.Map<TransactionDto>(transaction);
        }

        public async Task<bool> UpdateTransactionAsync(Guid id, TransactionDto transactionDto)
        {
            var transaction = await _transactionRepository.GetByIdAsync(id);
            if (transaction == null)
            {
                return false;
            }

            _mapper.Map(transactionDto, transaction);
            await _transactionRepository.UpdateAsync(transaction);
            return true;
        }

        public async Task<bool> DeleteTransactionAsync(Guid id)
        {
            var transaction = await _transactionRepository.GetByIdAsync(id);
            if (transaction == null)
            {
                return false;
            }

            await _transactionRepository.DeleteAsync(id);
            return true;
        }
    }
}
