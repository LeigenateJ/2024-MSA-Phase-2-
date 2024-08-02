using System;

namespace PersonalFinanceManager.Dtos
{
    public class AccountDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public decimal Balance { get; set; }
        public Guid UserId { get; set; }
    }
}
