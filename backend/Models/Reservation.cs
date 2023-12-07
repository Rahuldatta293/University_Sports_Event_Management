using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("reservation")]
public class Reservation : BaseEntity
{
    [Required(ErrorMessage = "Seat number is required")]
    [StringLength(100, ErrorMessage = "Seat number must be between 2 and 10 characters", MinimumLength = 2)]
    [Display(Name = "seat_no")]
    public required string SeatNumber { get; set; }

    public bool IsCancelled { get; set; } = false;
    public Event Event { get; set; } = null!;
    public Guid EventId { get; set; }

    public User User { get; set; } = null!;
    public Guid StudentId { get; set; }
}