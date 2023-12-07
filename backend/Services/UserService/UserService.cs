using AutoMapper;
using Backend.Common;
using Backend.DTOs.User;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.UserRepository;
using Backend.Services.EmailService;
using Backend.Services.PasswordService;

namespace Backend.Services.UserService;

public class UserService : IUserService
{
    private readonly IEmailService _emailService;
    private readonly ILogger<UserService> _logger;
    private readonly IMapper _mapper;
    private readonly IPasswordService _passwordService;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, ILogger<UserService> logger, IMapper mapper,
        IPasswordService passwordService, IEmailService emailService)
    {
        _userRepository = userRepository;
        _logger = logger;
        _mapper = mapper;
        _passwordService = passwordService;
        _emailService = emailService;
    }

    public async Task<ServiceResponse<List<GetUserDto>>> GetUsers()
    {
        var serviceResponse = new ServiceResponse<List<GetUserDto>>();
        var users = await _userRepository.GetUsers();

        serviceResponse.Data = _mapper.Map<List<GetUserDto>>(users);
        serviceResponse.Message = "Users found successfully.";
        return serviceResponse;
    }

    public async Task<ServiceResponse<GetUserDto>> GetUserById(Guid id)
    {
        var serviceResponse = new ServiceResponse<GetUserDto>();
        var user = await _userRepository.GetUserById(id);

        if (user is null)
            throw new EntityNotFoundException(EntityType.User);

        serviceResponse.Data = _mapper.Map<GetUserDto>(user);
        serviceResponse.Message = "User found successfully.";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> CreateUser(CreateUserDto user)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var existingUser = await _userRepository.UserExists(user.Email);
        if (existingUser)
            throw new EntityAlreadyExistsException($"User with email {user.Email} already exists.");

        var newUser = new User
        {
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Password = _passwordService.HashPassword(user.Password),
            IsActive = true,
            AddressLine1 = user.AddressLine1,
            AddressLine2 = user.AddressLine2,
            City = user.City,
            State = user.State,
            ZipCode = user.ZipCode
        };

        await _userRepository.CreateUser(newUser);

        serviceResponse.Data = newUser.Id;
        serviceResponse.Message = "User created successfully.";
        return serviceResponse;
    }

    public async Task<ServiceResponse<Guid>> UpdateUser(Guid id, UpdateUserDto updateUser)
    {
        var serviceResponse = new ServiceResponse<Guid>();

        var user = await _userRepository.GetUserById(id);
        if (user is null)
            throw new EntityNotFoundException(EntityType.User);

        user.Name = updateUser.Name;
        user.Email = updateUser.Email;
        user.Role = updateUser.Role;
        user.AddressLine1 = updateUser.AddressLine1;
        user.AddressLine2 = updateUser.AddressLine2;
        user.City = updateUser.City;
        user.State = updateUser.State;
        user.ZipCode = updateUser.ZipCode;
        user.IsActive = updateUser.IsActive;

        if (!string.IsNullOrEmpty(updateUser.Password))
            user.Password = _passwordService.HashPassword(updateUser.Password);

        await _userRepository.UpdateUser(user);

        serviceResponse.Data = user.Id;
        serviceResponse.Message = "User updated successfully.";
        return serviceResponse;
    }

    public async Task<bool> UserExists(Guid id)
    {
        return await _userRepository.UserExists(id);
    }

    public async Task<bool> UserExists(string email)
    {
        return await _userRepository.UserExists(email);
    }

    public async Task<ServiceResponse<bool>> SendPasswordResetEmail(SendResetPasswordMailDto resetMailDto)
    {
        var serviceResponse = new ServiceResponse<bool>();

        var user = await _userRepository.GetUserByEmail(resetMailDto.Email);
        if (user is null)
            throw new EntityNotFoundException(EntityType.User);

        user.Token = await GenerateToken(6);
        await _userRepository.UpdateUser(user);
        await _emailService.SendMailAsync(user.Email, "Password Reset",
            $"Your password reset token is {user.Token}");

        serviceResponse.Data = true;
        serviceResponse.Message = "Password reset email sent successfully.";
        return serviceResponse;
    }

    public async Task<ServiceResponse<bool>> ResetUserPassword(ResetUserPasswordDto resetUserPassword)
    {
        var serviceResponse = new ServiceResponse<bool>();

        var user = await _userRepository.GetUserByEmail(resetUserPassword.Email);
        if (user is null)
            throw new EntityNotFoundException(EntityType.User);

        var isTokenValid = await _userRepository.VerifyToken(resetUserPassword.Email, resetUserPassword.Token);
        if (!isTokenValid)
        {
            serviceResponse.Data = false;
            serviceResponse.Message = "Invalid token.";
            return serviceResponse;
        }


        user.Password = _passwordService.HashPassword(resetUserPassword.Password);
        user.Token = string.Empty;

        await _userRepository.UpdateUser(user);

        serviceResponse.Data = true;
        serviceResponse.Message = "User password updated successfully.";
        return serviceResponse;
    }

    public Task<string> GenerateToken(int size)
    {
        var rnd = new Random();
        const string chars = "0123456789";

        if (size < 6) size = 6;
        if (size > 8) size = 8;

        var token = new string(Enumerable.Repeat(chars, size)
            .Select(s => s[rnd.Next(s.Length)]).ToArray());

        return Task.FromResult(token);
    }

    public async Task<ServiceResponse<Guid>> ToggleUserStatus(Guid id)
    {
        var serviceResponse = new ServiceResponse<Guid>();
        var user = await _userRepository.GetUserById(id);

        if (user is null)
            throw new EntityNotFoundException(EntityType.User);

        var userId = await _userRepository.ToggleUserStatus(user);

        serviceResponse.Data = userId;
        serviceResponse.Message = "User status toggled successfully.";
        return serviceResponse;
    }
}