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
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CarId == carId);

            if (car == null) return new List<Configuration>();

            return await _context.Configurations
                .AsNoTracking()
                .Where(c => c.ModelId == car.ModelId)
                .ToListAsync();
        }

        public async Task<List<ColorDto>> GetAvailableColorsAsync()
        {
            var colorNames = await _context.Cars
                .AsNoTracking()
                .Where(c => c.Status == "Available")
                .Select(c => c.Color)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            // Маппинг названий цветов в hex-коды
            var colorMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Белый", "#FFFFFF" },
                { "Черный", "#000000" },
                { "Серебристый", "#C0C0C0" },
                { "Серый", "#808080" },
                { "Красный", "#FF0000" },
                { "Синий", "#0000FF" },
                { "Зеленый", "#008000" },
                { "Желтый", "#FFFF00" },
                { "Оранжевый", "#FFA500" },
                { "Коричневый", "#A52A2A" },
                { "Бежевый", "#F5F5DC" },
                { "Золотой", "#FFD700" },
                { "Бордовый", "#800020" },
                { "Фиолетовый", "#800080" },
                { "Голубой", "#00FFFF" }
            };

            return colorNames.Select(colorName => new ColorDto
            {
                Name = colorName,
                HexCode = colorMap.TryGetValue(colorName, out var hexCode) ? hexCode : "#CCCCCC" // По умолчанию серый
            }).ToList();
        }

        public async Task<List<EngineDto>> GetAvailableEnginesAsync(int? modelId = null)
        {
            var engines = new List<EngineDto>();

            // Сначала получаем двигатели из комплектаций (если указана модель)
            if (modelId.HasValue)
            {
                var configEngines = await _context.Configurations
                    .AsNoTracking()
                    .Where(c => c.ModelId == modelId.Value)
                    .Where(c => (c.EngineCapacity.HasValue || c.Model.EngineCapacity.HasValue) 
                        && (!string.IsNullOrEmpty(c.FuelType) || !string.IsNullOrEmpty(c.Model.FuelType)))
                    .Select(c => new EngineDto
                    {
                        Capacity = c.EngineCapacity ?? c.Model.EngineCapacity ?? 0,
                        FuelType = c.FuelType ?? c.Model.FuelType ?? "",
                        Power = c.EnginePower
                    })
                    .Distinct()
                    .ToListAsync();

                engines.AddRange(configEngines);
            }

            // Если нет данных из комплектаций или не указана модель, используем данные из Models
            if (!engines.Any())
            {
                var query = _context.Models
                    .AsNoTracking()
                    .Where(m => m.IsActive);

                if (modelId.HasValue)
                {
                    query = query.Where(m => m.ModelId == modelId.Value);
                }

                var modelEngines = await query
                    .Where(m => m.EngineCapacity.HasValue && !string.IsNullOrEmpty(m.FuelType))
                    .Select(m => new EngineDto
                    {
                        Capacity = m.EngineCapacity.Value,
                        FuelType = m.FuelType,
                        Power = null // Мощность теперь может быть в Configuration
                    })
                    .Distinct()
                    .ToListAsync();

                engines.AddRange(modelEngines);
            }

            return engines
                .GroupBy(e => new { e.Capacity, e.FuelType })
                .Select(g => g.OrderByDescending(e => e.Power).First())
                .OrderBy(e => e.Capacity)
                .ThenBy(e => e.FuelType)
                .ToList();
        }

        public async Task<List<TransmissionDto>> GetAvailableTransmissionsAsync(int? modelId = null)
        {
            var transmissions = new List<TransmissionDto>();

            // Получаем КПП из комплектаций
            if (modelId.HasValue)
            {
                var configTransmissions = await _context.Configurations
                    .AsNoTracking()
                    .Where(c => c.ModelId == modelId.Value && !string.IsNullOrEmpty(c.TransmissionType))
                    .Select(c => new TransmissionDto
                    {
                        Type = c.TransmissionType,
                        Description = $"Коробка передач для комплектации {c.ConfigurationName}"
                    })
                    .Distinct()
                    .ToListAsync();

                transmissions.AddRange(configTransmissions);
            }
            else
            {
                // Если модель не указана, получаем все уникальные КПП из всех комплектаций
                var allTransmissions = await _context.Configurations
                    .AsNoTracking()
                    .Where(c => !string.IsNullOrEmpty(c.TransmissionType))
                    .Select(c => new TransmissionDto
                    {
                        Type = c.TransmissionType,
                        Description = $"Коробка передач"
                    })
                    .Distinct()
                    .ToListAsync();

                transmissions.AddRange(allTransmissions);
            }

            // Если в БД нет данных о КПП, возвращаем стандартные варианты
            if (!transmissions.Any())
            {
                transmissions = new List<TransmissionDto>
                {
                    new TransmissionDto { Type = "Механика", Description = "Механическая коробка передач" },
                    new TransmissionDto { Type = "Автомат", Description = "Автоматическая коробка передач" },
                    new TransmissionDto { Type = "Вариатор", Description = "Бесступенчатая трансмиссия" },
                    new TransmissionDto { Type = "Робот", Description = "Роботизированная коробка передач" }
                };
            }

            return transmissions.OrderBy(t => t.Type).ToList();
        }
    }
}
