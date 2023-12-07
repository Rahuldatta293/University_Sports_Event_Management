using Backend.Common;
using Backend.DTOs.Sport;

namespace Backend.Services.SportService;

public interface ISportService
{
    Task<ServiceResponse<List<GetSportDto>>> GetSports();
    Task<ServiceResponse<GetSportDto>> GetSportById(Guid id);
    Task<ServiceResponse<Guid>> CreateSport(CreateSportDto newSport);
    Task<ServiceResponse<Guid>> UpdateSport(Guid id, UpdateSportDto updateSport);
    Task<bool> SportExists(Guid id);
    Task<bool> SportExists(string name);
}