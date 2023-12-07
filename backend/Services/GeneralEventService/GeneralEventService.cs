using AutoMapper;
using Backend.Common;
using Backend.DTOs.GeneralEvent;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.GeneralEventRepository;
using Backend.Services.ReservationService;
using Backend.Services.UserService;

namespace Backend.Services.GeneralEventService;

public class GeneralEventService : IGeneralEventService
{
    private readonly IGeneralEventRepository _generalEventRepository;
    private readonly ILogger<GeneralEventService> _logger;
    private readonly IMapper _mapper;
    private readonly IReservationService _reservationService;
    private readonly IUserService _userService;

    public GeneralEventService(
        IGeneralEventRepository generalEventRepository,
        IReservationService reservationService,
        IUserService userService,
        ILogger<GeneralEventService> logger,
        IMapper mapper)
    {
        _generalEventRepository = generalEventRepository;
        _reservationService = reservationService;
        _userService = userService;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ServiceResponse<List<GetGeneralEventDto>>> GetEvents()
    {
        var serviceResponse = new ServiceResponse<List<GetGeneralEventDto>>();
        var events = await _generalEventRepository.GetActiveEvents();

        serviceResponse.Data = events.Select(e => _mapper.Map<GetGeneralEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved all general events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<bool>> CancelEvent(Guid id)
    {
        var serviceResponse = new ServiceResponse<bool>();
        var generalEvent = await _generalEventRepository.GetEventById(id);
        if (generalEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        generalEvent.IsActive = false;

        await _generalEventRepository.UpdateEvent(generalEvent);

        var reservations = await _reservationService.GetReservationsByEventId(id);

        if (!reservations.Success || reservations.Data == null) throw new EntityNotFoundException(EntityType.Event);

        foreach (var reservation in reservations.Data) await _reservationService.CancelReservation(reservation.Id);


        serviceResponse.Data = false;
        serviceResponse.Message = "Successfully cancelled event";
        return serviceResponse;
    }

    public async Task<ServiceResponse<GetGeneralEventDto?>> GetEventById(Guid id)
    {
        var serviceResponse = new ServiceResponse<GetGeneralEventDto?>();
        var generalEvent = await _generalEventRepository.GetEventById(id);
        if (generalEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        serviceResponse.Data = _mapper.Map<GetGeneralEventDto>(generalEvent);
        serviceResponse.Message = "Successfully retrieved event";
        return serviceResponse;
    }

    public async Task<ServiceResponse<List<GetGeneralEventDto>>> GetEventsByOrganizerId(Guid organizerId)
    {
        var serviceResponse = new ServiceResponse<List<GetGeneralEventDto>>();

        var doesOrganizerExist = await _userService.UserExists(organizerId);
        if (!doesOrganizerExist)
            throw new EntityNotFoundException(EntityType.Organizer);

        var sportsEvent = await _generalEventRepository.GetEventsByOrganizerId(organizerId);

        serviceResponse.Data = sportsEvent.Select(e => _mapper.Map<GetGeneralEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved general events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> CreateEvent(CreateGeneralEventDto newEvent)
    {
        var serviceResponse = new ServiceResponse<Guid>();


        var doesOrganizerExist = await _userService.UserExists(newEvent.OrganizerId);
        if (!doesOrganizerExist)
            throw new EntityNotFoundException(EntityType.Organizer);

        var createdEvent = new GeneralEvent
        {
            Name = newEvent.Name,
            Description = newEvent.Description,
            StartDateTime = newEvent.StartDateTime,
            EndDateTime = newEvent.EndDateTime,
            OrganizerId = newEvent.OrganizerId,
            Capacity = newEvent.Capacity,
            AddressLine1 = newEvent.AddressLine1,
            AddressLine2 = newEvent.AddressLine2,
            City = newEvent.City,
            State = newEvent.State,
            ZipCode = newEvent.ZipCode
        };

        await _generalEventRepository.CreateEvent(createdEvent);

        serviceResponse.Data = createdEvent.Id;
        serviceResponse.Message = "Successfully created general event";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> UpdateEvent(Guid id, UpdateGeneralEventDto updateEvent)
    {
        var serviceResponse = new ServiceResponse<Guid>();
        var generalEvent = await _generalEventRepository.GetEventById(id);
        if (generalEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        generalEvent.Name = updateEvent.Name;
        generalEvent.Description = updateEvent.Description;
        generalEvent.StartDateTime = updateEvent.StartDateTime;
        generalEvent.EndDateTime = updateEvent.EndDateTime;
        generalEvent.Capacity = updateEvent.Capacity;
        generalEvent.AddressLine1 = updateEvent.AddressLine1;
        generalEvent.AddressLine2 = updateEvent.AddressLine2;
        generalEvent.City = updateEvent.City;
        generalEvent.State = updateEvent.State;
        generalEvent.ZipCode = updateEvent.ZipCode;

        await _generalEventRepository.UpdateEvent(generalEvent);

        serviceResponse.Data = id;
        serviceResponse.Message = "Successfully updated general event";
        return serviceResponse;
    }
}