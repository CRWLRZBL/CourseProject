namespace CourseProjectAPI.DTOs
{
    public class CarDto
    {
        public int CarId { get; set; }
        public int ModelId { get; set; }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string BodyType { get; set; }
        public decimal BasePrice { get; set; }
        public string Color { get; set; }
        public string Status { get; set; }
        public string Vin { get; set; }
        public int ModelYear { get; set; }
        public string FuelType { get; set; }
        public decimal? EngineCapacity { get; set; }
        public string? ConfigurationName { get; set; } // Название комплектации (если есть заказ)
    }
}
