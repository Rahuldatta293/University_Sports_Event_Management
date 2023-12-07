using Backend.Models;

namespace Backend.Repositories.GeneralEventRepository;

public interface IGeneralEventRepository
{
    Task<List<GeneralEvent>> GetEvents();
    Task<List<GeneralEvent>> GetActiveEvents();
    Task<GeneralEvent?> GetEventById(Guid id);
    Task<List<GeneralEvent>> GetEventsByOrganizerId(Guid organizerId);
    Task<GeneralEvent> CreateEvent(GeneralEvent newEvent);
    Task<GeneralEvent> UpdateEvent(GeneralEvent updatedEvent);
}