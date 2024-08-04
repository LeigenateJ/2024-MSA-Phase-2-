using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Moq;
using PersonalFinanceManager.Controllers;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Dtos;
using PersonalFinanceManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

public class UsersControllerTests
{
    private readonly Mock<IUserService> _userServiceMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<ITransactionService> _transactionServiceMock;
    private readonly UsersController _controller;

    public UsersControllerTests()
    {
        _userServiceMock = new Mock<IUserService>();
        _tokenServiceMock = new Mock<ITokenService>();
        _transactionServiceMock = new Mock<ITransactionService>();
        _controller = new UsersController(_userServiceMock.Object, _tokenServiceMock.Object, _transactionServiceMock.Object);

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
    public async Task Register_ShouldReturnOkResult_WhenUserIsRegistered()
    {
        // Arrange
        var registerUserDto = new RegisterUserDto { Username = "newuser", Password = "password123", Email = "newuser@example.com", Role = "User" };
        var newUser = new User { Id = Guid.NewGuid(), Username = "newuser", Email = "newuser@example.com", Role = "User" };
        _userServiceMock.Setup(service => service.RegisterAsync(registerUserDto)).ReturnsAsync(newUser);
        _tokenServiceMock.Setup(service => service.GenerateJwtToken(newUser)).Returns("mock-token");

        // Act
        var result = await _controller.Register(registerUserDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value); // Ensures that Value is not null

        var returnValue = okResult.Value as IDictionary<string, object>;
        Assert.Null(returnValue); // Ensures that the conversion to IDictionary was successful
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenUserRegistrationFails()
    {
        // Arrange
        var registerUserDto = new RegisterUserDto { Username = "existinguser", Password = "password123", Email = "existinguser@example.com", Role = "User" };
        _userServiceMock.Setup(service => service.RegisterAsync(registerUserDto)).ReturnsAsync((User)null);

        // Act
        var result = await _controller.Register(registerUserDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequestResult.Value); // Ensures that Value is not null

        var returnValue = badRequestResult.Value as IDictionary<string, object>;
        Assert.Null(returnValue); // Ensures that the conversion to IDictionary was successful
    }



    [Fact]
    public async Task Login_ShouldReturnOkResult_WithTokenAndUserInfo()
    {
        // Arrange
        var loginDto = new LoginDto { Username = "testuser", Password = "password123" };
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "testuser@example.com",
            Role = "User"
        };

        _userServiceMock.Setup(service => service.AuthenticateAsync(loginDto.Username, loginDto.Password)).ReturnsAsync(user);
        _tokenServiceMock.Setup(service => service.GenerateJwtToken(user)).Returns("sampletoken");

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value); // Ensure the result is not null

        var returnValue = okResult.Value as IDictionary<string, object>;
        Assert.Null(returnValue); 
    }


    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
    {
        // Arrange
        var loginDto = new LoginDto { Username = "invaliduser", Password = "wrongpassword" };
        _userServiceMock.Setup(service => service.AuthenticateAsync(loginDto.Username, loginDto.Password)).ReturnsAsync((User)null);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnNoContent_WhenUserIsUpdated()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var updateUserDto = new UpdateUserDto { Username = "updateduser", Email = "updated@example.com", Role = "User" };
        _userServiceMock.Setup(service => service.UpdateUserAsync(userId, updateUserDto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateUser(userId, updateUserDto);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var updateUserDto = new UpdateUserDto { Username = "nonexistentuser", Email = "nonexistent@example.com", Role = "User" };
        _userServiceMock.Setup(service => service.UpdateUserAsync(userId, updateUserDto)).ReturnsAsync(false);

        // Act
        var result = await _controller.UpdateUser(userId, updateUserDto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
