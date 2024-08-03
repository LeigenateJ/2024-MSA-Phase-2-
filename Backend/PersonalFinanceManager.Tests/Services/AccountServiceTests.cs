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

public class AccountServiceTests
{
    private readonly Mock<IRepository<Account>> _accountRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly AccountService _accountService;

    public AccountServiceTests()
    {
        _accountRepositoryMock = new Mock<IRepository<Account>>();
        _mapperMock = new Mock<IMapper>();
        _accountService = new AccountService(_accountRepositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetAccountsByUserIdAsync_ShouldReturnAccounts_WhenAccountsExist()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var accounts = new List<Account>
        {
            new Account { UserId = userId, Name = "Account1" },
            new Account { UserId = userId, Name = "Account2" }
        };
        _accountRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(accounts.AsQueryable());

        var accountDtos = new List<AccountDto>
        {
            new AccountDto { Name = "Account1" },
            new AccountDto { Name = "Account2" }
        };
        _mapperMock.Setup(m => m.Map<IEnumerable<AccountDto>>(accounts)).Returns(accountDtos);

        // Act
        var result = await _accountService.GetAccountsByUserIdAsync(userId);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetAccountByIdAsync_ShouldReturnAccount_WhenAccountExists()
    {
        // Arrange
        var accountId = Guid.NewGuid();
        var account = new Account { Id = accountId, Name = "Account1" };
        _accountRepositoryMock.Setup(repo => repo.GetByIdAsync(accountId)).ReturnsAsync(account);

        var accountDto = new AccountDto { Name = "Account1" };
        _mapperMock.Setup(m => m.Map<AccountDto>(account)).Returns(accountDto);

        // Act
        var result = await _accountService.GetAccountByIdAsync(accountId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(accountDto.Name, result.Name);
    }

    [Fact]
    public async Task UpdateAccountAsync_ShouldReturnTrue_WhenAccountIsUpdated()
    {
        // Arrange
        var accountId = Guid.NewGuid();
        var accountDto = new AccountDto { Id = accountId, Name = "UpdatedAccount" };
        var existingAccount = new Account { Id = accountId, Name = "OldAccount" };

        // Mock the GetByIdAsync method to return an existing account
        _accountRepositoryMock.Setup(repo => repo.GetByIdAsync(accountId)).ReturnsAsync(existingAccount);

        // Mock the UpdateAsync method to simulate successful update
        _accountRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Account>())).Returns(Task.CompletedTask);

        // Mock the mapping operation
        _mapperMock.Setup(m => m.Map(accountDto, existingAccount)).Returns(existingAccount);

        // Act
        var result = await _accountService.UpdateAccountAsync(accountId, accountDto);

        // Assert
        Assert.True(result);
        _accountRepositoryMock.Verify(repo => repo.UpdateAsync(existingAccount), Times.Once);
        _mapperMock.Verify(m => m.Map(accountDto, existingAccount), Times.Once);
    }

}
