using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class DataContext : DbContext
{
    private readonly ILogger<DataContext> _logger;

    public DataContext(DbContextOptions<DataContext> options, ILogger<DataContext> logger) : base(options)
    {
        _logger = logger;
    }

    public virtual DbSet<User> User { get; set; }
    public virtual DbSet<Stadium> Stadium { get; set; }
    public virtual DbSet<Sport> Sport { get; set; }
    public virtual DbSet<Team> Team { get; set; }
    public virtual DbSet<Event> Event { get; set; }
    public virtual DbSet<Reservation> Reservation { get; set; }
    public virtual DbSet<GeneralEvent> GeneralEvent { get; set; }
    public virtual DbSet<GeneralReservation> GeneralReservation { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added
                || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added)
                ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added
                || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added)
                ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
        }

        return base.SaveChanges();
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Team>(entity =>
        {
            // 1-to-M relationship between Sport and Team
            entity.HasOne(t => t.Sport)
                .WithMany(s => s.Teams)
                .HasForeignKey(t => t.SportId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Team_Sport");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            // 1-to-M relationship between Sport and Event
            entity.HasOne(e => e.Sport)
                .WithMany(s => s.Events)
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_Sport");

            // 1-to-M relationship between Team (TeamOne) and Event
            entity.HasOne(e => e.TeamOne)
                .WithMany(t => t.TeamOneEvents)
                .HasForeignKey(e => e.TeamOneId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_TeamOne");

            // 1-to-M relationship between Team (TeamTwo) and Event
            entity.HasOne(e => e.TeamTwo)
                .WithMany(t => t.TeamTwoEvents)
                .HasForeignKey(e => e.TeamTwoId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_TeamTwo");

            // 1-to-M relationship between Stadium and Event
            entity.HasOne(e => e.Stadium)
                .WithMany(s => s.Events)
                .HasForeignKey(e => e.StadiumId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_Stadium");

            // 1-to-M relationship between User (Organizer) and Event
            entity.HasOne(e => e.Organizer)
                .WithMany(u => u.OrganizedEvents)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_Organizer");

            // 1-to-M relationship between Event and Reservation
            entity.HasMany(e => e.Reservations)
                .WithOne(sr => sr.Event)
                .HasForeignKey(sr => sr.EventId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_SeatReservation");
        });

        modelBuilder.Entity<GeneralEvent>(entity =>
        {
            // 1-to-M relationship between User (Organizer) and GeneralEvent
            entity.HasOne(e => e.Organizer)
                .WithMany(u => u.OrganizedGeneralEvents)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_OrganizerGeneral");

            // 1-to-M relationship between GeneralEvent and GeneralReservation
            entity.HasMany(e => e.Reservations)
                .WithOne(sr => sr.Event)
                .HasForeignKey(sr => sr.EventId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Event_GeneralSeatReservation");
        });

        modelBuilder.Entity<User>(entity =>
        {
            // 1-to-M relationship between User (Student) and SeatReservation
            entity.HasMany(u => u.Reservations)
                .WithOne(sr => sr.User)
                .HasForeignKey(sr => sr.StudentId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_User_SeatReservation");

            // 1-to-M relationship between User (Student) and GeneralSeatReservation
            entity.HasMany(u => u.GeneralReservations)
                .WithOne(sr => sr.User)
                .HasForeignKey(sr => sr.StudentId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_User_GeneralSeatReservation");
        });
    }
}