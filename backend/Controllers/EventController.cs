using Backend.Common;
using Backend.DTOs.Event;
using Backend.Models;
using Backend.Services.EventService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : Controller
{
    private readonly IEventService _eventService;
    private readonly ILogger<EventController> _logger;

    public EventController(IEventService eventService, ILogger<EventController> logger)
    {
        _eventService = eventService;
        _logger = logger;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<ServiceResponse<List<GetEventDto>>>> GetEvents()
    {
        return Ok(await _eventService.GetEvents());
    }

    [HttpGet("GetById/{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Team?>>> GetEventById(Guid id)
    {
        return Ok(await _eventService.GetEventById(id));
    }

    [HttpGet("GetEventsBySportId/{sportId:guid}")]
    public async Task<ActionResult<ServiceResponse<GetEventDto?>>> GetEventsBySportId(Guid sportId)
    {
        return Ok(await _eventService.GetEventsBySportId(sportId));
    }

    [HttpGet("GetEventsByTeamId/{teamId:guid}")]
    public async Task<ActionResult<ServiceResponse<GetEventDto?>>> GetEventByTeamId(Guid teamId)
    {
        return Ok(await _eventService.GetEventsByTeamId(teamId));
    }

    [HttpGet("GetEventsByStadiumId/{stadiumId:guid}")]
    public async Task<ActionResult<ServiceResponse<GetEventDto?>>> GetEventByStadiumId(Guid stadiumId)
    {
        return Ok(await _eventService.GetEventsByStadiumId(stadiumId));
    }

    [HttpGet("GetEventsByOrganizerId/{organizerId:guid}")]
    public async Task<ActionResult<ServiceResponse<GetEventDto?>>> GetEventByOrganizerId(Guid organizerId)
    {
        return Ok(await _eventService.GetEventsByOrganizerId(organizerId));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<Guid?>>> CreateEvent(CreateEventDto createEvent)
    {
        return Ok(await _eventService.CreateEvent(createEvent));
    }


    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Guid?>>> UpdateEvent(Guid id, UpdateEventDto updateEvent)
    {
        return Ok(await _eventService.UpdateEvent(id, updateEvent));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<bool>>> CancelEvent(Guid id)
    {
        return Ok(await _eventService.CancelEvent(id));
    }
}