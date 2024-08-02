using AutoMapper;
using PersonalFinanceManager.Dtos;
using PersonalFinanceManager.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PersonalFinanceManager.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Account, AccountDto>().ReverseMap();
            CreateMap<Transaction, TransactionDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
        }
    }
}
