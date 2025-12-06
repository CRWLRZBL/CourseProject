-- Исправление двигателя для Largus: BA3-11189 (1.6 л, 87 л.с.) вместо 90 л.с.
-- Согласно спецификациям: Largus должен иметь двигатель 1.6 л, 87 л.с. (BA3-11189)

-- Обновляем существующие комплектации Largus с 1.6/90 на 1.6/87
UPDATE Configurations
SET EnginePower = 87
WHERE ModelId IN (SELECT ModelID FROM Models WHERE ModelName LIKE N'%Largus%')
  AND EngineCapacity = 1.6
  AND EnginePower = 90;

-- Если нужно добавить комплектацию с 1.6/87 для Largus Универсал (если её нет)
-- ModelId для Largus Универсал = 8
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 8 AND EngineCapacity = 1.6 AND EnginePower = 87)
BEGIN
    -- Добавляем базовую комплектацию с двигателем 1.6/87
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT TOP 1 8, N'Standard', N'Базовая комплектация с двигателем 1.6 л, 87 л.с.', 0, 87, 1.6, N'Petrol', N'Manual'
    WHERE NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 8 AND ConfigurationName = N'Standard' AND EnginePower = 87);
END

