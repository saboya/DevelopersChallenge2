namespace DevelopersChallenge2Api.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        public DateTime Timestamp { get; set; }

        public double Amount { get; set; }

        public string Description { get; set; }

        public string OperationType { get; set; }
    }
}
