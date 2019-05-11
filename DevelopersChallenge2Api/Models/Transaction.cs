namespace DevelopersChallenge2Api.Models
{
  using System;
  using System.ComponentModel.DataAnnotations;
  using Microsoft.EntityFrameworkCore;

  public class Transaction
  {
    [Key]
    public int Id { get; set; }
  }
}
