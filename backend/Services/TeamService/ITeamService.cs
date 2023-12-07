using Backend.Common;
using Backend.DTOs.Team;

namespace Backend.Services.TeamService;

public interface ITeamService
{
    Task<ServiceResponse<List<GetTeamDto>>> GetTeams();
    Task<ServiceResponse<GetTeamDto>> GetTeamById(Guid id);
    Task<ServiceResponse<List<GetTeamDto>>> GetTeamsBySportId(Guid sportId);
    Task<ServiceResponse<Guid>> CreateTeam(CreateTeamDto newTeam);
    Task<ServiceResponse<Guid>> UpdateTeam(Guid id, UpdateTeamDto updateTeam);
    Task<bool> TeamExists(Guid id);
    Task<bool> TeamExists(string name);
    Task<bool> DoesTeamBelongToSport(Guid teamId, Guid sportId);
}