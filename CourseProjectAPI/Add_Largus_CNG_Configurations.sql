-- Добавление комплектаций для Largus CNG моделей
-- CNG - газовое топливо, двигатель 1.6 л

-- Largus Универсал CNG (ModelID = 18)
-- Базовая комплектация
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 18 AND ConfigurationName = N'Standard')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (18, N'Standard', N'Базовая комплектация с газовым двигателем 1.6 л', 0, 87, 1.6, N'CNG', N'Manual');
END

-- Комплектация Comfort
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 18 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (18, N'Comfort', N'Комплектация Comfort с газовым двигателем 1.6 л', 50000, 87, 1.6, N'CNG', N'Manual');
END

-- Комплектация Life
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 18 AND ConfigurationName = N'Life')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (18, N'Life', N'Комплектация Life с газовым двигателем 1.6 л', 100000, 87, 1.6, N'CNG', N'Manual');
END

-- Largus Фургон CNG (ModelID = 17)
-- Базовая комплектация
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 17 AND ConfigurationName = N'Standard')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (17, N'Standard', N'Базовая комплектация с газовым двигателем 1.6 л', 0, 87, 1.6, N'CNG', N'Manual');
END

-- Комплектация Comfort
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 17 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (17, N'Comfort', N'Комплектация Comfort с газовым двигателем 1.6 л', 50000, 87, 1.6, N'CNG', N'Manual');
END

-- Комплектация Life
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 17 AND ConfigurationName = N'Life')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (17, N'Life', N'Комплектация Life с газовым двигателем 1.6 л', 100000, 87, 1.6, N'CNG', N'Manual');
END

