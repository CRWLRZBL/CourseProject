using System;
using System.Collections.Generic;

namespace CourseProjectAPI.Models;

public partial class Configuration
{
    public int ConfigurationId { get; set; }

    public int ModelId { get; set; }

    public string ConfigurationName { get; set; } = null!;

    public string? Description { get; set; }

    public decimal AdditionalPrice { get; set; }

    public virtual Model Model { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
