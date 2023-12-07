using Backend.Common;
using Backend.DTOs.Sport;
using Backend.Models;
using Backend.Services.SportService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportController : Controller
{
    private readonly ILogger<SportController> _logger;
    private readonly ISportService _sportService;

    public SportController(ISportService sportService, ILogger<SportController> logger)
    {
        _sportService = sportService;
        _logger = logger;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<ServiceResponse<List<Sport>>>> GetSports()
    {
        return Ok(await _sportService.GetSports());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Sport?>>> GetSportById(Guid id)
    {
        return Ok(await _sportService.GetSportById(id));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<Sport>>> CreateSport(CreateSportDto newSport)
    {
        return Ok(await _sportService.CreateSport(newSport));
    }


    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Sport?>>> UpdateSport(Guid id, UpdateSportDto updateSport)
    {
        return Ok(await _sportService.UpdateSport(id, updateSport));
    }
}