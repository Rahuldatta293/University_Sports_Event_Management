using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class updateresrvationmodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "reservation",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_reservation_UserId",
                table: "reservation",
                newName: "IX_reservation_StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "reservation",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_reservation_StudentId",
                table: "reservation",
                newName: "IX_reservation_UserId");
        }
    }
}
