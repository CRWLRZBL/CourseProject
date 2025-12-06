-- Обновление моделей и комплектаций LADA согласно актуальным спецификациям
-- Выполняется для адаптации модельного ряда

USE Autosalon;
GO

-- ============================================
-- 1. ОБНОВЛЕНИЕ БАЗОВЫХ ЦЕН МОДЕЛЕЙ
-- ============================================

-- Granta Седан - от 699 000 Р (базовая цена)
UPDATE Models SET BasePrice = CAST(699000.00 AS Decimal(15, 2)) WHERE ModelID = 1;

-- Granta Хэтчбек - обновляем цену
UPDATE Models SET BasePrice = CAST(1077000.00 AS Decimal(15, 2)) WHERE ModelID = 2;

-- Vesta Седан - от 1 239 000 Р
UPDATE Models SET BasePrice = CAST(1239000.00 AS Decimal(15, 2)) WHERE ModelID = 4;

-- Aura - от 2 599 000 Р (Premier)
UPDATE Models SET BasePrice = CAST(2599000.00 AS Decimal(15, 2)) WHERE ModelID = 12;

-- Largus Универсал - от 1 702 000 Р (пассажирская версия, 5 мест, 90 л.с.)
UPDATE Models SET BasePrice = CAST(1702000.00 AS Decimal(15, 2)) WHERE ModelID = 8;

-- Niva Legend - от 981 000 Р
UPDATE Models SET BasePrice = CAST(981000.00 AS Decimal(15, 2)) WHERE ModelID = 10;

-- Niva Travel - от 1 314 000 Р
UPDATE Models SET BasePrice = CAST(1314000.00 AS Decimal(15, 2)) WHERE ModelID = 9;

GO

-- ============================================
-- 2. ОБНОВЛЕНИЕ/ДОБАВЛЕНИЕ КОМПЛЕКТАЦИЙ
-- ============================================

-- Удаляем старые комплектации для чистоты (опционально, можно закомментировать)
-- DELETE FROM Configurations;

-- ============================================
-- GRANTA СЕДАН (ModelID = 1)
-- ============================================

