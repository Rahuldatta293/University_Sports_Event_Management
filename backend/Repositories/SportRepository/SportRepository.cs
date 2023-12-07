using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.SportRepository;

public class SportRepository : ISportRepository
{
    private readonly DataContext _context;
    private readonly ILogger<SportRepository> _logger;


    public SportRepository(DataContext context, ILogger<SportRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Sport>> GetSports()
    {
        return await _context.Sport
            .Include(s => s.Teams)
            .ToListAsync();
    }

    public async Task<Sport?> GetSportById(Guid id)
    {
        return await _context.Sport
            .Include(s => s.Teams)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Sport> UpdateSport(Sport sport)
    {
        _context.Sport.Update(sport);
        await _context.SaveChangesAsync();

        return sport;
    }

    public async Task<bool> SportExists(string name)
    {
        return await _context.Sport.AnyAsync(s => s.Name.ToLower() == name.ToLower());
    }

    public Task<bool> SportExists(Guid id)
    {
        return _context.Sport.AnyAsync(s => s.Id == id);
    }

    public async Task<Sport> CreateSport(Sport sport)
    {
        sport.Id = Guid.NewGuid();

        _context.Sport.Add(sport);
        await _context.SaveChangesAsync();

        return sport;
    }
}