using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PersonalFinanceManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
        {
            try
            {
                var transactions = await _transactionService.GetTransactionsAsync();
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
                var transaction = await _transactionService.CreateTransactionAsync(transactionDto);
                return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
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
            if (id != transactionDto.Id)
            {
                return BadRequest();
            }

            try
            {
                var result = await _transactionService.UpdateTransactionAsync(id, transactionDto);
                if (!result)
                {
                    return NotFound();
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
                var result = await _transactionService.DeleteTransactionAsync(id);
                if (!result)
                {
                    return NotFound();
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
