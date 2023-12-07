using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("user")]
[Index(nameof(Email), IsUnique = true)]
public class User : BaseEntity
{
    public User()
    {
        OrganizedEvents = new HashSet<Event>();
        OrganizedGeneralEvents = new HashSet<GeneralEvent>();
        Reservations = new HashSet<Reservation>();
        GeneralReservations = new HashSet<GeneralReservation>();
    }

    [Required(ErrorMessage = "Name field is required")]
    [StringLength(100, ErrorMessage = "Name field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Name")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email field is required")]
    [EmailAddress(ErrorMessage = "Email field is not valid")]
    [Display(Name = "Email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password field is required")]
    [DataType(DataType.Password)]
    [StringLength(100, ErrorMessage = "Password field must be between 6 and 100 characters", MinimumLength = 6)]
    [Display(Name = "Password")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role field is required")]
    [Display(Name = "Role")]
    public UserRole Role { get; set; }

    [Required(ErrorMessage = "IsActive field is required")]
    [Display(Name = "IsActive")]
    public bool IsActive { get; set; } = true;

    [Required(ErrorMessage = "Address Line 1 field is required")]
    [Display(Name = "AddressLine1")]
    public string AddressLine1 { get; set; } = string.Empty;

    [Display(Name = "Address Line 2")] public string AddressLine2 { get; set; } = string.Empty;

    [Required(ErrorMessage = "City field is required")]
    [Display(Name = "City")]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "State field is required")]
    [Display(Name = "State")]
    public string State { get; set; } = string.Empty;

    [Required(ErrorMessage = "Zip Code field is required")]
    [Display(Name = "ZipCode")]
    public string ZipCode { get; set; } = string.Empty;

    [Display(Name = "Token")] public string Token { get; set; } = string.Empty;

    public ICollection<Event> OrganizedEvents { get; set; }
    public ICollection<GeneralEvent> OrganizedGeneralEvents { get; set; }
    public ICollection<Reservation> Reservations { get; set; }
    public ICollection<GeneralReservation> GeneralReservations { get; set; }
}