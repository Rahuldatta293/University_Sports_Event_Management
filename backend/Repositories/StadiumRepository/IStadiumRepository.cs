using Backend.Models;

namespace Backend.Repositories.StadiumRepository;

public interface IStadiumRepository
{
    Task<List<Stadium>> GetStadiums();
    Task<Stadium?> GetStadiumById(Guid id);
    Task<Stadium> CreateStadium(Stadium stadium);
    Task<Stadium> UpdateStadium(Stadium stadium);
    Task<bool> StadiumExists(Guid id);
    Task<bool> StadiumExists(string name);
}