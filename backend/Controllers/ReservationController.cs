using Backend.Common;
using Backend.DTOs.Reservation;
using Backend.Models;
using Backend.Services.ReservationService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : Controller
{
    private readonly ILogger<ReservationController> _logger;
    private readonly IReservationService _reservationService;

    public ReservationController(IReservationService reservationService, ILogger<ReservationController> logger)
    {
        _reservationService = reservationService;
        _logger = logger;
    }

    [HttpGet("Event/{eventId:guid}")]
    public async Task<ActionResult<ServiceResponse<List<StudentReservationDto>>>> GetReservationsByEventId(Guid eventId)
    {
        return Ok(await _reservationService.GetReservationsByEventId(eventId));
    }

    [HttpGet("Event/{eventId:guid}/active")]
    public async Task<ActionResult<ServiceResponse<List<StudentReservationDto>>>>
        GetActiveReservationsByEventId(Guid eventId)
    {
        return Ok(await _reservationService.GetActiveReservationsByEventId(eventId));
    }

    [HttpGet("Student/{studentId:guid}")]
    public async Task<ActionResult<ServiceResponse<Team?>>> GetReservationsByStudentId(Guid studentId)
    {
        return Ok(await _reservationService.GetReservationsByStudentId(studentId));
    }

    [HttpGet("Student/{studentId:guid}/active")]
    public async Task<ActionResult<ServiceResponse<Team?>>> GetActiveReservationsByStudentId(Guid studentId)
    {
        return Ok(await _reservationService.GetActiveReservationsByStudentId(studentId));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<Guid?>>> CreateReservation(CreateReservationDto newReservation)
    {
        return Ok(await _reservationService.CreateReservation(newReservation));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Guid?>>> CancelReservation(Guid id)
    {
        return Ok(await _reservationService.CancelReservation(id));
    }
}