using System;
using System.Collections.Generic;

namespace PersonalFinanceManager.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public ICollection<Account> Accounts { get; set; }
    }
}
