-- Пересоздание данных с правильной кодировкой
USE Autosalon;
GO

-- Удаляем старые данные
DELETE FROM AdditionalOptions;
GO

DELETE FROM Configurations;
GO

-- Вставляем опции с правильной кодировкой
INSERT INTO AdditionalOptions (OptionName, Description, OptionPrice, Category)
VALUES 
    (N'Подогрев сидений', N'Подогрев передних сидений', 20000, N'Comfort'),
    (N'Кондиционер', N'Климат-контроль', 50000, N'Comfort'),
    (N'Мультимедиа система', N'Мультимедиа, Apple CarPlay, Android Auto', 45000, N'Comfort'),
    (N'Круиз-контроль', N'Адаптивный круиз-контроль с автоматическим торможением', 30000, N'Comfort'),
    (N'Дополнительная безопасность', N'Дополнительные системы безопасности', 35000, N'Safety'),
    (N'Подогрев руля', N'Подогрев рулевого колеса', 15000, N'Comfort'),
    (N'Легкосплавные диски', N'Легкосплавные диски', 40000, N'Exterior'),
    (N'Легкосплавные диски 16"', N'Диски 16"', 40000, N'Exterior'),
    (N'Парктроник', N'Парковочный радар', 25000, N'Safety'),
    (N'Камера заднего вида', N'Камера заднего вида', 30000, N'Safety');
GO

-- Вставляем комплектации с правильной кодировкой для каждой модели
DECLARE @ModelID INT;
DECLARE model_cursor CURSOR FOR SELECT ModelID FROM Models WHERE IsActive = 1;

OPEN model_cursor;
FETCH NEXT FROM model_cursor INTO @ModelID;

WHILE @@FETCH_STATUS = 0
BEGIN
    INSERT INTO Configurations (ModelID, ConfigurationName, Description, AdditionalPrice)
    VALUES 
        (@ModelID, N'Standard', N'Базовая комплектация', 0),
        (@ModelID, N'Standard Plus', N'Базовая комплектация с дополнительными опциями', 60000),
        (@ModelID, N'Classic', N'Классическая комплектация', 80000),
        (@ModelID, N'Comfort', N'Комплектация Комфорт', 140000),
        (@ModelID, N'Life', N'Комплектация Life', 120000);
    
    FETCH NEXT FROM model_cursor INTO @ModelID;
END;

CLOSE model_cursor;
DEALLOCATE model_cursor;
GO

-- Проверяем результат
SELECT COUNT(*) as TotalOptions FROM AdditionalOptions;
SELECT COUNT(*) as TotalConfigs FROM Configurations;
GO

SELECT TOP 5 OptionID, OptionName, Description, Category 
FROM AdditionalOptions 
ORDER BY OptionID;
GO

SELECT TOP 5 ConfigurationID, ModelID, ConfigurationName, Description 
FROM Configurations 
ORDER BY ConfigurationID;
GO

