-- Добавление комплектаций для Largus Фургон (ModelID = 16)

-- Базовая комплектация
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 16 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (16, N'Comfort', N'Базовая комплектация с двигателем 1.6 л, 87 л.с. и механической КПП', 0, 87, 1.6, N'Petrol', N'Manual');
END

-- Комплектация Enjoy
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 16 AND ConfigurationName = N'Enjoy')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (16, N'Enjoy', N'Комплектация Enjoy с двигателем 1.6 л, 106 л.с. и механической КПП', 50000, 106, 1.6, N'Petrol', N'Manual');
END

-- Комплектация Life
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 16 AND ConfigurationName = N'Life')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (16, N'Life', N'Комплектация Life с двигателем 1.6 л, 106 л.с. и механической КПП', 100000, 106, 1.6, N'Petrol', N'Manual');
END

