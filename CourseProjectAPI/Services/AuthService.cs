using CourseProjectAPI.Data;
using CourseProjectAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CourseProjectAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AutoSalonContext _context;

        public AuthService(AutoSalonContext context)
        {
            _context = context;
        }

        public async Task<UserDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.UserProfiles)
                .Where(u => u.Email == loginDto.Email && u.PasswordHash == loginDto.Password && u.IsActive == true)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    FirstName = u.UserProfiles.FirstName,
                    LastName = u.UserProfiles.LastName,
                    Phone = u.UserProfiles.Phone,
                    RoleName = u.Role.RoleName
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<UserDto> RegisterAsync(RegisterUserDto registerDto)
        {
            // позже
            throw new NotImplementedException("Registration will be implemented later");
        }
    }
}
