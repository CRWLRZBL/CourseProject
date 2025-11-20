namespace CourseProjectAPI.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public int CarId { get; set; }
        public int ConfigurationId { get; set; }
        public List<int> OptionIds { get; set; } = new();
    }
}
