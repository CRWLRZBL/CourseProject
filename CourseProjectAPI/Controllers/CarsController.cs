using CourseProjectAPI.Data;
using CourseProjectAPI.DTOs;
using CourseProjectAPI.Models;
using CourseProjectAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseProjectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;
        private readonly AutoSalonContext _context;

        public CarsController(ICarService carService, AutoSalonContext context)
        {
            _carService = carService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CarDto>>> GetCars(
            [FromQuery] string brand = null,
            [FromQuery] string bodyType = null)
        {
            try
            {
                var cars = await _carService.GetAvailableCarsAsync(brand, bodyType);
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CarDto>> GetCar(int id)
        {
            try
            {
                var car = await _carService.GetCarByIdAsync(id);

                if (car == null)
                    return NotFound();

                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("{carId}/configurations")]
        public async Task<ActionResult<List<ConfigurationDto>>> GetConfigurations(int carId)
        {
            try
            {
                var configurations = await _carService.GetConfigurationsAsync(carId);
                var configurationDtos = configurations.Select(c => new ConfigurationDto
                {
                    ConfigurationId = c.ConfigurationId,
                    ModelId = c.ModelId,
                    ConfigurationName = c.ConfigurationName,
                    Description = c.Description,
                    AdditionalPrice = c.AdditionalPrice,
                    EnginePower = c.EnginePower,
                    EngineCapacity = c.EngineCapacity,
                    FuelType = c.FuelType,
                    TransmissionType = c.TransmissionType
                }).ToList();
                
                return Ok(configurationDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<Brand>>> GetBrands()
        {
            try
            {
                var brands = await _context.Brands.ToListAsync();
                return Ok(brands);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("filters/body-types")]
        public async Task<ActionResult<List<string>>> GetBodyTypes()
        {
            try
            {
                var bodyTypes = await _context.Models
                    .Select(m => m.BodyType)
                    .Distinct()
                    .ToListAsync();
                return Ok(bodyTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("options")]
        public async Task<ActionResult<List<AdditionalOption>>> GetAdditionalOptions()
        {
            try
            {
                var options = await _context.AdditionalOptions
                    .OrderBy(o => o.Category)
                    .ThenBy(o => o.OptionName)
                    .ToListAsync();
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<CarDto>>> SearchCars(
            [FromQuery] string query,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string fuelType = null)
        {
            try
            {
                var cars = await _carService.GetAvailableCarsAsync();

                // Применяем дополнительные фильтры
                if (!string.IsNullOrEmpty(query))
                {
                    cars = cars.Where(c =>
                        c.BrandName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        c.ModelName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        c.Color.Contains(query, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                if (minPrice.HasValue)
                    cars = cars.Where(c => c.BasePrice >= minPrice.Value).ToList();

                if (maxPrice.HasValue)
                    cars = cars.Where(c => c.BasePrice <= maxPrice.Value).ToList();

                if (!string.IsNullOrEmpty(fuelType))
                    cars = cars.Where(c => c.FuelType == fuelType).ToList();

                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("colors")]
        public async Task<ActionResult<List<ColorDto>>> GetAvailableColors()
        {
            try
            {
                var colors = await _carService.GetAvailableColorsAsync();
                return Ok(colors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("engines")]
        public async Task<ActionResult<List<EngineDto>>> GetAvailableEngines([FromQuery] int? modelId = null)
        {
            try
            {
                var engines = await _carService.GetAvailableEnginesAsync(modelId);
                return Ok(engines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpGet("transmissions")]
        public async Task<ActionResult<List<TransmissionDto>>> GetAvailableTransmissions([FromQuery] int? modelId = null)
        {
            try
            {
                var transmissions = await _carService.GetAvailableTransmissionsAsync(modelId);
                return Ok(transmissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
