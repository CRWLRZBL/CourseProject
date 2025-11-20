using CourseProjectAPI.Data;
using CourseProjectAPI.DTOs;
using CourseProjectAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseProjectAPI.Services
{
    public class CarService : ICarService
    {
        private readonly AutoSalonContext _context;

        public CarService(AutoSalonContext context)
        {
            _context = context;
        }

        public async Task<List<CarDto>> GetAvailableCarsAsync(string brand = null, string bodyType = null)
        {
            var query = _context.Cars
                .Include(c => c.Model)
                    .ThenInclude(m => m.Brand)
                .Where(c => c.Status == "Available");

            if (!string.IsNullOrEmpty(brand))
                query = query.Where(c => c.Model.Brand.BrandName.Contains(brand));

            if (!string.IsNullOrEmpty(bodyType))
                query = query.Where(c => c.Model.BodyType == bodyType);

            return await query
                .Select(c => new CarDto
                {
                    CarId = c.CarId,
                    BrandName = c.Model.Brand.BrandName,
                    ModelName = c.Model.ModelName,
                    BodyType = c.Model.BodyType,
                    BasePrice = c.Model.BasePrice,
                    Color = c.Color,
                    Status = c.Status,
                    Vin = c.Vin,
                    ModelYear = c.Model.ModelYear,
                    FuelType = c.Model.FuelType,
                    EngineCapacity = c.Model.EngineCapacity
                })
                .ToListAsync();
        }

        public async Task<CarDto> GetCarByIdAsync(int id)
        {
            return await _context.Cars
                .Include(c => c.Model)
                    .ThenInclude(m => m.Brand)
                .Where(c => c.CarId == id)
                .Select(c => new CarDto
                {
                    CarId = c.CarId,
                    BrandName = c.Model.Brand.BrandName,
                    ModelName = c.Model.ModelName,
                    BodyType = c.Model.BodyType,
                    BasePrice = c.Model.BasePrice,
                    Color = c.Color,
                    Status = c.Status,
                    Vin = c.Vin,
                    ModelYear = c.Model.ModelYear,
                    FuelType = c.Model.FuelType,
                    EngineCapacity = c.Model.EngineCapacity
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<Configuration>> GetConfigurationsAsync(int carId)
        {
            var car = await _context.Cars
                .Include(c => c.Model)
                .FirstOrDefaultAsync(c => c.CarId == carId);

            if (car == null) return new List<Configuration>();

            return await _context.Configurations
                .Where(c => c.ModelId == car.ModelId)
                .ToListAsync();
        }
    }
}
