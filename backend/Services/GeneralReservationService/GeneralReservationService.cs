using AutoMapper;
using Backend.Common;
using Backend.DTOs.GeneralReservation;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.GeneralEventRepository;
using Backend.Repositories.GeneralReservationRepository;
using Backend.Repositories.UserRepository;
using Backend.Services.EmailService;
using Backend.Services.UserService;

namespace Backend.Services.GeneralReservationService;

public class GeneralReservationService : IGeneralReservationService
{
    private readonly IEmailService _emailService;
    private readonly IGeneralEventRepository _generalEventRepository;
    private readonly IGeneralReservationRepository _generalReservationRepository;
    private readonly ILogger<GeneralReservationService> _logger;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;
    private readonly IUserService _userService;


    public GeneralReservationService(
        IGeneralReservationRepository generalReservationRepository,
        IUserService userService,
        IUserRepository userRepository,
        IGeneralEventRepository generalEventRepository,
        IEmailService emailService,
        ILogger<GeneralReservationService> logger,
        IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
        _generalReservationRepository = generalReservationRepository;
        _userService = userService;
        _generalEventRepository = generalEventRepository;
        _emailService = emailService;
        _userRepository = userRepository;
    }


    public async Task<ServiceResponse<Guid?>> CancelReservation(Guid id)
    {
        var response = new ServiceResponse<Guid?>();
        var reservation = await _generalReservationRepository.GetById(id);
        if (reservation is null)
            throw new EntityNotFoundException(EntityType.Reservation);

        if (reservation.IsCancelled)
        {
            response.Message = "Reservation already cancelled";
            response.Success = false;
            return response;
        }

        reservation.IsCancelled = true;
        await _generalReservationRepository.UpdateReservation(reservation);

        var student = await _userRepository.GetUserById(reservation.StudentId);
        if (student is null)
            throw new EntityNotFoundException(EntityType.Student);

        await _emailService.SendMailAsync(
            student.Email,
            "Reservation cancelled",
            $"Your reservation for event {reservation.Event.Name} has been cancelled"
        );
        response.Data = reservation.Id;
        response.Message = "Successfully cancelled reservation";

        return response;
    }

    public async Task<ServiceResponse<List<StudentGeneralReservationDto>>> GetReservationsByEventId(Guid eventId)
    {
        var response = new ServiceResponse<List<StudentGeneralReservationDto>>();
        var reservations = await _generalReservationRepository.GetReservationsByEventId(eventId);

        response.Data = reservations.Select(r => _mapper.Map<StudentGeneralReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<List<StudentGeneralReservationDto>>> GetActiveReservationsByEventId(Guid eventId)
    {
        var response = new ServiceResponse<List<StudentGeneralReservationDto>>();
        var reservations = await _generalReservationRepository.GetActiveReservationsByEventId(eventId);

        response.Data = reservations.Select(r => _mapper.Map<StudentGeneralReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<List<GeneralEventReservationDto>>> GetReservationsByStudentId(Guid studentId)
    {
        var response = new ServiceResponse<List<GeneralEventReservationDto>>();
        var reservations = await _generalReservationRepository.GetReservationsByStudentId(studentId);

        response.Data = reservations.Select(r => _mapper.Map<GeneralEventReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<List<GeneralEventReservationDto>>> GetActiveReservationsByStudentId(
        Guid studentId)
    {
        var response = new ServiceResponse<List<GeneralEventReservationDto>>();
        var reservations = await _generalReservationRepository.GetActiveReservationsByStudentId(studentId);

        response.Data = reservations.Select(r => _mapper.Map<GeneralEventReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<Guid>> CreateReservation(CreateGeneralReservationDto newReservation)
    {
        var response = new ServiceResponse<Guid>();

        var doesStudentExist = await _userService.UserExists(newReservation.StudentId);
        if (!doesStudentExist)
            throw new EntityNotFoundException(EntityType.Student);

        var generalEvent = await _generalEventRepository.GetEventById(newReservation.EventId);
        if (generalEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        var seatsAvailable = generalEvent.Capacity - generalEvent.Reservations.Count;
        if (seatsAvailable <= 0)
            throw new NoSeatsAvailableException();


        var reservationExists = await _generalReservationRepository.IsStudentAlreadyRegistered(
            newReservation.StudentId,
            newReservation.EventId
        );
        if (reservationExists)
            throw new EntityAlreadyExistsException("You already reserved a seat for this event");

        var seatNumber = generalEvent.Name[..2].ToUpper() + new Random().Next(100, 1000);
        var reservation = new GeneralReservation
        {
            SeatNumber = seatNumber,
            EventId = newReservation.EventId,
            StudentId = newReservation.StudentId
        };

        await _generalReservationRepository.CreateReservation(reservation);

        var student = await _userRepository.GetUserById(reservation.StudentId);
        if (student is null)
            throw new EntityNotFoundException(EntityType.Student);

        await _emailService.SendMailAsync(
            student.Email,
            "Reservation created",
            $"Your have successfully reserved a seat for event {generalEvent.Name}"
        );

        response.Data = reservation.Id;
        response.Message = "Successfully created reservation";
        return response;
    }
}