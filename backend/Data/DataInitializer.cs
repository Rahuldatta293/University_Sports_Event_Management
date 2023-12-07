using Backend.Enums;
using Backend.Models;
using Backend.Services.PasswordService;

namespace Backend.Data;

public class DataInitializer
{
    private readonly IPasswordService _passwordService;

    public DataInitializer(IPasswordService passwordService)
    {
        _passwordService = passwordService;
    }

    public void Initialize(DataContext context)
    {
        context.Database.EnsureCreated();

        // Seed data (if empty)
        InitializeUsers(context);
        InitializeStadiums(context);
        InitializeSports(context);
        InitializeTeams(context);
        InitializeEvents(context);
        InitializeGeneralEvents(context);
    }

    private void InitializeUsers(DataContext context)
    {
        if (context.User.Any()) return;

        var hashedPassword = _passwordService.HashPassword("password");

        context.User.AddRange(new List<User>
        {
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000001"),
                Name = "Super Admin",
                Email = "superadmin@app.com",
                Password = hashedPassword,
                Role = UserRole.SuperAdmin,
                IsActive = true,
                AddressLine1 = "123 Main Street",
                AddressLine2 = "Apartment 1",
                City = "New York",
                State = "New York",
                ZipCode = "10001"
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000002"),
                Name = "Rahul",
                Email = "bitrarahuldatta@gmail.com",
                Password = hashedPassword,
                Role = UserRole.Admin,
                IsActive = true,
                AddressLine1 = "234 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001"
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000003"),
                Name = "Soumya",
                Email = "Soumyakonda048@gmail.com",
                Password = hashedPassword,
                Role = UserRole.Organizer,
                IsActive = true,
                AddressLine1 = "345 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001"
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000004"),
                Name = "Mahendra",
                Email = "mahendrarayavarapu557@gmail.com",
                Password = hashedPassword,
                Role = UserRole.Student,
                IsActive = true,
                AddressLine1 = "456 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001"
            }
        });

        context.SaveChanges();
    }

    private static void InitializeStadiums(DataContext context)
    {
        if (context.Stadium.Any()) return;

        context.Stadium.AddRange(new List<Stadium>
        {
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000001"),
                Name = "Stadium 1",
                AddressLine1 = "456 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001",
                Capacity = 1000
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000002"),
                Name = "Stadium 2",
                AddressLine1 = "456 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001",
                Capacity = 2000
            }
        });

        context.SaveChanges();
    }

    private static void InitializeSports(DataContext context)
    {
        if (context.Sport.Any()) return;

        context.Sport.AddRange(new List<Sport>
        {
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000001"),
                Name = "Sport 1",
                Description = "Description 1"
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000002"),
                Name = "Sport 2",
                Description = "Description 2"
            }
        });

        context.SaveChanges();
    }

    private static void InitializeTeams(DataContext context)
    {
        if (context.Team.Any()) return;

        context.Team.AddRange(new List<Team>
        {
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000001"),
                Name = "Team 1",
                SportId = new Guid("00000000-0000-0000-0000-000000000001")
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000002"),
                Name = "Team 2",
                SportId = new Guid("00000000-0000-0000-0000-000000000001")
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000003"),
                Name = "Team 3",
                SportId = new Guid("00000000-0000-0000-0000-000000000002")
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000004"),
                Name = "Team 4",
                SportId = new Guid("00000000-0000-0000-0000-000000000002")
            }
        });

        context.SaveChanges();
    }

    private static void InitializeEvents(DataContext context)
    {
        if (context.Event.Any()) return;

        context.Event.AddRange(new List<Event>
        {
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000001"),
                Name = "Event 1",
                Description = "Description 1",
                StartDateTime = DateTime.UtcNow.Date.Add(new TimeSpan(15, 30, 00)),
                EndDateTime = DateTime.UtcNow.Date.Add(new TimeSpan(18, 30, 00)),
                SportId = new Guid("00000000-0000-0000-0000-000000000001"),
                TeamOneId = new Guid("00000000-0000-0000-0000-000000000001"),
                TeamTwoId = new Guid("00000000-0000-0000-0000-000000000002"),
                StadiumId = new Guid("00000000-0000-0000-0000-000000000001"),
                OrganizerId = new Guid("00000000-0000-0000-0000-000000000003")
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000002"),
                Name = "Event 2",
                Description = "Description 2",
                StartDateTime = DateTime.UtcNow.Date.AddDays(1).Add(new TimeSpan(15, 30, 00)),
                EndDateTime = DateTime.UtcNow.Date.AddDays(1).Add(new TimeSpan(18, 30, 00)),
                SportId = new Guid("00000000-0000-0000-0000-000000000002"),
                TeamOneId = new Guid("00000000-0000-0000-0000-000000000003"),
                TeamTwoId = new Guid("00000000-0000-0000-0000-000000000004"),
                StadiumId = new Guid("00000000-0000-0000-0000-000000000002"),
                OrganizerId = new Guid("00000000-0000-0000-0000-000000000003")
            }
        });

        context.SaveChanges();
    }

    private static void InitializeGeneralEvents(DataContext context)
    {
        if (context.GeneralEvent.Any()) return;

        context.GeneralEvent.AddRange(new List<GeneralEvent>
        {
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000001"),
                Name = "General Event 1",
                Description = "General Description 1",
                StartDateTime = DateTime.UtcNow.Date.Add(new TimeSpan(15, 30, 00)),
                EndDateTime = DateTime.UtcNow.Date.Add(new TimeSpan(18, 30, 00)),
                OrganizerId = new Guid("00000000-0000-0000-0000-000000000003"),
                Capacity = 1000,
                AddressLine1 = "456 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001"
            },
            new()
            {
                Id = new Guid("00000000-0000-0000-0000-000000000002"),
                Name = "General Event 2",
                Description = "General Description 2",
                StartDateTime = DateTime.UtcNow.Date.AddDays(1).Add(new TimeSpan(15, 30, 00)),
                EndDateTime = DateTime.UtcNow.Date.AddDays(1).Add(new TimeSpan(18, 30, 00)),
                OrganizerId = new Guid("00000000-0000-0000-0000-000000000003"),
                Capacity = 1000,
                AddressLine1 = "456 Main Street",
                City = "New York",
                State = "New York",
                ZipCode = "10001"
            }
        });

        context.SaveChanges();
    }
}