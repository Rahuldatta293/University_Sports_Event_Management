using Backend.Common;
using Backend.DTOs.Stadium;
using Backend.Models;
using Backend.Services.StadiumService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StadiumController : Controller
{
    private readonly ILogger<StadiumController> _logger;
    private readonly IStadiumService _stadiumService;

    public StadiumController(IStadiumService stadiumService, ILogger<StadiumController> logger)
    {
        _stadiumService = stadiumService;
        _logger = logger;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<ServiceResponse<List<GetStadiumDto>>>> GetStadiums()
    {
        return Ok(await _stadiumService.GetStadiums());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<GetStadiumDto?>>> GetStadium(Guid id)
    {
        return Ok(await _stadiumService.GetStadiumById(id));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<GetStadiumDto>>> CreateStadium(CreateStadiumDto stadium)
    {
        return Ok(await _stadiumService.CreateStadium(stadium));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<GetStadiumDto>>> UpdateStadium(Guid id,
        UpdateStadiumDto updateStadium)
    {
        return Ok(await _stadiumService.UpdateStadium(id, updateStadium));
    }
}