using Backend.Models;

namespace Backend.Repositories.TeamRepository;

public interface ITeamRepository
{
    Task<List<Team>> GetTeams();
    Task<Team?> GetTeamById(Guid id);
    Task<List<Team>> GetTeamsBySportId(Guid sportId);
    Task<Team> CreateTeam(Team team);
    Task<Team> UpdateTeam(Team team);
    Task<bool> TeamExists(Guid id);
    Task<bool> TeamExists(string name);
    Task<bool> DoesTeamBelongToSport(Guid teamId, Guid sportId);
}