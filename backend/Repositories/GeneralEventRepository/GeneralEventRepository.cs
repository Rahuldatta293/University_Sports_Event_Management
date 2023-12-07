using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.GeneralEventRepository;

public class GeneralEventRepository : IGeneralEventRepository
{
    private readonly DataContext _context;
    private readonly ILogger<GeneralEventRepository> _logger;

    public GeneralEventRepository(DataContext context, ILogger<GeneralEventRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<GeneralEvent> UpdateEvent(GeneralEvent updatedEvent)
    {
        _context.GeneralEvent.Update(updatedEvent);
        await _context.SaveChangesAsync();

        return updatedEvent;
    }

    public async Task<GeneralEvent> CreateEvent(GeneralEvent newEvent)
    {
        newEvent.Id = Guid.NewGuid();
        _context.GeneralEvent.Add(newEvent);
        await _context.SaveChangesAsync();

        return newEvent;
    }

    public async Task<List<GeneralEvent>> GetEventsByOrganizerId(Guid organizerId)
    {
        return await _context.GeneralEvent
            .Where(t => t.OrganizerId == organizerId)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }


    public async Task<GeneralEvent?> GetEventById(Guid id)
    {
        return await _context.GeneralEvent
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<GeneralEvent>> GetActiveEvents()
    {
        return await _context.GeneralEvent
            .Where(e => e.IsActive == true)
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }

    public async Task<List<GeneralEvent>> GetEvents()
    {
        return await _context.GeneralEvent
            .Include(t => t.Organizer)
            .Include(t => t.Reservations)
            .ToListAsync();
    }
}