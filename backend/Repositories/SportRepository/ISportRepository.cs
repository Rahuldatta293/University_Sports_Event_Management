using Backend.Models;

namespace Backend.Repositories.SportRepository;

public interface ISportRepository
{
    Task<List<Sport>> GetSports();
    Task<Sport?> GetSportById(Guid id);
    Task<Sport> CreateSport(Sport sport);
    Task<Sport> UpdateSport(Sport sport);
    Task<bool> SportExists(Guid id);
    Task<bool> SportExists(string name);
}