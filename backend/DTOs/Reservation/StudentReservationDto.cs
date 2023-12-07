// Initializing these fields to some default value may not be the best idea
// in this case because it can mask potential bugs in your code.
// And making them nullable would contradict with your [Required] data annotation.
// So, we are using #nullable disable and #nullable restore to disable nullable warnings

#nullable disable
using Backend.DTOs.Event;
using Backend.DTOs.User;

namespace Backend.DTOs.Reservation;

public class StudentReservationDto
{
    public Guid Id { get; set; }
    public string SeatNumber { get; set; }
    public bool IsCancelled { get; set; }

    public BaseEventDto Event { get; set; }

    public BaseUserDto Student { get; set; }
}

#nullable restore