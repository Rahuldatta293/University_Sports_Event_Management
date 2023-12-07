using Backend.Common;
using Backend.DTOs.Stadium;
using Backend.Models;

namespace Backend.Services.StadiumService;

public interface IStadiumService
{
    Task<ServiceResponse<List<GetStadiumDto>>> GetStadiums();
    Task<ServiceResponse<GetStadiumDto>> GetStadiumById(Guid id);
    Task<ServiceResponse<Guid>> CreateStadium(CreateStadiumDto newStadium);
    Task<ServiceResponse<Guid>> UpdateStadium(Guid id, UpdateStadiumDto updateStadium);
    Task<bool> StadiumExists(Guid id);
    Task<bool> StadiumExists(string name);
}