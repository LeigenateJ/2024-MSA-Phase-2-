using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace PersonalFinanceManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : BaseController
    {
        private readonly ITransactionService _transactionService;
        private readonly IAccountService _accountService;

        public TransactionsController(ITransactionService transactionService, IAccountService accountService)
        {
            _transactionService = transactionService;
            _accountService = accountService;
        }

        [HttpGet("{accountId}/transactions")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions(Guid accountId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var account = await _accountService.GetAccountByIdAsync(accountId);

                if (account == null || account.UserId != userId)
                {
                    return Unauthorized(new { message = "Access denied." });
                }

                var transactions = await _transactionService.GetTransactionsByAccountIdAsync(accountId);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while fetching transactions.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransaction(Guid id)
        {
            try
            {
                var transaction = await _transactionService.GetTransactionByIdAsync(id);
                if (transaction == null)
                {
                    return NotFound();
                }
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while fetching the transaction.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDto>> CreateTransaction([FromBody] TransactionDto transactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetUserIdFromToken();
                var account = await _accountService.GetAccountByIdAsync(transactionDto.AccountId);

                if (account == null || account.UserId != userId)
                {
                    return Unauthorized(new { message = "Access denied." });
                }

                var createdTransaction = await _transactionService.AddTransactionAsync(transactionDto);
                if (createdTransaction == null)
                {
                    return StatusCode(500, new { message = "Failed to add transaction." });
                }

                return Ok(createdTransaction);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while creating the transaction.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] TransactionDto transactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetUserIdFromToken();
                var transaction = await _transactionService.GetTransactionByIdAsync(id);
                if (transaction == null)
                {
                    return NotFound(new { message = "Transaction not found." });
                }

                var account = await _accountService.GetAccountByIdAsync(transaction.AccountId);
                if (account == null || account.UserId != userId)
                {
                    return Unauthorized(new { message = "Access denied." });
                }

                var result = await _transactionService.UpdateTransactionAsync(id, transactionDto);
                if (!result)
                {
                    return StatusCode(500, new { message = "Failed to update transaction." });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while updating the transaction.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(Guid id)
        {
            try
            {
                var transaction = await _transactionService.GetTransactionByIdAsync(id);
                if (transaction == null)
                {
                    return NotFound(new { message = "Transaction not found." });
                }

                var userId = GetUserIdFromToken();
                var account = await _accountService.GetAccountByIdAsync(transaction.AccountId);

                if (account == null || account.UserId != userId)
                {
                    return Unauthorized(new { message = "Access denied." });
                }

                var result = await _transactionService.DeleteTransactionAsync(id);
                if (!result)
                {
                    return StatusCode(500, new { message = "Failed to delete transaction." });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while deleting the transaction.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
