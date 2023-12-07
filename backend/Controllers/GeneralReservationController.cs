using Backend.Common;
using Backend.DTOs.GeneralReservation;
using Backend.Services.GeneralReservationService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeneralReservationController : Controller
{
    private readonly ILogger<GeneralReservationController> _logger;
    private readonly IGeneralReservationService _reservationService;

    public GeneralReservationController(IGeneralReservationService reservationService,
        ILogger<GeneralReservationController> logger)
    {
        _reservationService = reservationService;
        _logger = logger;
    }

    [HttpGet("Event/{eventId:guid}")]
    public async Task<ActionResult<ServiceResponse<List<StudentGeneralReservationDto>>>>
        GetReservationsByEventId(Guid eventId)
    {
        return Ok(await _reservationService.GetReservationsByEventId(eventId));
    }

    [HttpGet("Event/{eventId:guid}/active")]
    public async Task<ActionResult<ServiceResponse<List<StudentGeneralReservationDto>>>>
        GetActiveReservationsByEventId(Guid eventId)
    {
        return Ok(await _reservationService.GetActiveReservationsByEventId(eventId));
    }

    [HttpGet("Student/{studentId:guid}")]
    public async Task<ActionResult<ServiceResponse<StudentGeneralReservationDto?>>> GetReservationsByStudentId(
        Guid studentId)
    {
        return Ok(await _reservationService.GetReservationsByStudentId(studentId));
    }

    [HttpGet("Student/{studentId:guid}/active")]
    public async Task<ActionResult<ServiceResponse<StudentGeneralReservationDto?>>> GetActiveReservationsByStudentId(
        Guid studentId)
    {
        return Ok(await _reservationService.GetActiveReservationsByStudentId(studentId));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<Guid?>>> CreateReservation(
        CreateGeneralReservationDto newReservation)
    {
        return Ok(await _reservationService.CreateReservation(newReservation));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Guid?>>> CancelReservation(Guid id)
    {
        return Ok(await _reservationService.CancelReservation(id));
    }
}