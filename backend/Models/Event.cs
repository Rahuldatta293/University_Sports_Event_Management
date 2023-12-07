using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("event")]
public class Event : BaseEntity
{
    public Event()
    {
        Reservations = new HashSet<Reservation>();
    }

    [Required(ErrorMessage = "Name field is required")]
    [StringLength(100, ErrorMessage = "Name field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Name")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description field is required")]
    [StringLength(100, ErrorMessage = "Description field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Description")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Start time field is required")]
    [Display(Name = "Start time")]
    public DateTime StartDateTime { get; set; }

    [Required(ErrorMessage = "End time field is required")]
    [Display(Name = "End time")]
    public DateTime EndDateTime { get; set; }

    [Required(ErrorMessage = "IsActive field is required")]
    [Display(Name = "IsActive")]
    public bool IsActive { get; set; } = true;

    public Stadium Stadium { get; set; } = null!;
    public Guid StadiumId { get; set; }

    public Sport Sport { get; set; } = null!;
    public Guid SportId { get; set; }

    public Team TeamOne { get; set; } = null!;
    public Guid TeamOneId { get; set; }

    public Team TeamTwo { get; set; } = null!;
    public Guid TeamTwoId { get; set; }

    public User Organizer { get; set; } = null!;
    public Guid OrganizerId { get; set; }

    public ICollection<Reservation> Reservations { get; set; }
}