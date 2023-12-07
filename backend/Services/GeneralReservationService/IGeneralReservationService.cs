using Backend.Common;
using Backend.DTOs.GeneralReservation;

namespace Backend.Services.GeneralReservationService;

public interface IGeneralReservationService
{
    Task<ServiceResponse<List<StudentGeneralReservationDto>>> GetReservationsByEventId(Guid eventId);
    Task<ServiceResponse<List<StudentGeneralReservationDto>>> GetActiveReservationsByEventId(Guid eventId);
    Task<ServiceResponse<List<GeneralEventReservationDto>>> GetReservationsByStudentId(Guid studentId);
    Task<ServiceResponse<List<GeneralEventReservationDto>>> GetActiveReservationsByStudentId(Guid studentId);
    Task<ServiceResponse<Guid>> CreateReservation(CreateGeneralReservationDto newReservation);
    Task<ServiceResponse<Guid?>> CancelReservation(Guid id);
}