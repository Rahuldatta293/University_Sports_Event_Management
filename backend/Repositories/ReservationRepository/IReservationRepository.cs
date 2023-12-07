using Backend.Models;

namespace Backend.Repositories.ReservationRepository;

public interface IReservationRepository
{
    Task<Reservation?> GetById(Guid id);
    Task<List<Reservation>> GetReservationsByEventId(Guid eventId);
    Task<List<Reservation>> GetActiveReservationsByEventId(Guid eventId);
    Task<List<Reservation>> GetReservationsByStudentId(Guid studentId);
    Task<List<Reservation>> GetActiveReservationsByStudentId(Guid studentId);
    Task<Reservation> CreateReservation(Reservation reservation);
    Task<Guid> UpdateReservation(Reservation reservation);
    Task<bool> IsStudentAlreadyRegistered(Guid studentId, Guid eventId);
}