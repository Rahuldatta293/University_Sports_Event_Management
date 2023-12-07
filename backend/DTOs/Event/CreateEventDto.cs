// Initializing these fields to some default value may not be the best idea
// in this case because it can mask potential bugs in your code.
// And making them nullable would contradict with your [Required] data annotation.
// So, we are using #nullable disable and #nullable restore to disable nullable warnings

#nullable disable
namespace Backend.DTOs.Event;

public class CreateEventDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }

    public Guid SportId { get; set; }
    public Guid TeamOneId { get; set; }
    public Guid TeamTwoId { get; set; }
    public Guid StadiumId { get; set; }
    public Guid OrganizerId { get; set; }
}

#nullable restore