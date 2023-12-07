// Initializing these fields to some default value may not be the best idea
// in this case because it can mask potential bugs in your code.
// And making them nullable would contradict with your [Required] data annotation.
// So, we are using #nullable disable and #nullable restore to disable nullable warnings

#nullable disable
using Backend.DTOs.Sport;
using Backend.DTOs.Stadium;
using Backend.DTOs.Team;
using Backend.DTOs.User;

namespace Backend.DTOs.Event;

public class GetEventDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public DateTime StartDateTime { get; set; }

    public DateTime EndDateTime { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public int Capacity { get; set; }

    public bool IsActive { get; set; }
    public int ReservedSeats { get; set; }

    public BaseTeamDto TeamOne { get; set; }

    public BaseTeamDto TeamTwo { get; set; }

    public BaseStadiumDto Stadium { get; set; }

    public BaseUserDto Organizer { get; set; }

    public BaseSportDto Sport { get; set; }
}