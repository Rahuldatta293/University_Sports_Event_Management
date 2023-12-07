using AutoMapper;
using Backend.Common;
using Backend.DTOs.Reservation;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.EventRepository;
using Backend.Repositories.ReservationRepository;
using Backend.Repositories.UserRepository;
using Backend.Services.EmailService;
using Backend.Services.UserService;

namespace Backend.Services.ReservationService;

public class ReservationService : IReservationService
{
    private readonly IEmailService _emailService;
    private readonly IEventRepository _eventRepository;
    private readonly ILogger<ReservationService> _logger;
    private readonly IMapper _mapper;
    private readonly IReservationRepository _reservationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUserService _userService;


    public ReservationService(
        IReservationRepository reservationRepository,
        IUserService userService,
        IUserRepository userRepository,
        IEventRepository eventRepository,
        IEmailService emailService,
        ILogger<ReservationService> logger,
        IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
        _reservationRepository = reservationRepository;
        _userService = userService;
        _eventRepository = eventRepository;
        _emailService = emailService;
        _userRepository = userRepository;
    }

    public async Task<ServiceResponse<Guid>> CreateReservation(CreateReservationDto newReservation)
    {
        var response = new ServiceResponse<Guid>();

        var doesStudentExist = await _userService.UserExists(newReservation.StudentId);
        if (!doesStudentExist)
            throw new EntityNotFoundException(EntityType.Student);

        var sportEvent = await _eventRepository.GetEventById(newReservation.EventId);
        if (sportEvent is null)
            throw new EntityNotFoundException(EntityType.Event);

        var seatsAvailable = sportEvent.Stadium.Capacity - sportEvent.Reservations.Count;
        if (seatsAvailable <= 0)
            throw new NoSeatsAvailableException();

        var reservationExists = await _reservationRepository.IsStudentAlreadyRegistered(
            newReservation.StudentId,
            newReservation.EventId
        );
        if (reservationExists)
            throw new EntityAlreadyExistsException("You already reserved a seat for this event");

        var seatNumber = sportEvent.Stadium.Name[..2].ToUpper() + new Random().Next(100, 1000);
        var reservation = new Reservation
        {
            SeatNumber = seatNumber,
            EventId = newReservation.EventId,
            StudentId = newReservation.StudentId
        };

        await _reservationRepository.CreateReservation(reservation);

        var student = await _userRepository.GetUserById(reservation.StudentId);
        if (student is null)
            throw new EntityNotFoundException(EntityType.Student);

        await _emailService.SendMailAsync(
            student.Email,
            "Reservation created",
            $"Your have successfully reserved a seat for event {sportEvent.Name}"
        );

        response.Data = reservation.Id;
        response.Message = "Successfully created reservation";
        return response;
    }

    public async Task<ServiceResponse<Guid?>> CancelReservation(Guid id)
    {
        var response = new ServiceResponse<Guid?>();
        var reservation = await _reservationRepository.GetById(id);
        if (reservation is null)
            throw new EntityNotFoundException(EntityType.Reservation);

        if (reservation.IsCancelled)
        {
            response.Message = "Reservation already cancelled";
            response.Success = false;
            return response;
        }

        reservation.IsCancelled = true;
        await _reservationRepository.UpdateReservation(reservation);

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

    public async Task<ServiceResponse<List<StudentReservationDto>>> GetReservationsByEventId(Guid eventId)
    {
        var response = new ServiceResponse<List<StudentReservationDto>>();
        var reservations = await _reservationRepository.GetReservationsByEventId(eventId);

        response.Data = reservations.Select(r => _mapper.Map<StudentReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<List<StudentReservationDto>>> GetActiveReservationsByEventId(Guid eventId)
    {
        var response = new ServiceResponse<List<StudentReservationDto>>();
        var reservations = await _reservationRepository.GetActiveReservationsByEventId(eventId);

        response.Data = reservations.Select(r => _mapper.Map<StudentReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<List<EventReservationDto>>> GetReservationsByStudentId(Guid studentId)
    {
        var response = new ServiceResponse<List<EventReservationDto>>();
        var reservations = await _reservationRepository.GetReservationsByStudentId(studentId);

        response.Data = reservations.Select(r => _mapper.Map<EventReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }

    public async Task<ServiceResponse<List<EventReservationDto>>> GetActiveReservationsByStudentId(Guid studentId)
    {
        var response = new ServiceResponse<List<EventReservationDto>>();
        var reservations = await _reservationRepository.GetActiveReservationsByStudentId(studentId);

        response.Data = reservations.Select(r => _mapper.Map<EventReservationDto>(r)).ToList();
        response.Message = "Successfully retrieved reservations";
        return response;
    }
}