-- Добавление дополнительных комплектаций для остальных моделей

USE Autosalon;
GO

-- ============================================
-- VESTA SW (ModelID = 6)
-- ============================================

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 6 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (6, N'Comfort', N'Бортовой компьютер, кондиционер, регулировка руля, электропривод зеркал, электростеклоподъёмники, электроусилитель руля', CAST(0.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

-- Enjoy
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 6 AND ConfigurationName = N'Enjoy')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (6, N'Enjoy', N'Мультимедиа с 7-дюймовым экраном, круиз-контроль, датчики дождя и света', CAST(350000.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'CVT');
END

-- Techno
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 6 AND ConfigurationName = N'Techno')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (6, N'Techno', N'Расширенные опции мультимедиа, обогрев лобового стекла, регулировка водительского кресла', CAST(500000.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'CVT');
END

GO

-- ============================================
-- VESTA SW CROSS (ModelID = 7)
-- ============================================

-- Cross
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 7 AND ConfigurationName = N'Cross')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (7, N'Cross', N'Защитные элементы из чёрного пластика, увеличенный дорожный просвет, мультимедиа Enjoy', CAST(0.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'CVT');
END

GO

-- ============================================
-- VESTA CROSS (ModelID = 5)
-- ============================================

-- Cross
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 5 AND ConfigurationName = N'Cross')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (5, N'Cross', N'Защитные элементы из чёрного пластика, увеличенный дорожный просвет, мультимедиа Enjoy', CAST(0.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'CVT');
END

GO

-- ============================================
-- GRANTA ХЭТЧБЕК (ModelID = 2)
-- ============================================

-- Standard
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 2 AND ConfigurationName = N'Standard')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (2, N'Standard', N'ABS, EBD, аудиоподготовка, ЭРА-ГЛОНАСС', CAST(0.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 2 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (2, N'Comfort', N'Кондиционер, подогрев сидений, электропривод зеркал', CAST(150000.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- GRANTA CROSS (ModelID = 3)
-- ============================================

-- Cross
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 3 AND ConfigurationName = N'Cross')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (3, N'Cross', N'Защитные элементы из чёрного пластика, увеличенный дорожный просвет', CAST(0.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- ISKRA (ModelID = 11)
-- ============================================

-- Standard
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 11 AND ConfigurationName = N'Standard')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (11, N'Standard', N'Базовая комплектация с современным оборудованием', CAST(0.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 11 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (11, N'Comfort', N'Кондиционер, подогрев сидений, мультимедиа', CAST(200000.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- ISKRA SW (ModelID = 13)
-- ============================================

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 13 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (13, N'Comfort', N'Кондиционер, подогрев сидений, мультимедиа', CAST(0.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- ISKRA SW CROSS (ModelID = 14)
-- ============================================

-- Cross
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 14 AND ConfigurationName = N'Cross')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (14, N'Cross', N'Защитные элементы из чёрного пластика, увеличенный дорожный просвет, мультимедиа', CAST(0.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- NIVA LEGEND BRONTO (ModelID = 19)
-- ============================================

-- Bronto
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 19 AND ConfigurationName = N'Bronto')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (19, N'Bronto', N'Специальная версия с улучшенной проходимостью и защитными элементами', CAST(0.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- NIVA LEGEND URBAN (ModelID = 20)
-- ============================================

-- Urban
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 20 AND ConfigurationName = N'Urban')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (20, N'Urban', N'Дополнительные опции безопасности и стиля, легкосплавные диски, противотуманные фары, улучшенная шумоизоляция', CAST(0.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

-- ============================================
-- NIVA LEGEND SPORT (ModelID = 21)
-- ============================================

-- Sport
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 21 AND ConfigurationName = N'Sport')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (21, N'Sport', N'Спортивная версия с улучшенными характеристиками и дизайном', CAST(0.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END

GO

PRINT 'Дополнительные комплектации добавлены!';

