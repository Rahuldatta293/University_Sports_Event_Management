using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("stadium")]
public class Stadium : BaseEntity
{
    public Stadium()
    {
        Events = new HashSet<Event>();
    }

    [Required(ErrorMessage = "Name field is required")]
    [StringLength(100, ErrorMessage = "Name field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Name")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Capacity field is required")]
    [Display(Name = "Capacity")]
    public int Capacity { get; set; } = 0;

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

    public ICollection<Event> Events { get; set; }
}