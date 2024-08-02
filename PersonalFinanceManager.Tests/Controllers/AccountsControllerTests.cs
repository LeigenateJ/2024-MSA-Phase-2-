using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalFinanceManager.Controllers;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Models;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Tests.Controllers
{
    public class AccountsControllerTests
    {
        private readonly Mock<IAccountService> _accountServiceMock;
        private readonly AccountsController _controller;

        public AccountsControllerTests()
        {
            _accountServiceMock = new Mock<IAccountService>();
            _controller = new AccountsController(_accountServiceMock.Object);
        }

        [Fact]
        public async Task GetAccounts_ReturnsOkResult_WithListOfAccounts()
        {
            // Arrange
            var accounts = new List<AccountDto>
            {
                new AccountDto { Id = Guid.NewGuid(), Name = "Test Account", Type = "Checking", Balance = 1000 }
            };
            _accountServiceMock.Setup(s => s.GetAccountsAsync()).ReturnsAsync(accounts);

            // Act
            var result = await _controller.GetAccounts();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<AccountDto>>(okResult.Value);
            Assert.Equal(accounts.Count, returnValue.Count);
        }

        [Fact]
        public async Task GetAccount_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var accountId = Guid.NewGuid();
            _accountServiceMock.Setup(s => s.GetAccountByIdAsync(accountId)).ReturnsAsync((AccountDto)null);

            // Act
            var result = await _controller.GetAccount(accountId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateAccount_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var accountDto = new AccountDto { Name = "Test Account", Type = "Savings", Balance = 1000 };
            var createdAccount = new AccountDto { Id = Guid.NewGuid(), Name = "Test Account", Type = "Savings", Balance = 1000 };
            _accountServiceMock.Setup(s => s.CreateAccountAsync(accountDto)).ReturnsAsync(createdAccount);

            // Act
            var result = await _controller.CreateAccount(accountDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<AccountDto>(createdAtActionResult.Value);
            Assert.Equal(createdAccount.Id, returnValue.Id);
        }

        [Fact]
        public async Task DeleteAccount_ReturnsNoContent_WhenDeletionIsSuccessful()
        {
            // Arrange
            var accountId = Guid.NewGuid();
            _accountServiceMock.Setup(s => s.DeleteAccountAsync(accountId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteAccount(accountId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
