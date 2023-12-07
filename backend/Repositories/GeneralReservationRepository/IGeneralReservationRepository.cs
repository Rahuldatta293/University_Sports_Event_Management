using Backend.Models;

namespace Backend.Repositories.GeneralReservationRepository;

public interface IGeneralReservationRepository
{
    Task<GeneralReservation?> GetById(Guid id);
    Task<List<GeneralReservation>> GetReservationsByEventId(Guid eventId);
    Task<List<GeneralReservation>> GetActiveReservationsByEventId(Guid eventId);
    Task<List<GeneralReservation>> GetReservationsByStudentId(Guid studentId);
    Task<List<GeneralReservation>> GetActiveReservationsByStudentId(Guid studentId);
    Task<GeneralReservation> CreateReservation(GeneralReservation reservation);
    Task<Guid> UpdateReservation(GeneralReservation reservation);
    Task<bool> IsStudentAlreadyRegistered(Guid studentId, Guid eventId);
}