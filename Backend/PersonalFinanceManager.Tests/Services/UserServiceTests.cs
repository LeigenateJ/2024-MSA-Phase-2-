using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using AutoMapper;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Dtos;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Data;
public class UserServiceTests
{
    private readonly Mock<IRepository<User>> _mockUserRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockUserRepository = new Mock<IRepository<User>>();
        _mockMapper = new Mock<IMapper>();
        _userService = new UserService(_mockUserRepository.Object, _mockMapper.Object);
    }


    [Fact]
    public async Task UpdateUserAsync_ShouldReturnTrue_WhenUserIsUpdatedSuccessfully()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var updateUserDto = new UpdateUserDto
        {
            Username = "newUsername",
            Email = "newemail@example.com",
            Role = "User"
        };
        var user = new User { Id = userId, Username = "oldUsername", Email = "oldemail@example.com", Role = "Admin" };

        _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId)).ReturnsAsync(user);
        _mockUserRepository.Setup(repo => repo.UpdateAsync(user)).Returns(Task.CompletedTask);

        // Act
        var result = await _userService.UpdateUserAsync(userId, updateUserDto);

        // Assert
        Assert.True(result);
        Assert.Equal(updateUserDto.Username, user.Username);
        Assert.Equal(updateUserDto.Email, user.Email);
        Assert.Equal(updateUserDto.Role, user.Role);
        _mockUserRepository.Verify(repo => repo.UpdateAsync(It.IsAny<User>()), Times.Once);
    }
}

