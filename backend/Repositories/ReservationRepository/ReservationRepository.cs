using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.ReservationRepository;

public class ReservationRepository : IReservationRepository
{
    private readonly DataContext _context;
    private readonly ILogger<ReservationRepository> _logger;


    public ReservationRepository(DataContext context, ILogger<ReservationRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Reservation> CreateReservation(Reservation reservation)
    {
        _context.Reservation.Add(reservation);
        await _context.SaveChangesAsync();

        return reservation;
    }

    public Task<Reservation?> GetById(Guid id)
    {
        return _context.Reservation
            .Include(r => r.User)
            .Include(r => r.Event)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<List<Reservation>> GetReservationsByEventId(Guid eventId)
    {
        return await _context.Reservation
            .Where(r => r.EventId == eventId)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<List<Reservation>> GetActiveReservationsByEventId(Guid eventId)
    {
        return await _context.Reservation
            .Where(r => r.EventId == eventId && !r.IsCancelled)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<List<Reservation>> GetReservationsByStudentId(Guid studentId)
    {
        return await _context.Reservation
            .Where(r => r.StudentId == studentId)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<List<Reservation>> GetActiveReservationsByStudentId(Guid studentId)
    {
        return await _context.Reservation
            .Where(r => r.StudentId == studentId && !r.IsCancelled)
            .Include(r => r.User)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<Guid> UpdateReservation(Reservation reservation)
    {
        reservation.IsCancelled = true;

        _context.Reservation.Update(reservation);
        await _context.SaveChangesAsync();

        return reservation.Id;
    }

    public async Task<bool> IsStudentAlreadyRegistered(Guid studentId, Guid eventId)
    {
        return await _context.Reservation.AnyAsync(r =>
            r.StudentId == studentId && r.EventId == eventId && !r.IsCancelled);
    }
}