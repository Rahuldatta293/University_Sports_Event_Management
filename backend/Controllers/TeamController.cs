using Backend.Common;
using Backend.DTOs.Team;
using Backend.Models;
using Backend.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamController : Controller
{
    private readonly ILogger<TeamController> _logger;
    private readonly ITeamService _teamService;

    public TeamController(ITeamService teamService, ILogger<TeamController> logger)
    {
        _logger = logger;
        _teamService = teamService;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<ServiceResponse<List<Team>>>> GetTeams()
    {
        return Ok(await _teamService.GetTeams());
    }

    [HttpGet("GetById/{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Team?>>> GetTeamById(Guid id)
    {
        return Ok(await _teamService.GetTeamById(id));
    }

    [HttpGet("GetTeamsBySportId/{sportId:guid}")]
    public async Task<ActionResult<ServiceResponse<Team?>>> GetTeamsBySportId(Guid sportId)
    {
        return Ok(await _teamService.GetTeamsBySportId(sportId));
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<Team>>> CreateTeam(CreateTeamDto createTeam)
    {
        return Ok(await _teamService.CreateTeam(createTeam));
    }


    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceResponse<Team>>> UpdateTeam(Guid id, UpdateTeamDto updateTeam)
    {
        return Ok(await _teamService.UpdateTeam(id, updateTeam));
    }
}