using System;
using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceManager.Dtos
{
    public class TransactionDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Account ID is required.")]
        public Guid AccountId { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Transaction type is required.")]
        [StringLength(50, ErrorMessage = "Transaction type cannot exceed 50 characters.")]
        public string Type { get; set; }

        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters.")]
        public string Category { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        public DateTime Date { get; set; }

        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
        public string Description { get; set; }
    }
}
