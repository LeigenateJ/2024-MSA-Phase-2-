using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Moq;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Repositories;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Dtos;
using AutoMapper;
using PersonalFinanceManager.Data;

public class TransactionServiceTests
{
    private readonly Mock<IRepository<Transaction>> _transactionRepositoryMock;
    private readonly Mock<IRepository<Account>> _accountRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly TransactionService _transactionService;

    public TransactionServiceTests()
    {
        _transactionRepositoryMock = new Mock<IRepository<Transaction>>();
        _accountRepositoryMock = new Mock<IRepository<Account>>();
        _mapperMock = new Mock<IMapper>();
        _transactionService = new TransactionService(_transactionRepositoryMock.Object, _accountRepositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetTransactionsByAccountIdAsync_ShouldReturnTransactions_WhenTransactionsExist()
    {
        // Arrange
        var accountId = Guid.NewGuid();
        var transactions = new List<Transaction>
        {
            new Transaction { AccountId = accountId, Amount = 100 },
            new Transaction { AccountId = accountId, Amount = 200 }
        };
        _transactionRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(transactions.AsQueryable());

        var transactionDtos = new List<TransactionDto>
        {
            new TransactionDto { Amount = 100 },
            new TransactionDto { Amount = 200 }
        };
        _mapperMock.Setup(m => m.Map<IEnumerable<TransactionDto>>(transactions)).Returns(transactionDtos);

        // Act
        var result = await _transactionService.GetTransactionsByAccountIdAsync(accountId);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task AddTransactionAsync_ShouldReturnTransactionDto_WhenTransactionIsAdded()
    {
        // Arrange
        var accountId = Guid.NewGuid();
        var transactionDto = new TransactionDto
        {
            AccountId = accountId,
            Amount = 100,
            Type = "Income",
            Date = DateTime.UtcNow
        };
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            AccountId = transactionDto.AccountId,
            Amount = transactionDto.Amount,
            Type = transactionDto.Type,
            Date = transactionDto.Date
        };
        var account = new Account { Id = transactionDto.AccountId, Balance = 0 };

        _mapperMock.Setup(m => m.Map<Transaction>(transactionDto)).Returns(transaction);
        _transactionRepositoryMock.Setup(repo => repo.AddAsync(transaction)).Returns(Task.CompletedTask);
        _accountRepositoryMock.Setup(repo => repo.GetByIdAsync(transactionDto.AccountId)).ReturnsAsync(account);
        _accountRepositoryMock.Setup(repo => repo.UpdateAsync(account)).Returns(Task.CompletedTask);
        _mapperMock.Setup(m => m.Map<TransactionDto>(transaction)).Returns(transactionDto);

        // Act
        var result = await _transactionService.AddTransactionAsync(transactionDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(transactionDto.Amount, result.Amount);
        _accountRepositoryMock.Verify(a => a.UpdateAsync(It.IsAny<Account>()), Times.Once);
        _transactionRepositoryMock.Verify(t => t.AddAsync(transaction), Times.Once);
        _mapperMock.Verify(m => m.Map<TransactionDto>(transaction), Times.Once);
    }


    [Fact]
    public async Task UpdateTransactionAsync_ShouldReturnTrue_WhenTransactionIsUpdated()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        var transactionDto = new TransactionDto
        {
            AccountId = Guid.NewGuid(),
            Amount = 200,
            Type = "Expense",
            Date = DateTime.UtcNow
        };
        var transaction = new Transaction
        {
            Id = transactionId,
            AccountId = transactionDto.AccountId,
            Amount = 100,
            Type = "Income",
            Date = DateTime.UtcNow
        };
        var account = new Account { Id = transactionDto.AccountId, Balance = 100 };

        _transactionRepositoryMock.Setup(repo => repo.GetByIdAsync(transactionId)).ReturnsAsync(transaction);
        _accountRepositoryMock.Setup(repo => repo.GetByIdAsync(transactionDto.AccountId)).ReturnsAsync(account);
        _transactionRepositoryMock.Setup(repo => repo.UpdateAsync(transaction)).Returns(Task.CompletedTask);
        _accountRepositoryMock.Setup(repo => repo.UpdateAsync(account)).Returns(Task.CompletedTask);

        // Act
        var result = await _transactionService.UpdateTransactionAsync(transactionId, transactionDto);

        // Assert
        Assert.True(result);
        _accountRepositoryMock.Verify(a => a.UpdateAsync(It.IsAny<Account>()), Times.Once);
    }

    [Fact]
    public async Task DeleteTransactionAsync_ShouldReturnTrue_WhenTransactionIsDeleted()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        var transaction = new Transaction
        {
            Id = transactionId,
            AccountId = Guid.NewGuid(),
            Amount = 100,
            Type = "Expense",
            Date = DateTime.UtcNow
        };
        var account = new Account { Id = transaction.AccountId, Balance = 100 };

        _transactionRepositoryMock.Setup(repo => repo.GetByIdAsync(transactionId)).ReturnsAsync(transaction);
        _accountRepositoryMock.Setup(repo => repo.GetByIdAsync(transaction.AccountId)).ReturnsAsync(account);
        _transactionRepositoryMock.Setup(repo => repo.DeleteAsync(transactionId)).Returns(Task.CompletedTask);
        _accountRepositoryMock.Setup(repo => repo.UpdateAsync(account)).Returns(Task.CompletedTask);

        // Act
        var result = await _transactionService.DeleteTransactionAsync(transactionId);

        // Assert
        Assert.True(result);
        _accountRepositoryMock.Verify(a => a.UpdateAsync(It.IsAny<Account>()), Times.Once);
    }
}
