using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.GeneralReservationRepository;

public class GeneralReservationRepository : IGeneralReservationRepository
{
    private readonly DataContext _context;
    private readonly ILogger<GeneralReservationRepository> _logger;


    public GeneralReservationRepository(DataContext context, ILogger<GeneralReservationRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> IsStudentAlreadyRegistered(Guid studentId, Guid eventId)
    {
        return await _context.GeneralReservation.AnyAsync(r =>
            r.StudentId == studentId && r.EventId == eventId && !r.IsCancelled);
    }

    public async Task<GeneralReservation> CreateReservation(GeneralReservation reservation)
    {
        _context.GeneralReservation.Add(reservation);
        await _context.SaveChangesAsync();

        return reservation;
    }

    public Task<GeneralReservation?> GetById(Guid id)
    {
        return _context.GeneralReservation
            .Include(r => r.User)
            .Include(r => r.Event)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<List<GeneralReservation>> GetReservationsByEventId(Guid eventId)
    {
        return await _context.GeneralReservation
            .Where(r => r.EventId == eventId)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<List<GeneralReservation>> GetActiveReservationsByEventId(Guid eventId)
    {
        return await _context.GeneralReservation
            .Where(r => r.EventId == eventId && !r.IsCancelled)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<List<GeneralReservation>> GetReservationsByStudentId(Guid studentId)
    {
        return await _context.GeneralReservation
            .Where(r => r.StudentId == studentId)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<List<GeneralReservation>> GetActiveReservationsByStudentId(Guid studentId)
    {
        return await _context.GeneralReservation
            .Where(r => r.StudentId == studentId && !r.IsCancelled)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<Guid> UpdateReservation(GeneralReservation reservation)
    {
        reservation.IsCancelled = true;

        _context.GeneralReservation.Update(reservation);
        await _context.SaveChangesAsync();

        return reservation.Id;
    }
}