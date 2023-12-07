using AutoMapper;
using Backend.Common;
using Backend.DTOs.Stadium;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.StadiumRepository;

namespace Backend.Services.StadiumService;

public class StadiumService : IStadiumService
{
    private readonly ILogger<StadiumService> _logger;
    private readonly IMapper _mapper;
    private readonly IStadiumRepository _stadiumRepository;

    public StadiumService(IStadiumRepository stadiumRepository, ILogger<StadiumService> logger,
        IMapper mapper)
    {
        _stadiumRepository = stadiumRepository;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ServiceResponse<List<GetStadiumDto>>> GetStadiums()
    {
        var serviceResponse = new ServiceResponse<List<GetStadiumDto>>();
        var stadiums = await _stadiumRepository.GetStadiums();

        serviceResponse.Data = stadiums.Select(s => _mapper.Map<GetStadiumDto>(s)).ToList();
        serviceResponse.Message = "Stadiums retrieved successfully";
        serviceResponse.Success = true;

        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> CreateStadium(CreateStadiumDto newStadium)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var doesStadiumExist = await _stadiumRepository.StadiumExists(newStadium.Name);
        if (doesStadiumExist)
            throw new EntityAlreadyExistsException(EntityType.Stadium);


        var createdStadium = new Stadium
        {
            Name = newStadium.Name,
            Capacity = newStadium.Capacity,
            AddressLine1 = newStadium.AddressLine1,
            AddressLine2 = newStadium.AddressLine2,
            City = newStadium.City,
            State = newStadium.State,
            ZipCode = newStadium.ZipCode
        };

        await _stadiumRepository.CreateStadium(createdStadium);

        serviceResponse.Data = createdStadium.Id;
        serviceResponse.Message = "Stadium created successfully";
        return serviceResponse;
    }

    public async Task<ServiceResponse<GetStadiumDto>> GetStadiumById(Guid id)
    {
        var serviceResponse = new ServiceResponse<GetStadiumDto>();
        var stadium = await _stadiumRepository.GetStadiumById(id);
        if (stadium is null)
            throw new EntityNotFoundException(EntityType.Stadium);

        serviceResponse.Data = _mapper.Map<GetStadiumDto>(stadium);
        serviceResponse.Message = "Stadium retrieved successfully";

        return serviceResponse;
    }

    public async Task<bool> StadiumExists(Guid id)
    {
        return await _stadiumRepository.StadiumExists(id);
    }

    public async Task<bool> StadiumExists(string name)
    {
        return await _stadiumRepository.StadiumExists(name);
    }

    public async Task<ServiceResponse<Guid>> UpdateStadium(Guid id, UpdateStadiumDto updatedStadium)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var stadium = await _stadiumRepository.GetStadiumById(id);
        if (stadium is null)
            throw new EntityNotFoundException(EntityType.Stadium);

        stadium.Name = updatedStadium.Name;
        stadium.Capacity = updatedStadium.Capacity;
        stadium.AddressLine1 = updatedStadium.AddressLine1;
        stadium.AddressLine2 = updatedStadium.AddressLine2;
        stadium.City = updatedStadium.City;
        stadium.State = updatedStadium.State;
        stadium.ZipCode = updatedStadium.ZipCode;

        await _stadiumRepository.UpdateStadium(stadium);

        serviceResponse.Data = stadium.Id;
        serviceResponse.Message = "Stadium updated successfully";
        return serviceResponse;
    }
}