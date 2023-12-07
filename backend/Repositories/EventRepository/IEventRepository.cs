using Backend.Models;

namespace Backend.Repositories.EventRepository;

public interface IEventRepository
{
    Task<List<Event>> GetEvents();
    Task<List<Event>> GetActiveEvents();
    Task<Event?> GetEventById(Guid id);
    Task<List<Event>> GetEventsBySportId(Guid sportId);
    Task<List<Event>> GetEventsByStadiumId(Guid stadiumId);
    Task<List<Event>> GetEventsByTeamId(Guid teamId);
    Task<List<Event>> GetEventsByOrganizerId(Guid organizerId);
    Task<Event> CreateEvent(Event newEvent);
    Task<Event> UpdateEvent(Event updatedEvent);
}