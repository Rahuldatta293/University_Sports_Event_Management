using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.StadiumRepository;

public class StadiumRepository : IStadiumRepository
{
    private readonly DataContext _context;
    private readonly ILogger<StadiumRepository> _logger;

    public StadiumRepository(DataContext context, ILogger<StadiumRepository> logger
    )
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Stadium>> GetStadiums()
    {
        return await _context.Stadium
            .Include(s => s.Events)
            .ToListAsync();
    }

    public async Task<bool> StadiumExists(Guid id)
    {
        return await _context.Stadium.AnyAsync(s => s.Id == id);
    }

    public async Task<bool> StadiumExists(string name)
    {
        return await _context.Stadium.AnyAsync(s => s.Name.ToLower() == name.Trim().ToLower());
    }

    public async Task<Stadium> CreateStadium(Stadium stadium)
    {
        stadium.Id = Guid.NewGuid();
        _context.Stadium.Add(stadium);
        await _context.SaveChangesAsync();

        return stadium;
    }

    public async Task<Stadium?> GetStadiumById(Guid id)
    {
        return await _context.Stadium
            .Include(s => s.Events)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Stadium> UpdateStadium(Stadium stadium)
    {
        _context.Stadium.Update(stadium);
        await _context.SaveChangesAsync();

        return stadium;
    }
}