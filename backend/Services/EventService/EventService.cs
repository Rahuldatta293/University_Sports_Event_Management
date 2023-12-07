using AutoMapper;
using Backend.Common;
using Backend.DTOs.Event;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.EventRepository;
using Backend.Services.ReservationService;
using Backend.Services.SportService;
using Backend.Services.StadiumService;
using Backend.Services.TeamService;
using Backend.Services.UserService;

namespace Backend.Services.EventService;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly ILogger<EventService> _logger;
    private readonly IMapper _mapper;
    private readonly IReservationService _reservationService;
    private readonly ISportService _sportService;
    private readonly IStadiumService _stadiumService;
    private readonly ITeamService _teamService;
    private readonly IUserService _userService;

    public EventService(
        IEventRepository eventRepository,
        IReservationService reservationService,
        ISportService sportService,
        IStadiumService stadiumService,
        ITeamService teamService,
        IUserService userService,
        ILogger<EventService> logger,
        IMapper mapper)
    {
        _eventRepository = eventRepository;
        _reservationService = reservationService;
        _sportService = sportService;
        _stadiumService = stadiumService;
        _teamService = teamService;
        _userService = userService;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ServiceResponse<List<GetEventDto>>> GetEvents()
    {
        var serviceResponse = new ServiceResponse<List<GetEventDto>>();
        var events = await _eventRepository.GetActiveEvents();

        serviceResponse.Data = events.Select(e => _mapper.Map<GetEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved all events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<GetEventDto?>> GetEventById(Guid id)
    {
        var serviceResponse = new ServiceResponse<GetEventDto?>();
        var sportsEvent = await _eventRepository.GetEventById(id);
        if (sportsEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        serviceResponse.Data = _mapper.Map<GetEventDto>(sportsEvent);
        serviceResponse.Message = "Successfully retrieved event";
        return serviceResponse;
    }

    public async Task<ServiceResponse<List<GetEventDto>>> GetEventsBySportId(Guid sportId)
    {
        var serviceResponse = new ServiceResponse<List<GetEventDto>>();

        var doesSportExist = await _sportService.SportExists(sportId);
        if (!doesSportExist)
            throw new EntityNotFoundException(EntityType.Sport);

        var sportsEvent = await _eventRepository.GetEventsBySportId(sportId);

        serviceResponse.Data = sportsEvent.Select(e => _mapper.Map<GetEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<List<GetEventDto>>> GetEventsByStadiumId(Guid stadiumId)
    {
        var serviceResponse = new ServiceResponse<List<GetEventDto>>();

        var doesStadiumExist = await _stadiumService.StadiumExists(stadiumId);
        if (!doesStadiumExist)
            throw new EntityNotFoundException(EntityType.Stadium);

        var sportsEvent = await _eventRepository.GetEventsByStadiumId(stadiumId);

        serviceResponse.Data = sportsEvent.Select(e => _mapper.Map<GetEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<List<GetEventDto>>> GetEventsByTeamId(Guid teamId)
    {
        var serviceResponse = new ServiceResponse<List<GetEventDto>>();

        var doesTeamExist = await _teamService.TeamExists(teamId);
        if (!doesTeamExist)
            throw new EntityNotFoundException(EntityType.Team);

        var sportsEvent = await _eventRepository.GetEventsByTeamId(teamId);

        serviceResponse.Data = sportsEvent.Select(e => _mapper.Map<GetEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<List<GetEventDto>>> GetEventsByOrganizerId(Guid organizerId)
    {
        var serviceResponse = new ServiceResponse<List<GetEventDto>>();

        var doesOrganizerExist = await _userService.UserExists(organizerId);
        if (!doesOrganizerExist)
            throw new EntityNotFoundException(EntityType.Organizer);

        var sportsEvent = await _eventRepository.GetEventsByOrganizerId(organizerId);

        serviceResponse.Data = sportsEvent.Select(e => _mapper.Map<GetEventDto>(e)).ToList();
        serviceResponse.Message = "Successfully retrieved events";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> CreateEvent(CreateEventDto newEvent)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        if (newEvent.TeamOneId == newEvent.TeamTwoId)
        {
            serviceResponse.Message = "Team one and team two cannot be the same";
            serviceResponse.Success = false;
            return serviceResponse;
        }

        var doesSportExist = await _sportService.SportExists(newEvent.SportId);
        if (!doesSportExist)
            throw new EntityNotFoundException(EntityType.Sport);

        var doesStadiumExist = await _stadiumService.StadiumExists(newEvent.StadiumId);
        if (!doesStadiumExist)
            throw new EntityNotFoundException(EntityType.Stadium);

        var doesTeamOneExist = await _teamService.TeamExists(newEvent.TeamOneId);
        if (!doesTeamOneExist)
            throw new EntityNotFoundException("Team one not found");

        var doesTeamTwoExist = await _teamService.TeamExists(newEvent.TeamTwoId);
        if (!doesTeamTwoExist)
            throw new EntityNotFoundException("Team two not found");

        var doesOrganizerExist = await _userService.UserExists(newEvent.OrganizerId);
        if (!doesOrganizerExist)
            throw new EntityNotFoundException(EntityType.Organizer);

        var doesTeamOneBelongToSport = await _teamService.DoesTeamBelongToSport(newEvent.TeamOneId, newEvent.SportId);
        if (!doesTeamOneBelongToSport)
        {
            serviceResponse.Message = "Team one does not belong to the sport";
            serviceResponse.Success = false;
            return serviceResponse;
        }

        var doesTeamTwoBelongToSport =
            await _teamService.DoesTeamBelongToSport(newEvent.TeamTwoId, newEvent.SportId);
        if (!doesTeamTwoBelongToSport)
        {
            serviceResponse.Message = "Team two does not belong to the sport";
            serviceResponse.Success = false;
            return serviceResponse;
        }

        // TODO: Check if the stadium is available at the DateTime of the event

        var createdEvent = new Event
        {
            Name = newEvent.Name,
            Description = newEvent.Description,
            StartDateTime = newEvent.StartDateTime,
            EndDateTime = newEvent.EndDateTime,
            SportId = newEvent.SportId,
            StadiumId = newEvent.StadiumId,
            TeamOneId = newEvent.TeamOneId,
            TeamTwoId = newEvent.TeamTwoId,
            OrganizerId = newEvent.OrganizerId
        };

        await _eventRepository.CreateEvent(createdEvent);

        serviceResponse.Data = createdEvent.Id;
        serviceResponse.Message = "Successfully created event";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> UpdateEvent(Guid id, UpdateEventDto updateEvent)
    {
        var serviceResponse = new ServiceResponse<Guid>();
        var sportsEvent = await _eventRepository.GetEventById(id);
        if (sportsEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        // TODO: if time is changed, check if the stadium and teams are available at the DateTime of the event

        sportsEvent.Name = updateEvent.Name;
        sportsEvent.Description = updateEvent.Description;
        sportsEvent.StartDateTime = updateEvent.StartDateTime;
        sportsEvent.EndDateTime = updateEvent.EndDateTime;

        await _eventRepository.UpdateEvent(sportsEvent);


        serviceResponse.Data = id;
        serviceResponse.Message = "Successfully updated event";
        return serviceResponse;
    }

    public async Task<ServiceResponse<bool>> CancelEvent(Guid id)
    {
        var serviceResponse = new ServiceResponse<bool>();
        var sportsEvent = await _eventRepository.GetEventById(id);
        if (sportsEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        sportsEvent.IsActive = false;

        await _eventRepository.UpdateEvent(sportsEvent);

        var reservations = await _reservationService.GetReservationsByEventId(id);

        if (!reservations.Success || reservations.Data == null) throw new EntityNotFoundException(EntityType.Event);

        foreach (var reservation in reservations.Data) await _reservationService.CancelReservation(reservation.Id);


        serviceResponse.Data = false;
        serviceResponse.Message = "Successfully cancelled event";
        return serviceResponse;
    }
}