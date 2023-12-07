using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("sport")]
[Index(nameof(Name), IsUnique = true)]
public class Sport : BaseEntity
{
    public Sport()
    {
        Teams = new HashSet<Team>();
        Events = new HashSet<Event>();
    }

    [Required(ErrorMessage = "Name field is required")]
    [StringLength(100, ErrorMessage = "Name field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Name")]
    public string Name { get; set; } = string.Empty;


    [Required(ErrorMessage = "Description field is required")]
    [StringLength(100, ErrorMessage = "Description field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Description")]
    public string Description { get; set; } = string.Empty;

    public ICollection<Team> Teams { get; set; }
    public ICollection<Event> Events { get; set; }
}