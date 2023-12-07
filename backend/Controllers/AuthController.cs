using Backend.Common;
using Backend.DTOs.User;
using Backend.Services.AuthService;
using Backend.Services.UserService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IUserService _userService;

    public AuthController(ILogger<AuthController> logger, IAuthService authService, IUserService userService)
    {
        _logger = logger;
        _authService = authService;
        _userService = userService;
    }

    [HttpPost("Login")]
    public async Task<ActionResult<ServiceResponse<string>>> Login(LoginUserDto loginUser)
    {
        return Ok(await _authService.Login(loginUser));
    }

    [HttpPost("SendResetPasswordEmail")]
    public async Task<ActionResult<ServiceResponse<bool>>> SendPasswordResetEmail(SendResetPasswordMailDto resetMailDto)
    {
        return Ok(await _userService.SendPasswordResetEmail(resetMailDto));
    }
}