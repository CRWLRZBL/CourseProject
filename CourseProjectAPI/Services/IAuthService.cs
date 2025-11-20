using CourseProjectAPI.DTOs;

namespace CourseProjectAPI.Services
{
    public interface IAuthService
    {
        Task<UserDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> RegisterAsync(RegisterUserDto registerDto);
        Task<bool> UserExistsAsync(string email);
    }
}
