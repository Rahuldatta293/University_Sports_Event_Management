using Backend.Common;
using Backend.DTOs.Event;
using Backend.DTOs.GeneralEvent;
using Backend.Models;
using Backend.Services.GeneralEventService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeneralEventController : Controller
{
    private readonly IGeneralEventService _generalEventService;
    private readonly ILogger<GeneralEventController> _logger;

    public GeneralEventController(IGeneralEventService generalEventService, ILogger<GeneralEventController> logger)
    {
        _generalEventService = generalEventService;
        _logger = logger;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<ServiceResponse<List<GetGeneralEventDto>>>> GetEvents()
    {
        return Ok(await _generalEventService.GetEvents());
    }

    [HttpGet("GetById/{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Team?>>> GetEventById(Guid id)
    {
        return Ok(await _generalEventService.GetEventById(id));
    }

    [HttpGet("GetEventsByOrganizerId/{organizerId:guid}")]
    public async Task<ActionResult<ServiceResponse<GetEventDto?>>> GetEventByOrganizerId(Guid organizerId)
    {
        return Ok(await _generalEventService.GetEventsByOrganizerId(organizerId));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<Guid?>>> CreateEvent(CreateGeneralEventDto createEvent)
    {
        return Ok(await _generalEventService.CreateEvent(createEvent));
    }


    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Guid?>>> UpdateEvent(Guid id, UpdateGeneralEventDto updateEvent)
    {
        return Ok(await _generalEventService.UpdateEvent(id, updateEvent));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<bool>>> CancelEvent(Guid id)
    {
        return Ok(await _generalEventService.CancelEvent(id));
    }
}