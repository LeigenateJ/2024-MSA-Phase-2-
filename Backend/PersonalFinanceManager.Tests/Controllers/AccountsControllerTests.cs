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

public class AccountsControllerTests
{
    private readonly Mock<IAccountService> _accountServiceMock;
    private readonly AccountsController _controller;

    public AccountsControllerTests()
    {
        _accountServiceMock = new Mock<IAccountService>();
        _controller = new AccountsController(_accountServiceMock.Object);

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
    public async Task GetAccounts_ShouldReturnOkResult_WithListOfAccounts()
    {
        // Arrange
        var userId = Guid.NewGuid(); // Mocked user ID
        var accounts = new List<AccountDto>
    {
        new AccountDto { Name = "Account1", UserId = userId },
        new AccountDto { Name = "Account2", UserId = userId }
    };

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

        _accountServiceMock.Setup(service => service.GetAccountsByUserIdAsync(userId)).ReturnsAsync(accounts);

        // Act
        var result = await _controller.GetAccounts();

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<AccountDto>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<List<AccountDto>>(okResult.Value);
        Assert.Equal(2, returnValue.Count);
        Assert.Equal(accounts[0].Name, returnValue[0].Name);
        Assert.Equal(accounts[1].Name, returnValue[1].Name);
    }


    [Fact]
    public async Task GetAccount_ShouldReturnOkResult_WithAccount()
    {
        // Arrange
        var userId = Guid.NewGuid(); // Mocked user ID
        var accountId = Guid.NewGuid();
        var account = new AccountDto { Id = accountId, Name = "Account1", UserId = userId };

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

        _accountServiceMock.Setup(service => service.GetAccountByIdAsync(accountId)).ReturnsAsync(account);

        // Act
        var result = await _controller.GetAccount(accountId);

        // Assert
        var actionResult = Assert.IsType<ActionResult<AccountDto>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<AccountDto>(okResult.Value);
        Assert.Equal(account.Name, returnValue.Name);
        Assert.Equal(account.Id, returnValue.Id);
        Assert.Equal(account.UserId, returnValue.UserId);
    }


    [Fact]
    public async Task GetAccount_ShouldReturnNotFound_WhenAccountDoesNotExist()
    {
        // Arrange
        var accountId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        _accountServiceMock.Setup(service => service.GetAccountByIdAsync(accountId)).ReturnsAsync((AccountDto)null);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };

        // Act
        var result = await _controller.GetAccount(accountId);

        // Assert
        var actionResult = Assert.IsType<ActionResult<AccountDto>>(result);
        Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
    }



}
