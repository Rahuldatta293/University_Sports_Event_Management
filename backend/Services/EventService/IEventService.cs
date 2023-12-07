using Backend.Common;
using Backend.DTOs.Event;

namespace Backend.Services.EventService;

public interface IEventService
{
    Task<ServiceResponse<List<GetEventDto>>> GetEvents();
    Task<ServiceResponse<GetEventDto?>> GetEventById(Guid id);
    Task<ServiceResponse<List<GetEventDto>>> GetEventsBySportId(Guid sportId);
    Task<ServiceResponse<List<GetEventDto>>> GetEventsByStadiumId(Guid stadiumId);
    Task<ServiceResponse<List<GetEventDto>>> GetEventsByTeamId(Guid teamId);
    Task<ServiceResponse<List<GetEventDto>>> GetEventsByOrganizerId(Guid organizerId);
    Task<ServiceResponse<Guid>> CreateEvent(CreateEventDto newEvent);
    Task<ServiceResponse<Guid>> UpdateEvent(Guid id, UpdateEventDto updateEvent);
    Task<ServiceResponse<bool>> CancelEvent(Guid id);
}