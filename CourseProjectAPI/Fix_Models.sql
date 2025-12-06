-- Исправление названий моделей и добавление Aura
USE Autosalon;
GO

-- Исправляем Iscra на Iskra
UPDATE Models 
SET ModelName = N'Iskra' 
WHERE ModelName = N'Iscra';

-- Проверяем наличие Aura
IF NOT EXISTS (SELECT 1 FROM Models WHERE ModelName LIKE N'%Aura%')
BEGIN
    -- Добавляем модель Aura, если её нет
    DECLARE @BrandId INT = (SELECT TOP 1 BrandID FROM Brands WHERE BrandName = N'LADA');
    
    IF @BrandId IS NOT NULL
    BEGIN
        INSERT INTO Models (BrandID, ModelName, ModelYear, BodyType, BasePrice, Description, EngineCapacity, FuelType, IsActive)
        VALUES (@BrandId, N'Aura', 2024, N'Sedan', CAST(1799000.00 AS DECIMAL(15, 2)), N'Премиальный седан LADA Aura', CAST(1.80 AS DECIMAL(4, 2)), N'Petrol', 1);
    END
END

-- Проверяем результат
SELECT ModelID, ModelName, BodyType, IsActive
FROM Models
ORDER BY ModelID;
GO

