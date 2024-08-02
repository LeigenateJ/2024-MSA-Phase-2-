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
    public class TransactionsControllerTests
    {
        private readonly Mock<ITransactionService> _transactionServiceMock;
        private readonly TransactionsController _controller;

        public TransactionsControllerTests()
        {
            _transactionServiceMock = new Mock<ITransactionService>();
            _controller = new TransactionsController(_transactionServiceMock.Object);
        }

        [Fact]
        public async Task GetTransactions_ReturnsOkResult_WithListOfTransactions()
        {
            // Arrange
            var transactions = new List<TransactionDto>
            {
                new TransactionDto { Id = Guid.NewGuid(), Amount = 100, Type = "Income", Category = "Salary" }
            };
            _transactionServiceMock.Setup(s => s.GetTransactionsAsync()).ReturnsAsync(transactions);

            // Act
            var result = await _controller.GetTransactions();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<TransactionDto>>(okResult.Value);
            Assert.Equal(transactions.Count, returnValue.Count);
        }

        [Fact]
        public async Task GetTransaction_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var transactionId = Guid.NewGuid();
            _transactionServiceMock.Setup(s => s.GetTransactionByIdAsync(transactionId)).ReturnsAsync((TransactionDto)null);

            // Act
            var result = await _controller.GetTransaction(transactionId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateTransaction_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var transactionDto = new TransactionDto { Amount = 100, Type = "Income", Category = "Salary" };
            var createdTransaction = new TransactionDto { Id = Guid.NewGuid(), Amount = 100, Type = "Income", Category = "Salary" };
            _transactionServiceMock.Setup(s => s.CreateTransactionAsync(transactionDto)).ReturnsAsync(createdTransaction);

            // Act
            var result = await _controller.CreateTransaction(transactionDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<TransactionDto>(createdAtActionResult.Value);
            Assert.Equal(createdTransaction.Id, returnValue.Id);
        }

        [Fact]
        public async Task DeleteTransaction_ReturnsNoContent_WhenDeletionIsSuccessful()
        {
            // Arrange
            var transactionId = Guid.NewGuid();
            _transactionServiceMock.Setup(s => s.DeleteTransactionAsync(transactionId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteTransaction(transactionId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
