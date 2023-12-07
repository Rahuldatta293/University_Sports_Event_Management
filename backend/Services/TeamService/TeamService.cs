using AutoMapper;
using Backend.Common;
using Backend.DTOs.Team;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.TeamRepository;
using Backend.Services.SportService;

namespace Backend.Services.TeamService;

public class TeamService : ITeamService
{
    private readonly ILogger<TeamService> _logger;
    private readonly IMapper _mapper;
    private readonly ISportService _sportService;
    private readonly ITeamRepository _teamRepository;


    public TeamService(ILogger<TeamService> logger,
        IMapper mapper, ITeamRepository teamRepository, ISportService sportService)
    {
        _logger = logger;
        _mapper = mapper;
        _teamRepository = teamRepository;
        _sportService = sportService;
    }

    public async Task<ServiceResponse<List<GetTeamDto>>> GetTeams()
    {
        var serviceResponse = new ServiceResponse<List<GetTeamDto>>();
        var teams = await _teamRepository.GetTeams();

        serviceResponse.Data = teams.Select(t => _mapper.Map<GetTeamDto>(t)).ToList();
        serviceResponse.Message = "Successfully retrieved teams";
        return serviceResponse;
    }

    public async Task<ServiceResponse<List<GetTeamDto>>> GetTeamsBySportId(Guid sportId)
    {
        var serviceResponse = new ServiceResponse<List<GetTeamDto>>();

        var doesSportExist = await _sportService.SportExists(sportId);
        if (!doesSportExist)
            throw new EntityNotFoundException(EntityType.Sport);

        var teams = await _teamRepository.GetTeamsBySportId(sportId);

        serviceResponse.Data = teams.Select(t => _mapper.Map<GetTeamDto>(t)).ToList();
        serviceResponse.Message = "Successfully retrieved team";
        return serviceResponse;
    }

    public async Task<ServiceResponse<GetTeamDto>> GetTeamById(Guid id)
    {
        var serviceResponse = new ServiceResponse<GetTeamDto>();
        var team = await _teamRepository.GetTeamById(id);

        if (team == null)
            throw new EntityNotFoundException(EntityType.Team);

        serviceResponse.Data = _mapper.Map<GetTeamDto>(team);
        serviceResponse.Message = "Successfully retrieved team";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> UpdateTeam(Guid id, UpdateTeamDto updateTeam)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var team = await _teamRepository.GetTeamById(id);
        if (team is null)
            throw new EntityNotFoundException(EntityType.Team);

        team.Name = updateTeam.Name;
        team.SportId = updateTeam.SportId;
        await _teamRepository.UpdateTeam(team);

        serviceResponse.Data = id;
        serviceResponse.Message = "Successfully updated team";
        return serviceResponse;
    }

    public async Task<bool> TeamExists(string name)
    {
        return await _teamRepository.TeamExists(name);
    }

    public async Task<bool> DoesTeamBelongToSport(Guid teamId, Guid sportId)
    {
        return await _teamRepository.DoesTeamBelongToSport(teamId, sportId);
    }

    public async Task<bool> TeamExists(Guid id)
    {
        return await _teamRepository.TeamExists(id);
    }

    public async Task<ServiceResponse<Guid>> CreateTeam(CreateTeamDto newTeam)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var doesTeamExist = await _teamRepository.TeamExists(newTeam.Name);
        if (doesTeamExist)
            throw new EntityAlreadyExistsException(EntityType.Team);

        var createdTeam = new Team
        {
            Name = newTeam.Name,
            SportId = newTeam.SportId
        };

        await _teamRepository.CreateTeam(createdTeam);

        serviceResponse.Data = createdTeam.Id;
        serviceResponse.Message = "Successfully created team";
        return serviceResponse;
    }
}