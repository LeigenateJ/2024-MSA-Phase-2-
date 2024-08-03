using System;
using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceManager.Dtos
{
    public class AccountDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Account name is required.")]
        [StringLength(100, ErrorMessage = "Account name cannot exceed 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Account type is required.")]
        [StringLength(50, ErrorMessage = "Account type cannot exceed 50 characters.")]
        public string Type { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Balance must be a positive number.")]
        public decimal Balance { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public Guid UserId { get; set; }
    }
}