-- Standard (базовая)
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 1 AND ConfigurationName = N'Standard')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (1, N'Standard', N'ABS, EBD, аудиоподготовка, ЭРА-ГЛОНАСС', CAST(0.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'ABS, EBD, аудиоподготовка, ЭРА-ГЛОНАСС',
        EnginePower = 90,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 1 AND ConfigurationName = N'Standard';
END

-- Classic
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 1 AND ConfigurationName = N'Classic')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (1, N'Classic', N'Регулируемые сиденья, электростеклоподъёмники передних дверей', CAST(50000.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Регулируемые сиденья, электростеклоподъёмники передних дверей',
        AdditionalPrice = CAST(50000.00 AS Decimal(15, 2)),
        EnginePower = 90,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 1 AND ConfigurationName = N'Classic';
END

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 1 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (1, N'Comfort', N'Кондиционер, подогрев сидений, электропривод зеркал', CAST(150000.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Кондиционер, подогрев сидений, электропривод зеркал',
        AdditionalPrice = CAST(150000.00 AS Decimal(15, 2)),
        EnginePower = 90,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 1 AND ConfigurationName = N'Comfort';
END

-- Luxe
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 1 AND ConfigurationName = N'Luxe')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (1, N'Luxe', N'Улучшенная отделка салона, ABS с EBD', CAST(250000.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Улучшенная отделка салона, ABS с EBD',
        AdditionalPrice = CAST(250000.00 AS Decimal(15, 2)),
        EnginePower = 106,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 1 AND ConfigurationName = N'Luxe';
END

GO

-- ============================================
-- VESTA СЕДАН (ModelID = 4)
-- ============================================

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 4 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (4, N'Comfort', N'Бортовой компьютер, кондиционер, регулировка руля, электропривод зеркал, электростеклоподъёмники, электроусилитель руля', CAST(0.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Бортовой компьютер, кондиционер, регулировка руля, электропривод зеркал, электростеклоподъёмники, электроусилитель руля',
        EnginePower = 90,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 4 AND ConfigurationName = N'Comfort';
END

-- Life
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 4 AND ConfigurationName = N'Life')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (4, N'Life', N'Дополнительные опции комфорта и мультимедиа', CAST(200000.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Дополнительные опции комфорта и мультимедиа',
        AdditionalPrice = CAST(200000.00 AS Decimal(15, 2)),
        EnginePower = 106,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 4 AND ConfigurationName = N'Life';
END

-- Enjoy
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 4 AND ConfigurationName = N'Enjoy')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (4, N'Enjoy', N'Мультимедиа с 7-дюймовым экраном, круиз-контроль, датчики дождя и света', CAST(350000.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'CVT');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Мультимедиа с 7-дюймовым экраном, круиз-контроль, датчики дождя и света',
        AdditionalPrice = CAST(350000.00 AS Decimal(15, 2)),
        EnginePower = 106,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'CVT'
    WHERE ModelID = 4 AND ConfigurationName = N'Enjoy';
END

-- Techno
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 4 AND ConfigurationName = N'Techno')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (4, N'Techno', N'Расширенные опции мультимедиа, обогрев лобового стекла, регулировка водительского кресла', CAST(500000.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'CVT');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Расширенные опции мультимедиа, обогрев лобового стекла, регулировка водительского кресла',
        AdditionalPrice = CAST(500000.00 AS Decimal(15, 2)),
        EnginePower = 122,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'CVT'
    WHERE ModelID = 4 AND ConfigurationName = N'Techno';
END

GO

-- ============================================
-- AURA (ModelID = 12)
-- ============================================

-- Premier
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 12 AND ConfigurationName = N'Premier')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (12, N'Premier', N'Комбинированная отделка сидений, 4 подушки безопасности, ESP, кондиционер, передние и задние парктроники, камера заднего вида, мультимедиа Enjoy с 7-дюймовым экраном, подогрев сидений и руля, обогрев лобового стекла, 16-дюймовые диски', CAST(0.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'CVT');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Комбинированная отделка сидений, 4 подушки безопасности, ESP, кондиционер, передние и задние парктроники, камера заднего вида, мультимедиа Enjoy с 7-дюймовым экраном, подогрев сидений и руля, обогрев лобового стекла, 16-дюймовые диски',
        EnginePower = 122,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'CVT'
    WHERE ModelID = 12 AND ConfigurationName = N'Premier';
END

-- Status
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 12 AND ConfigurationName = N'Status')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (12, N'Status', N'Отделка сидений натуральной кожей, подогрев спинки заднего дивана, виртуальная приборная панель (10,25 дюйма), мультимедиа Enjoy Vision Pro с 10,4-дюймовым экраном, 17-дюймовые диски', CAST(200000.00 AS Decimal(15, 2)), 122, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'CVT');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Отделка сидений натуральной кожей, подогрев спинки заднего дивана, виртуальная приборная панель (10,25 дюйма), мультимедиа Enjoy Vision Pro с 10,4-дюймовым экраном, 17-дюймовые диски',
        AdditionalPrice = CAST(200000.00 AS Decimal(15, 2)),
        EnginePower = 122,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'CVT'
    WHERE ModelID = 12 AND ConfigurationName = N'Status';
END

GO

-- ============================================
-- LARGUS УНИВЕРСАЛ (ModelID = 8)
-- ============================================

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 8 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (8, N'Comfort', N'Регулировка водительского сиденья, электропривод и обогрев зеркал, подогрев передних сидений, защитные молдинги, карманы на спинках передних кресел', CAST(0.00 AS Decimal(15, 2)), 90, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Регулировка водительского сиденья, электропривод и обогрев зеркал, подогрев передних сидений, защитные молдинги, карманы на спинках передних кресел',
        EnginePower = 90,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 8 AND ConfigurationName = N'Comfort';
END

-- Enjoy
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 8 AND ConfigurationName = N'Enjoy')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (8, N'Enjoy', N'Мультимедиа Enjoy Pro с 8-дюймовым экраном, онлайн-сервисы Яндекса, кнопки управления мультимедиа на руле, обогрев лобового стекла, камера заднего вида, датчик дождя и света, задние парктроники, рейлинги на крыше', CAST(300000.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Мультимедиа Enjoy Pro с 8-дюймовым экраном, онлайн-сервисы Яндекса, кнопки управления мультимедиа на руле, обогрев лобового стекла, камера заднего вида, датчик дождя и света, задние парктроники, рейлинги на крыше',
        AdditionalPrice = CAST(300000.00 AS Decimal(15, 2)),
        EnginePower = 106,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 8 AND ConfigurationName = N'Enjoy';
END

GO

-- ============================================
-- LARGUS CROSS (ModelID = 15)
-- ============================================

-- Cross
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 15 AND ConfigurationName = N'Cross')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (15, N'Cross', N'Защитные элементы из чёрного пластика на бамперах, колёсных арках и порогах, увеличенный дорожный просвет (200 мм)', CAST(0.00 AS Decimal(15, 2)), 106, CAST(1.60 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Защитные элементы из чёрного пластика на бамперах, колёсных арках и порогах, увеличенный дорожный просвет (200 мм)',
        EnginePower = 106,
        EngineCapacity = CAST(1.60 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 15 AND ConfigurationName = N'Cross';
END

GO

-- ============================================
-- NIVA LEGEND (ModelID = 10)
-- ============================================

-- Classic
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 10 AND ConfigurationName = N'Classic')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (10, N'Classic', N'Гидравлический усилитель руля, 16-дюймовые стальные диски, ручной тормоз, галогенное освещение, очиститель и обогреватель заднего стекла, тканевая обивка кресел, передние электростеклоподъёмники, ремни безопасности, аудиосистема с двумя динамиками, шторка для багажного отделения, бортовой компьютер, полноразмерное запасное колесо', CAST(0.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Гидравлический усилитель руля, 16-дюймовые стальные диски, ручной тормоз, галогенное освещение, очиститель и обогреватель заднего стекла, тканевая обивка кресел, передние электростеклоподъёмники, ремни безопасности, аудиосистема с двумя динамиками, шторка для багажного отделения, бортовой компьютер, полноразмерное запасное колесо',
        EnginePower = 83,
        EngineCapacity = CAST(1.70 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 10 AND ConfigurationName = N'Classic';
END

-- Luxe
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 10 AND ConfigurationName = N'Luxe')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (10, N'Luxe', N'Подогрев зеркал, электроуправление зеркал, подогрев передних сидений, кондиционер', CAST(150000.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Подогрев зеркал, электроуправление зеркал, подогрев передних сидений, кондиционер',
        AdditionalPrice = CAST(150000.00 AS Decimal(15, 2)),
        EnginePower = 83,
        EngineCapacity = CAST(1.70 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 10 AND ConfigurationName = N'Luxe';
END

GO

-- ============================================
-- NIVA TRAVEL (ModelID = 9)
-- ============================================

-- Classic
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 9 AND ConfigurationName = N'Classic')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (9, N'Classic', N'Постоянный полный привод, электропривод и обогрев зеркал, аудиоподготовка, 15-дюймовые стальные диски', CAST(0.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Постоянный полный привод, электропривод и обогрев зеркал, аудиоподготовка, 15-дюймовые стальные диски',
        EnginePower = 83,
        EngineCapacity = CAST(1.70 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 9 AND ConfigurationName = N'Classic';
END

-- Comfort
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 9 AND ConfigurationName = N'Comfort')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (9, N'Comfort', N'Рейлинги, молдинги в цвет кузова, подголовники задних сидений, подушка безопасности переднего пассажира, кондиционер, подлокотники с подстаканниками', CAST(100000.00 AS Decimal(15, 2)), 83, CAST(1.70 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Рейлинги, молдинги в цвет кузова, подголовники задних сидений, подушка безопасности переднего пассажира, кондиционер, подлокотники с подстаканниками',
        AdditionalPrice = CAST(100000.00 AS Decimal(15, 2)),
        EnginePower = 83,
        EngineCapacity = CAST(1.70 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 9 AND ConfigurationName = N'Comfort';
END

-- Life
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 9 AND ConfigurationName = N'Life')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (9, N'Life', N'Светодиодные фары, 15-дюймовые литые диски', CAST(200000.00 AS Decimal(15, 2)), 90, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Светодиодные фары, 15-дюймовые литые диски',
        AdditionalPrice = CAST(200000.00 AS Decimal(15, 2)),
        EnginePower = 90,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 9 AND ConfigurationName = N'Life';
END

-- Enjoy
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 9 AND ConfigurationName = N'Enjoy')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (9, N'Enjoy', N'Задние парктроники, камера, круиз-контроль, мультимедиа с 7-дюймовым тачскрином и Яндекс Авто', CAST(350000.00 AS Decimal(15, 2)), 90, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Задние парктроники, камера, круиз-контроль, мультимедиа с 7-дюймовым тачскрином и Яндекс Авто',
        AdditionalPrice = CAST(350000.00 AS Decimal(15, 2)),
        EnginePower = 90,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 9 AND ConfigurationName = N'Enjoy';
END

-- Techno
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 9 AND ConfigurationName = N'Techno')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (9, N'Techno', N'Светодиодные противотуманные фары, обогрев лобового стекла, тонировка задних стёкол, регулировка водительского кресла по высоте и поясничная поддержка, 17-дюймовые диски', CAST(500000.00 AS Decimal(15, 2)), 90, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Светодиодные противотуманные фары, обогрев лобового стекла, тонировка задних стёкол, регулировка водительского кресла по высоте и поясничная поддержка, 17-дюймовые диски',
        AdditionalPrice = CAST(500000.00 AS Decimal(15, 2)),
        EnginePower = 90,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 9 AND ConfigurationName = N'Techno';
END

-- KHL (спецверсия)
IF NOT EXISTS (SELECT * FROM Configurations WHERE ModelID = 9 AND ConfigurationName = N'KHL')
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice, EnginePower, EngineCapacity, FuelType, TransmissionType)
    VALUES (9, N'KHL', N'Спецверсия с особыми орнаментами, накладками на порогах и коврами в фирменном стиле', CAST(600000.00 AS Decimal(15, 2)), 90, CAST(1.80 AS Decimal(4, 2)), N'Petrol', N'Manual');
END
ELSE
BEGIN
    UPDATE Configurations SET 
        Description = N'Спецверсия с особыми орнаментами, накладками на порогах и коврами в фирменном стиле',
        AdditionalPrice = CAST(600000.00 AS Decimal(15, 2)),
        EnginePower = 90,
        EngineCapacity = CAST(1.80 AS Decimal(4, 2)),
        FuelType = N'Petrol',
        TransmissionType = N'Manual'
    WHERE ModelID = 9 AND ConfigurationName = N'KHL';
END

GO

PRINT 'Обновление моделей и комплектаций завершено!';

