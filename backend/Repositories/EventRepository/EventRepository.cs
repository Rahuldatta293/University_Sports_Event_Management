using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.EventRepository;

public class EventRepository : IEventRepository
{
    private readonly DataContext _context;
    private readonly ILogger<EventRepository> _logger;

    public EventRepository(DataContext context, ILogger<EventRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Event>> GetEvents()
    {
        return await _context.Event
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }

    public async Task<List<Event>> GetActiveEvents()
    {
        return await _context.Event
            .Where(e => e.IsActive == true)
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }


    public async Task<Event?> GetEventById(Guid id)
    {
        return await _context.Event
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<Event>> GetEventsBySportId(Guid sportId)
    {
        return await _context.Event
            .Where(t => t.SportId == sportId)
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }

    public async Task<List<Event>> GetEventsByStadiumId(Guid stadiumId)
    {
        return await _context.Event
            .Where(t => t.StadiumId == stadiumId)
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }

    public async Task<List<Event>> GetEventsByTeamId(Guid teamId)
    {
        return await _context.Event
            .Where(t => t.TeamOneId == teamId || t.TeamTwoId == teamId)
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }

    public async Task<List<Event>> GetEventsByOrganizerId(Guid organizerId)
    {
        return await _context.Event
            .Where(t => t.OrganizerId == organizerId)
            .Include(t => t.TeamOne)
            .Include(t => t.TeamTwo)
            .Include(t => t.Sport)
            .Include(t => t.Stadium)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }

    public async Task<Event> CreateEvent(Event newEvent)
    {
        newEvent.Id = Guid.NewGuid();
        _context.Event.Add(newEvent);
        await _context.SaveChangesAsync();

        return newEvent;
    }

    public async Task<Event> UpdateEvent(Event updatedEvent)
    {
        _context.Event.Update(updatedEvent);
        await _context.SaveChangesAsync();

        return updatedEvent;
    }
}