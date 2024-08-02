using Xunit;
using Moq;
using System.Threading.Tasks;
using PersonalFinanceManager.Controllers;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Models;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Tests.Controllers
{
    public class UsersControllerTests
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly Mock<ITokenService> _tokenServiceMock;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            _userServiceMock = new Mock<IUserService>();
            _tokenServiceMock = new Mock<ITokenService>();
            _controller = new UsersController(_userServiceMock.Object, _tokenServiceMock.Object);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenUserAlreadyExists()
        {
            // Arrange
            var userDto = new RegisterUserDto { Username = "existinguser", Password = "password" };
            _userServiceMock.Setup(s => s.RegisterAsync(userDto)).ReturnsAsync(false);

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
        {
            // Arrange
            var userDto = new RegisterUserDto { Username = "invaliduser", Password = "wrongpassword" };
            _userServiceMock.Setup(s => s.AuthenticateAsync(userDto.Username, userDto.Password)).ReturnsAsync((User)null);

            // Act
            var result = await _controller.Login(userDto);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsOkResult_WhenUserIsRegistered()
        {
            // Arrange
            var userDto = new RegisterUserDto { Username = "newuser", Password = "password" };
            _userServiceMock.Setup(s => s.RegisterAsync(userDto)).ReturnsAsync(true);

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
