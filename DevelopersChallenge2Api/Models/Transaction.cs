using System;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DevelopersChallenge2Api.Models
{
  public class Transaction {
    [Key]
    public int Id { get; set; }
  }
}
