using CourseProjectAPI.DTOs;
using CourseProjectAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseProjectAPI.Services
{
    public interface ICarService
    {
        Task<List<CarDto>> GetAvailableCarsAsync(string brand = null, string bodyType = null);
        Task<CarDto> GetCarByIdAsync(int id);
        Task<List<Configuration>> GetConfigurationsAsync(int carId);
    }
}
