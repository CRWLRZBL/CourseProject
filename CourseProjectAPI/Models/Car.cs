using System;
using System.Collections.Generic;

namespace CourseProjectAPI.Models;

public partial class Car
{
    public int CarId { get; set; }

    public int ModelId { get; set; }

    public string Vin { get; set; } = null!;

    public string Color { get; set; } = null!;

    public DateOnly? ProductionDate { get; set; }

    public int? Mileage { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual Model Model { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
