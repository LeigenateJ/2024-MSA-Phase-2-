using System;
using System.Collections.Generic;

namespace PersonalFinanceManager.Models
{
    public class Account
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public decimal Balance { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
