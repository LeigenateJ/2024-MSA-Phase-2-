using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Dtos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace PersonalFinanceManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly ITransactionService _transactionService;

        public UsersController(IUserService userService, ITokenService tokenService, ITransactionService transactionService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _transactionService = transactionService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userService.RegisterAsync(registerUserDto);
                if (user == null)
                {
                    return BadRequest(new { message = "Registration failed. User may already exist." });
                }

                var token = _tokenService.GenerateJwtToken(user);

                var userInfo = new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    role = user.Role
                };

                return Ok(new { token, user = userInfo });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while registering user.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{userId}/transactions")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByUserId(Guid userId)
        {
            try
            {
                var authenticatedUserId = GetUserIdFromToken();

                // Ensure the user is accessing their own data
                if (authenticatedUserId != userId)
                {
                    return Unauthorized(new { message = "Access denied." });
                }

                var transactions = await _transactionService.GetTransactionsByUserIdAsync(userId);
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while fetching transactions.");
                return StatusCode(500, "Internal server error.");
            }
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userService.AuthenticateAsync(loginDto.Username, loginDto.Password);
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid username or password." });
                }

                var token = _tokenService.GenerateJwtToken(user);

                var userInfo = new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    role = user.Role
                };

                return Ok(new { token, user = userInfo });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while logging in.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _userService.UpdateUserAsync(id, updateUserDto);
                if (!result)
                {
                    return NotFound(new { message = "User not found." });
                }

                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An error occurred while updating the user.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

    }
}
