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
    public class AccountsController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccounts()
        {
            try
            {
                var userId = GetUserIdFromToken();
                var accounts = await _accountService.GetAccountsByUserIdAsync(userId);

                if (accounts == null || !accounts.Any())
                {
                    return NotFound(new { message = "No accounts found." });
                }

                return Ok(accounts);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while fetching accounts.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDto>> GetAccount(Guid id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var account = await _accountService.GetAccountByIdAsync(id);

                if (account == null || account.UserId != userId)
                {
                    return Unauthorized(new { message = "Access denied." });
                }

                return Ok(account);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while fetching the account.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<AccountDto>> CreateAccount([FromBody] AccountDto accountDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var account = await _accountService.CreateAccountAsync(accountDto);
                return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, account);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while creating the account.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(Guid id, [FromBody] AccountDto accountDto)
        {
            if (id != accountDto.Id)
            {
                return BadRequest();
            }

            try
            {
                var result = await _accountService.UpdateAccountAsync(id, accountDto);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while updating the account.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(Guid id)
        {
            try
            {
                var result = await _accountService.DeleteAccountAsync(id);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while deleting the account.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
