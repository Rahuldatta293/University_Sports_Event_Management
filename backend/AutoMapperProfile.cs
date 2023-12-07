using AutoMapper;
using Backend.DTOs.Event;
using Backend.DTOs.GeneralEvent;
using Backend.DTOs.GeneralReservation;
using Backend.DTOs.Reservation;
using Backend.DTOs.Sport;
using Backend.DTOs.Stadium;
using Backend.DTOs.Team;
using Backend.DTOs.User;
using Backend.Models;

namespace Backend;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User
        CreateMap<User, BaseUserDto>();
        CreateMap<User, GetUserDto>();
        CreateMap<User, LoginUserDto>();
        CreateMap<User, UpdateUserDto>();
        CreateMap<User, CreateUserDto>();

        // Stadium
        CreateMap<Stadium, BaseStadiumDto>();
        CreateMap<Stadium, CreateStadiumDto>();
        CreateMap<Stadium, GetStadiumDto>();
        CreateMap<Stadium, UpdateStadiumDto>();

        // Sport
        CreateMap<Sport, BaseSportDto>();
        CreateMap<Sport, CreateSportDto>();
        CreateMap<Sport, UpdateSportDto>();
        CreateMap<Sport, GetSportDto>();

        // Team
        CreateMap<Team, BaseTeamDto>();
        CreateMap<Team, CreateTeamDto>();
        CreateMap<Team, UpdateTeamDto>();
        CreateMap<Team, GetTeamDto>();

        // Event
        CreateMap<Event, BaseEventDto>();
        CreateMap<Event, GetEventDto>()
            .ForMember(dest => dest.Capacity, opt => opt.MapFrom(src => src.Stadium.Capacity))
            .ForMember(dest => dest.ReservedSeats, opt =>
                opt.MapFrom(src => src.Reservations.Count(r => !r.IsCancelled)
                ));
        CreateMap<Event, CreateEventDto>();
        CreateMap<Event, UpdateEventDto>();

        // General Event
        CreateMap<GeneralEvent, BaseGeneralEventDto>();
        CreateMap<GeneralEvent, GetGeneralEventDto>()
            .ForMember(dest => dest.ReservedSeats, opt =>
                opt.MapFrom(src => src.Reservations.Count(r => !r.IsCancelled)
                ));
        CreateMap<GeneralEvent, CreateGeneralEventDto>();
        CreateMap<GeneralEvent, UpdateGeneralEventDto>();

        // Reservation
        CreateMap<Reservation, BaseReservationDto>();
        CreateMap<Reservation, EventReservationDto>();
        CreateMap<Reservation, CreateReservationDto>();
        CreateMap<Reservation, StudentReservationDto>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.User));

        // General Reservation
        CreateMap<GeneralReservation, BaseGeneralReservationDto>();
        CreateMap<GeneralReservation, GeneralEventReservationDto>();
        CreateMap<GeneralReservation, CreateGeneralReservationDto>();
        CreateMap<GeneralReservation, StudentGeneralReservationDto>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.User));
    }
}