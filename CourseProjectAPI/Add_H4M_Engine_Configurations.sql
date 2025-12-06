-- Добавление комплектаций с двигателем H4M (1.6 л, 113 л.с.) для Vesta и Iskra
-- Согласно спецификациям: H4M устанавливается только с вариатором (CVT)

-- Vesta Седан - H4M с CVT
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 4 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (4, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

-- Vesta SW - H4M с CVT
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 6 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (6, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

-- Vesta SW Cross - H4M с CVT
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 7 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (7, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

-- Vesta Cross - H4M с CVT (если нужен)
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 5 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (5, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

-- Iskra - H4M с CVT
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 11 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (11, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

-- Iskra SW - H4M с CVT
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 13 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (13, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

-- Iskra SW Cross - H4M с CVT
IF NOT EXISTS (SELECT 1 FROM Configurations WHERE ModelId = 14 AND EngineCapacity = 1.6 AND EnginePower = 113 AND TransmissionType = 'CVT')
BEGIN
    INSERT INTO Configurations (ModelId, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (14, N'Luxury H4M', N'Комплектация с двигателем H4M (Renault-Nissan) 1.6 л, 113 л.с. и вариатором CVT', 150000, 113, 1.6, N'Petrol', N'CVT');
END

