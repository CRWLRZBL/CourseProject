-- Исправление кодировки в таблицах Configurations и AdditionalOptions
USE Autosalon;
GO

-- Обновляем комплектации (примерные названия на основе скриншота)
-- Нужно будет уточнить точные названия для каждой модели

-- Для примера обновим первые несколько комплектаций
UPDATE Configurations 
SET ConfigurationName = N'Standard',
    Description = N'Базовая комплектация'
WHERE ConfigurationID = 1;
GO

UPDATE Configurations 
SET ConfigurationName = N'Standard Plus',
    Description = N'Базовая комплектация с дополнительными опциями'
WHERE ConfigurationID = 2;
GO

UPDATE Configurations 
SET ConfigurationName = N'Classic',
    Description = N'Классическая комплектация'
WHERE ConfigurationID = 3;
GO

UPDATE Configurations 
SET ConfigurationName = N'Classic Кондиционер',
    Description = N'Классическая комплектация с кондиционером'
WHERE ConfigurationID = 4;
GO

UPDATE Configurations 
SET ConfigurationName = N'Comfort',
    Description = N'Комплектация Комфорт'
WHERE ConfigurationID = 5;
GO

-- Обновляем дополнительные опции
UPDATE AdditionalOptions 
SET OptionName = N'Подогрев сидений',
    Description = N'Подогрев передних сидений',
    Category = N'Comfort'
WHERE OptionID = 1;
GO

UPDATE AdditionalOptions 
SET OptionName = N'Кондиционер',
    Description = N'Климат-контроль',
    Category = N'Comfort'
WHERE OptionID = 2;
GO

UPDATE AdditionalOptions 
SET OptionName = N'Мультимедиа система',
    Description = N'Мультимедиа, Apple CarPlay, Android Auto',
    Category = N'Comfort'
WHERE OptionID = 3;
GO

UPDATE AdditionalOptions 
SET OptionName = N'Круиз-контроль',
    Description = N'Адаптивный круиз-контроль с автоматическим торможением',
    Category = N'Comfort'
WHERE OptionID = 4;
GO

UPDATE AdditionalOptions 
SET OptionName = N'Дополнительная безопасность',
    Description = N'Дополнительные системы безопасности',
    Category = N'Safety'
WHERE OptionID = 5;
GO

-- Проверяем результат
SELECT ConfigurationID, ConfigurationName, Description 
FROM Configurations 
ORDER BY ConfigurationID;
GO

SELECT OptionID, OptionName, Description, Category 
FROM AdditionalOptions 
ORDER BY OptionID;
GO

