using CourseProjectAPI.Data;
using CourseProjectAPI.DTOs;
using CourseProjectAPI.Models;
using CourseProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace CourseProjectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _authService.LoginAsync(loginDto);

                if (user == null)
                    return Unauthorized(new { Error = "Invalid credentials" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            try
            {
                // Временная заглушка
                return BadRequest(new { Error = "Registration temporarily disabled. Use existing test accounts." });

                // var user = await _authService.RegisterAsync(registerDto);
                // return Ok(new { Message = "User registered successfully", UserId = user.UserId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
