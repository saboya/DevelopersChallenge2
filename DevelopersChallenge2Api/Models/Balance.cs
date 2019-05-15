namespace DevelopersChallenge2Api.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Balance
    {
        [Key]
        public int Id { get; set; }

        public DateTime Timestamp { get; set; }

        public double Amount { get; set; }

        public string BankId { get; set; }

        public string AcctId { get; set; }

        public string Currency { get; set; }
    }
}
