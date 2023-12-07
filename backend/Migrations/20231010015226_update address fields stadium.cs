using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class updateaddressfieldsstadium : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "stadium");

            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "stadium",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "stadium",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "stadium",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "stadium",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ZipCode",
                table: "stadium",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "stadium");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "stadium");

            migrationBuilder.DropColumn(
                name: "City",
                table: "stadium");

            migrationBuilder.DropColumn(
                name: "State",
                table: "stadium");

            migrationBuilder.DropColumn(
                name: "ZipCode",
                table: "stadium");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "stadium",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
