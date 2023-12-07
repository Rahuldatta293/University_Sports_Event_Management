using Backend.Common;
using Backend.DTOs.User;

namespace Backend.Services.UserService;

public interface IUserService
{
    Task<ServiceResponse<List<GetUserDto>>> GetUsers();
    Task<ServiceResponse<GetUserDto>> GetUserById(Guid id);
    Task<ServiceResponse<Guid>> CreateUser(CreateUserDto user);
    Task<ServiceResponse<Guid>> UpdateUser(Guid id, UpdateUserDto updateUser);
    Task<ServiceResponse<Guid>> ToggleUserStatus(Guid id);
    Task<bool> UserExists(Guid id);
    Task<bool> UserExists(string email);
    Task<ServiceResponse<bool>> SendPasswordResetEmail(SendResetPasswordMailDto resetMailDto);
    Task<ServiceResponse<bool>> ResetUserPassword(ResetUserPasswordDto resetUserPassword);
    Task<string> GenerateToken(int size);
}