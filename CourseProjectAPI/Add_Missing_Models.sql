-- Добавление недостающих моделей в БД
-- Iskra SW, Iskra SW Cross, Largus Cross, Largus Фургон, Largus Фургон CNG, Largus Универсал CNG
-- Niva Legend Bronto, Niva Legend Urban, Niva Legend Sport

SET IDENTITY_INSERT [dbo].[Models] ON
GO

-- Iskra SW (StationWagon)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    13, 1, N'Iskra SW', 2024, N'StationWagon',
    CAST(1899000.00 AS Decimal(15, 2)), NULL, CAST(1.80 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

-- Iskra SW Cross (StationWagon)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    14, 1, N'Iskra SW Cross', 2024, N'StationWagon',
    CAST(2099000.00 AS Decimal(15, 2)), NULL, CAST(1.80 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

-- Largus Cross (StationWagon)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    15, 1, N'Largus Cross', 2024, N'StationWagon',
    CAST(1299000.00 AS Decimal(15, 2)), NULL, CAST(1.60 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

-- Largus Фургон (Van)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    16, 1, N'Largus Фургон', 2024, N'Van',
    CAST(1199000.00 AS Decimal(15, 2)), NULL, CAST(1.60 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

-- Largus Фургон CNG (Van, газ)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    17, 1, N'Largus Фургон CNG', 2024, N'Van',
    CAST(1349000.00 AS Decimal(15, 2)), NULL, CAST(1.60 AS Decimal(4, 2)), N'CNG', 1, NULL
);

-- Largus Универсал CNG (StationWagon, газ)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    18, 1, N'Largus Универсал CNG', 2024, N'StationWagon',
    CAST(1399000.00 AS Decimal(15, 2)), NULL, CAST(1.60 AS Decimal(4, 2)), N'CNG', 1, NULL
);

-- Niva Legend Bronto (SUV)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    19, 1, N'Niva Legend Bronto', 2024, N'SUV',
    CAST(1259000.00 AS Decimal(15, 2)), NULL, CAST(1.70 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

-- Niva Legend Urban (SUV)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    20, 1, N'Niva Legend Urban', 2024, N'SUV',
    CAST(1159000.00 AS Decimal(15, 2)), NULL, CAST(1.70 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

-- Niva Legend Sport (SUV)
INSERT INTO [dbo].[Models] (
    [ModelID], [BrandID], [ModelName], [ModelYear], [BodyType], 
    [BasePrice], [Description], [EngineCapacity], [FuelType], [IsActive], [ImageUrl]
) VALUES (
    21, 1, N'Niva Legend Sport', 2024, N'SUV',
    CAST(1359000.00 AS Decimal(15, 2)), NULL, CAST(1.70 AS Decimal(4, 2)), N'Petrol', 1, NULL
);

SET IDENTITY_INSERT [dbo].[Models] OFF
GO

