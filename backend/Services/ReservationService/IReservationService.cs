using Backend.Common;
using Backend.DTOs.Reservation;
using Backend.Models;

namespace Backend.Services.ReservationService;

public interface IReservationService
{
    Task<ServiceResponse<List<StudentReservationDto>>> GetReservationsByEventId(Guid eventId);
    Task<ServiceResponse<List<StudentReservationDto>>> GetActiveReservationsByEventId(Guid eventId);
    Task<ServiceResponse<List<EventReservationDto>>> GetReservationsByStudentId(Guid studentId);
    Task<ServiceResponse<List<EventReservationDto>>> GetActiveReservationsByStudentId(Guid studentId);
    Task<ServiceResponse<Guid>> CreateReservation(CreateReservationDto newReservation);
    Task<ServiceResponse<Guid?>> CancelReservation(Guid id);
}