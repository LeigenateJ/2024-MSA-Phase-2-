using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Services;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Dtos;
using System.Threading.Tasks;

namespace PersonalFinanceManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public UsersController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(UserDto userDto)
        {
            var result = await _userService.RegisterAsync(userDto);
            if (!result)
            {
                return BadRequest(new { message = "Registration failed" });
            }

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(UserDto userDto)
        {
            var user = await _userService.AuthenticateAsync(userDto.Username, userDto.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = _tokenService.GenerateJwtToken(user);
            return Ok(new { token });
        }
    }
}
