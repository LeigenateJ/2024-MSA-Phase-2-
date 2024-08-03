using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PersonalFinanceManager.Data;
using PersonalFinanceManager.Dtos;
using PersonalFinanceManager.Models;

namespace PersonalFinanceManager.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;

        public UserService(IRepository<User> userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<bool> RegisterAsync(RegisterUserDto userDto)
        {
            var user = await _userRepository.GetAllAsync()
                                            .Result
                                            .SingleOrDefaultAsync(u => u.Username == userDto.Username);
            if (user != null)
            {
                return false;
            }

            var newUser = _mapper.Map<User>(userDto);
            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            await _userRepository.AddAsync(newUser);
            return true;
        }

        public async Task<User> AuthenticateAsync(string username, string password)
        {
            var user = await _userRepository.GetAllAsync()
                                            .Result
                                            .SingleOrDefaultAsync(u => u.Username == username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }

            return user;
        }

        public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return false; 
            }

            user.Username = updateUserDto.Username ?? user.Username;
            user.Email = updateUserDto.Email ?? user.Email;
            user.Role = updateUserDto.Role ?? user.Role;

            await _userRepository.UpdateAsync(user);
            return true;
        }

    }
}
