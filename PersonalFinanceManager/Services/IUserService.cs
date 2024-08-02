using System.Threading.Tasks;
using PersonalFinanceManager.Models;
using PersonalFinanceManager.Dtos;

namespace PersonalFinanceManager.Services
{
    public interface IUserService
    {
        Task<bool> RegisterAsync(UserDto userDto);
        Task<User> AuthenticateAsync(string username, string password);
    }
}
