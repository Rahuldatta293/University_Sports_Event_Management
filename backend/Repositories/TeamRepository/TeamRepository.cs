using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.TeamRepository;

public class TeamRepository : ITeamRepository
{
    private readonly DataContext _context;
    private readonly ILogger<TeamRepository> _logger;


    public TeamRepository(DataContext context, ILogger<TeamRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Team>> GetTeams()
    {
        return await _context.Team
            .Include(t => t.Sport)
            .ToListAsync();
    }

    public async Task<List<Team>> GetTeamsBySportId(Guid sportId)
    {
        return await _context.Team
            .Where(t => t.SportId == sportId)
            .Include(t => t.Sport)
            .ToListAsync();
    }

    public async Task<Team?> GetTeamById(Guid id)
    {
        return await _context.Team
            .Include(t => t.Sport)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Team> CreateTeam(Team team)
    {
        team.Id = Guid.NewGuid();
        _context.Team.Add(team);
        await _context.SaveChangesAsync();
        return team;
    }

    public async Task<Team> UpdateTeam(Team team)
    {
        _context.Team.Update(team);
        await _context.SaveChangesAsync();
        return team;
    }

    public async Task<bool> TeamExists(string name)
    {
        return await _context.Team.AnyAsync(t => t.Name.ToLower() == name.Trim().ToLower());
    }

    public async Task<bool> DoesTeamBelongToSport(Guid teamId, Guid sportId)
    {
        return await _context.Team.AnyAsync(t => t.Id == teamId && t.SportId == sportId);
    }

    public async Task<bool> TeamExists(Guid id)
    {
        return await _context.Team.AnyAsync(t => t.Id == id);
    }
}