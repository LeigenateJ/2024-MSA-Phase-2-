using PersonalFinanceManager.Models;

namespace PersonalFinanceManager.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
    }
}

