using AutoMapper;
using Backend.Common;
using Backend.DTOs.Sport;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.SportRepository;

namespace Backend.Services.SportService;

public class SportService : ISportService
{
    private readonly ILogger<SportService> _logger;
    private readonly IMapper _mapper;
    private readonly ISportRepository _sportRepository;

    public SportService(ISportRepository sportRepository, ILogger<SportService> logger,
        IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
        _sportRepository = sportRepository;
    }

    public async Task<ServiceResponse<List<GetSportDto>>> GetSports()
    {
        var serviceResponse = new ServiceResponse<List<GetSportDto>>();
        var sports = await _sportRepository.GetSports();

        serviceResponse.Data = sports.Select(s => _mapper.Map<GetSportDto>(s)).ToList();
        serviceResponse.Message = "Sports retrieved successfully";
        return serviceResponse;
    }

    public async Task<ServiceResponse<GetSportDto>> GetSportById(Guid id)
    {
        var serviceResponse = new ServiceResponse<GetSportDto>();
        var sport = await _sportRepository.GetSportById(id);
        if (sport is null)
            throw new EntityNotFoundException(EntityType.Sport);

        serviceResponse.Data = _mapper.Map<GetSportDto>(sport);
        serviceResponse.Message = "Sport retrieved successfully";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> UpdateSport(Guid id, UpdateSportDto updateSport)
    {
        var serviceResponse = new ServiceResponse<Guid>();
        var sport = await _sportRepository.GetSportById(id);
        if (sport == null)
            throw new EntityNotFoundException(EntityType.Sport);

        sport.Name = updateSport.Name;
        sport.Description = updateSport.Description;

        await _sportRepository.UpdateSport(sport);

        serviceResponse.Data = sport.Id;
        serviceResponse.Message = "Sport updated successfully";
        return serviceResponse;
    }

    public async Task<bool> SportExists(string name)
    {
        return await _sportRepository.SportExists(name);
    }

    public async Task<bool> SportExists(Guid id)
    {
        return await _sportRepository.SportExists(id);
    }

    public async Task<ServiceResponse<Guid>> CreateSport(CreateSportDto newSport)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var doesSportExist = await _sportRepository.SportExists(newSport.Name);
        if (doesSportExist)
            throw new EntityAlreadyExistsException(EntityType.Sport);

        var createdSport = new Sport
        {
            Name = newSport.Name,
            Description = newSport.Description
        };

        await _sportRepository.CreateSport(createdSport);

        serviceResponse.Data = createdSport.Id;
        serviceResponse.Message = "Sport created successfully";
        return serviceResponse;
    }
}