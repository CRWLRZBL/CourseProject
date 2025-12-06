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
                    ModelId = c.ModelId,
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

        public async Task<List<ModelDto>> GetAvailableModelsAsync(string brand = null, string bodyType = null)
        {
            var query = _context.Models
                .Include(m => m.Brand)
                .Where(m => m.IsActive);

            if (!string.IsNullOrEmpty(brand))
                query = query.Where(m => m.Brand.BrandName.Contains(brand));

            if (!string.IsNullOrEmpty(bodyType))
                query = query.Where(m => m.BodyType == bodyType);

            var models = await query
                .Select(m => new ModelDto
                {
                    ModelId = m.ModelId,
                    BrandName = m.Brand.BrandName,
                    ModelName = m.ModelName,
                    BodyType = m.BodyType,
                    BasePrice = m.BasePrice,
                    ModelYear = m.ModelYear,
                    FuelType = m.FuelType,
                    EngineCapacity = m.EngineCapacity,
                    Description = m.Description,
                    ImageUrl = m.ImageUrl,
                    IsActive = m.IsActive,
                    AvailableCount = _context.Cars.Count(c => c.ModelId == m.ModelId && c.Status == "Available")
                })
                .ToListAsync();

            // Фильтруем модели: показываем те, у которых есть либо доступные машины, либо комплектации
            var modelIdsWithConfigs = await _context.Configurations
                .Select(c => c.ModelId)
                .Distinct()
                .ToListAsync();

            return models
                .Where(m => m.AvailableCount > 0 || modelIdsWithConfigs.Contains(m.ModelId))
                .OrderBy(m => m.BrandName)
                .ThenBy(m => m.ModelName)
                .ToList();
        }

        public async Task<ModelDto> GetModelByIdAsync(int id)
        {
            return await _context.Models
                .Include(m => m.Brand)
                .Where(m => m.ModelId == id && m.IsActive)
                .Select(m => new ModelDto
                {
                    ModelId = m.ModelId,
                    BrandName = m.Brand.BrandName,
                    ModelName = m.ModelName,
                    BodyType = m.BodyType,
                    BasePrice = m.BasePrice,
                    ModelYear = m.ModelYear,
                    FuelType = m.FuelType,
                    EngineCapacity = m.EngineCapacity,
                    Description = m.Description,
                    ImageUrl = m.ImageUrl,
                    IsActive = m.IsActive,
                    AvailableCount = _context.Cars.Count(c => c.ModelId == m.ModelId && c.Status == "Available")
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CarDto> GetCarByIdAsync(int id)
        {
            return await _context.Cars
                .Include(c => c.Model)
                    .ThenInclude(m => m.Brand)
                .Include(c => c.Orders)
                    .ThenInclude(o => o.Configuration)
                .Where(c => c.CarId == id)
                .Select(c => new CarDto
                {
                    CarId = c.CarId,
                    ModelId = c.ModelId,
                    BrandName = c.Model.Brand.BrandName,
                    ModelName = c.Model.ModelName,
                    BodyType = c.Model.BodyType,
                    BasePrice = c.Model.BasePrice,
                    Color = c.Color,
                    Status = c.Status,
                    Vin = c.Vin,
                    ModelYear = c.Model.ModelYear,
                    FuelType = c.Model.FuelType,
                    EngineCapacity = c.Model.EngineCapacity,
                    ConfigurationName = c.Orders.OrderByDescending(o => o.OrderDate).Select(o => o.Configuration.ConfigurationName).FirstOrDefault()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<CarDto>> GetAllCarsAsync()
        {
            return await _context.Cars
                .Include(c => c.Model)
                    .ThenInclude(m => m.Brand)
                .Include(c => c.Orders)
                    .ThenInclude(o => o.Configuration)
                .Select(c => new CarDto
                {
                    CarId = c.CarId,
                    ModelId = c.ModelId,
                    BrandName = c.Model.Brand.BrandName,
                    ModelName = c.Model.ModelName,
                    BodyType = c.Model.BodyType,
                    BasePrice = c.Model.BasePrice,
                    Color = c.Color,
                    Status = c.Status,
                    Vin = c.Vin,
                    ModelYear = c.Model.ModelYear,
                    FuelType = c.Model.FuelType,
                    EngineCapacity = c.Model.EngineCapacity,
                    ConfigurationName = c.Orders.OrderByDescending(o => o.OrderDate).Select(o => o.Configuration.ConfigurationName).FirstOrDefault()
                })
                .OrderByDescending(c => c.CarId)
                .ToListAsync();
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

        public async Task<List<Configuration>> GetConfigurationsByModelIdAsync(int modelId)
        {
            return await _context.Configurations
                .AsNoTracking()
                .Where(c => c.ModelId == modelId)
                .OrderBy(c => c.AdditionalPrice)
                .ThenBy(c => c.ConfigurationName)
                .ToListAsync();
        }

        public async Task<CarDto> UpdateCarAsync(int id, UpdateCarDto updateDto)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
                return null;

            if (!string.IsNullOrEmpty(updateDto.Color))
                car.Color = updateDto.Color;

            if (!string.IsNullOrEmpty(updateDto.Status))
                car.Status = updateDto.Status;

            if (!string.IsNullOrEmpty(updateDto.Vin))
                car.Vin = updateDto.Vin;

            if (updateDto.Mileage.HasValue)
                car.Mileage = updateDto.Mileage.Value;

            await _context.SaveChangesAsync();

            return await GetCarByIdAsync(id);
        }

        public async Task<List<ColorDto>> GetAvailableColorsAsync()
        {
            // Маппинг всех доступных цветов LADA в hex-коды
            // Базовый цвет: Ледниковый (белый)
            var colorMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Ледниковый", "#FFFFFF" },      // Базовый белый цвет
                { "Пантера", "#000000" },         // Черный
                { "Платина", "#C0C0C0" },        // Серебристый
                { "Борнео", "#4A5568" },         // Темно-серый
                { "Капитан", "#3B82F6" },        // Синий
                { "Кориандр", "#92400E" },       // Коричневый
                { "Фламенко", "#DC2626" },       // Красный
                { "Несси", "#065F46" },          // Темно-зеленый
                { "Несси 2", "#065F46" },        // Темно-зеленый (вариант 2)
                { "Несси2", "#065F46" },         // Темно-зеленый (вариант 2, без пробела)
                { "Табаско", "#B91C1C" },        // Темно-красный
                // Старые названия для обратной совместимости
                { "Белый", "#FFFFFF" },
                { "Черный", "#000000" },
                { "Серебристый", "#C0C0C0" },
                { "Серый", "#808080" },
                { "Красный", "#DC2626" },
                { "Синий", "#3B82F6" },
                { "Зеленый", "#059669" }
            };

            // Возвращаем все доступные цвета из маппинга
            // Порядок: сначала базовый, потом остальные
            var orderedColors = new List<string>
            {
                "Ледниковый",  // Базовый цвет - первый
                "Пантера",
                "Платина",
                "Борнео",
                "Капитан",
                "Кориандр",
                "Фламенко",
                "Несси",
                "Несси 2",     // Темно-зеленый (вариант 2)
                "Табаско"
            };

            return orderedColors.Select(colorName => new ColorDto
            {
                Name = colorName,
                HexCode = colorMap.TryGetValue(colorName, out var hexCode) ? hexCode : "#CCCCCC"
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
