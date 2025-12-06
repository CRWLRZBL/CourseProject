-- Добавление всех возможных комбинаций двигатель+трансмиссия для комплектаций
-- Для комплектаций, где есть только Manual, добавляем также CVT (где применимо)
-- Для комплектаций с CVT, добавляем также Manual (где применимо)

-- Vesta Седан (ModelId = 4)
-- Enjoy: добавляем Manual вариант (сейчас только CVT)
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 4 AND ConfigurationName = N'Enjoy' AND TransmissionType = N'Manual')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(Description, N'CVT', N'Manual') + N' (5 передач)',
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'Manual'
    FROM Configurations
    WHERE ModelId = 4 AND ConfigurationName = N'Enjoy' AND TransmissionType = N'CVT';
END

-- Life: добавляем CVT вариант (сейчас только Manual)
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 4 AND ConfigurationName = N'Life' AND TransmissionType = N'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(Description, N'Manual', N'CVT') + N' (бесступенчатая)',
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'CVT'
    FROM Configurations
    WHERE ModelId = 4 AND ConfigurationName = N'Life' AND TransmissionType = N'Manual';
END

-- Techno: добавляем Manual вариант (сейчас только CVT)
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 4 AND ConfigurationName = N'Techno' AND TransmissionType = N'Manual')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(REPLACE(Description, N'CVT', N'Manual'), N'бесступенчатая', N'5 передач'),
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'Manual'
    FROM Configurations
    WHERE ModelId = 4 AND ConfigurationName = N'Techno' AND TransmissionType = N'CVT';
END

-- Vesta SW (ModelId = 6)
-- Enjoy: добавляем Manual вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 6 AND ConfigurationName = N'Enjoy' AND TransmissionType = N'Manual')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(Description, N'CVT', N'Manual') + N' (5 передач)',
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'Manual'
    FROM Configurations
    WHERE ModelId = 6 AND ConfigurationName = N'Enjoy' AND TransmissionType = N'CVT';
END

-- Techno: добавляем Manual вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 6 AND ConfigurationName = N'Techno' AND TransmissionType = N'Manual')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(REPLACE(Description, N'CVT', N'Manual'), N'бесступенчатая', N'5 передач'),
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'Manual'
    FROM Configurations
    WHERE ModelId = 6 AND ConfigurationName = N'Techno' AND TransmissionType = N'CVT';
END

-- Vesta Cross (ModelId = 5)
-- Cross: добавляем Manual вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 5 AND ConfigurationName = N'Cross' AND TransmissionType = N'Manual')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(REPLACE(Description, N'CVT', N'Manual'), N'бесступенчатая', N'5 передач'),
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'Manual'
    FROM Configurations
    WHERE ModelId = 5 AND ConfigurationName = N'Cross' AND TransmissionType = N'CVT';
END

-- Vesta SW Cross (ModelId = 7)
-- Cross: добавляем Manual вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 7 AND ConfigurationName = N'Cross' AND TransmissionType = N'Manual')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           REPLACE(REPLACE(Description, N'CVT', N'Manual'), N'бесступенчатая', N'5 передач'),
           AdditionalPrice, EnginePower, EngineCapacity, FuelType, N'Manual'
    FROM Configurations
    WHERE ModelId = 7 AND ConfigurationName = N'Cross' AND TransmissionType = N'CVT';
END

-- Granta Седан (ModelId = 1) - добавляем CVT варианты для некоторых комплектаций
-- Standard: добавляем CVT вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 1 AND ConfigurationName = N'Standard' AND TransmissionType = N'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           Description + N' (CVT, бесступенчатая)',
           AdditionalPrice + 50000, EnginePower, EngineCapacity, FuelType, N'CVT'
    FROM Configurations
    WHERE ModelId = 1 AND ConfigurationName = N'Standard' AND TransmissionType = N'Manual';
END

-- Comfort: добавляем CVT вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 1 AND ConfigurationName = N'Comfort' AND TransmissionType = N'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           Description + N' (CVT, бесступенчатая)',
           AdditionalPrice + 50000, EnginePower, EngineCapacity, FuelType, N'CVT'
    FROM Configurations
    WHERE ModelId = 1 AND ConfigurationName = N'Comfort' AND TransmissionType = N'Manual';
END

-- Luxe: добавляем CVT вариант
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 1 AND ConfigurationName = N'Luxe' AND TransmissionType = N'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    SELECT ModelId, ConfigurationName, 
           Description + N' (CVT, бесступенчатая)',
           AdditionalPrice + 50000, EnginePower, EngineCapacity, FuelType, N'CVT'
    FROM Configurations
    WHERE ModelId = 1 AND ConfigurationName = N'Luxe' AND TransmissionType = N'Manual';
END

