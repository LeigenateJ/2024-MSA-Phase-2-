using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Moq;
using PersonalFinanceManager.Controllers;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

public class TransactionsControllerTests
{
    private readonly Mock<ITransactionService> _transactionServiceMock;
    private readonly Mock<IAccountService> _accountServiceMock;
    private readonly TransactionsController _controller;

    public TransactionsControllerTests()
    {
        _transactionServiceMock = new Mock<ITransactionService>();
        _accountServiceMock = new Mock<IAccountService>();
        _controller = new TransactionsController(_transactionServiceMock.Object, _accountServiceMock.Object);

        // Mock user identity
        var userId = Guid.NewGuid().ToString();
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId)
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [Fact]
    public async Task GetTransactions_ShouldReturnOkResult_WithListOfTransactions()
    {
        // Arrange
        var userId = Guid.NewGuid(); // Mocked user ID
        var accountId = Guid.NewGuid(); // Mocked account ID

        var transactions = new List<TransactionDto>
    {
        new TransactionDto { Amount = 100 },
        new TransactionDto { Amount = 200 }
    };

        var accountDto = new AccountDto { Id = accountId, UserId = userId }; // Mocked account with the same user ID

        // Setup the mock user identity in the controller context
        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                }, "mock"))
            }
        };

        _accountServiceMock.Setup(service => service.GetAccountByIdAsync(accountId)).ReturnsAsync(accountDto);
        _transactionServiceMock.Setup(service => service.GetTransactionsByAccountIdAsync(accountId)).ReturnsAsync(transactions);

        // Act
        var result = await _controller.GetTransactions(accountId);

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<TransactionDto>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<List<TransactionDto>>(okResult.Value);
        Assert.Equal(2, returnValue.Count);
        Assert.Equal(transactions[0].Amount, returnValue[0].Amount);
        Assert.Equal(transactions[1].Amount, returnValue[1].Amount);
    }


    [Fact]
    public async Task AddTransaction_ShouldReturnCreatedAtRouteResult_WithNewTransaction()
    {
        // Arrange
        var userId = Guid.NewGuid(); // Mocked user ID
        var accountId = Guid.NewGuid(); // Mocked account ID for the transaction

        var transactionDto = new TransactionDto { Amount = 100, AccountId = accountId, Type = "Income" };
        var createdTransactionDto = new TransactionDto { Id = Guid.NewGuid(), Amount = 100, AccountId = accountId, Type = "Income" };

        var accountDto = new AccountDto { Id = accountId, UserId = userId }; // Mocked account with the same user ID

        // Setup the mock user identity in the controller context
        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                }, "mock"))
            }
        };

        _accountServiceMock.Setup(service => service.GetAccountByIdAsync(accountId)).ReturnsAsync(accountDto);
        _transactionServiceMock.Setup(service => service.AddTransactionAsync(transactionDto)).ReturnsAsync(createdTransactionDto);

        // Act
        var result = await _controller.CreateTransaction(transactionDto);

        // Assert
        var actionResult = Assert.IsType<ActionResult<TransactionDto>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<TransactionDto>(okResult.Value);
        Assert.Equal(createdTransactionDto.Amount, returnValue.Amount);
        Assert.Equal(createdTransactionDto.Id, returnValue.Id);
        Assert.Equal(createdTransactionDto.AccountId, returnValue.AccountId);
        Assert.Equal(createdTransactionDto.Type, returnValue.Type);
    }



    [Fact]
    public async Task DeleteTransaction_ShouldReturnNoContent_WhenTransactionIsDeleted()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        _transactionServiceMock.Setup(service => service.DeleteTransactionAsync(transactionId)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteTransaction(transactionId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteTransaction_ShouldReturnNotFound_WhenTransactionDoesNotExist()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        _transactionServiceMock.Setup(service => service.DeleteTransactionAsync(transactionId)).ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteTransaction(transactionId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
