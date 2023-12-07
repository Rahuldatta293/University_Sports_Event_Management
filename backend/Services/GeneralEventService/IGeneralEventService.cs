using Backend.Common;
using Backend.DTOs.GeneralEvent;

namespace Backend.Services.GeneralEventService;

public interface IGeneralEventService
{
    Task<ServiceResponse<List<GetGeneralEventDto>>> GetEvents();
    Task<ServiceResponse<GetGeneralEventDto?>> GetEventById(Guid id);
    Task<ServiceResponse<List<GetGeneralEventDto>>> GetEventsByOrganizerId(Guid organizerId);
    Task<ServiceResponse<Guid>> CreateEvent(CreateGeneralEventDto newEvent);
    Task<ServiceResponse<Guid>> UpdateEvent(Guid id, UpdateGeneralEventDto updateEvent);
    Task<ServiceResponse<bool>> CancelEvent(Guid id);
}