using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("team")]
[Index(nameof(Name), IsUnique = true)]
public class Team : BaseEntity
{
    public Team()
    {
        TeamOneEvents = new HashSet<Event>();
        TeamTwoEvents = new HashSet<Event>();
    }

    [Required(ErrorMessage = "Name field is required")]
    [StringLength(100, ErrorMessage = "Name field must be between 3 and 100 characters", MinimumLength = 3)]
    [Display(Name = "Name")]
    public string Name { get; set; } = string.Empty;

    public Sport Sport { get; set; } = null!;
    public Guid SportId { get; set; }

    public ICollection<Event> TeamOneEvents { get; set; }
    public ICollection<Event> TeamTwoEvents { get; set; }
}