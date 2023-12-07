// Initializing these fields to some default value may not be the best idea
// in this case because it can mask potential bugs in your code.
// And making them nullable would contradict with your [Required] data annotation.
// So, we are using #nullable disable and #nullable restore to disable nullable warnings

#nullable disable
namespace Backend.DTOs.GeneralEvent;

public class BaseGeneralEventDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public bool IsActive { get; set; }
    public int Capacity { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
}