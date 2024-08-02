using System.Threading.Tasks;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Services
{
    public interface IUserService
    {
        Task<bool> RegisterAsync(RegisterUserDto registerUserDto);
        Task<User> AuthenticateAsync(string username, string password);
        Task<bool> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto);
    }
}
