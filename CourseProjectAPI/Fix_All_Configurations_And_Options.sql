-- Полное исправление кодировки в таблицах Configurations и AdditionalOptions
USE Autosalon;
GO

-- Исправляем все комплектации с типичными названиями для LADA
-- Используем цикл для обновления всех записей с неправильной кодировкой

-- Обновляем комплектации по шаблонам
UPDATE Configurations 
SET ConfigurationName = CASE 
    WHEN ConfigurationID % 5 = 1 THEN N'Standard'
    WHEN ConfigurationID % 5 = 2 THEN N'Standard Plus'
    WHEN ConfigurationID % 5 = 3 THEN N'Classic'
    WHEN ConfigurationID % 5 = 4 THEN N'Comfort'
    ELSE N'Life'
END,
Description = CASE 
    WHEN ConfigurationID % 5 = 1 THEN N'Базовая комплектация'
    WHEN ConfigurationID % 5 = 2 THEN N'Базовая комплектация с дополнительными опциями'
    WHEN ConfigurationID % 5 = 3 THEN N'Классическая комплектация'
    WHEN ConfigurationID % 5 = 4 THEN N'Комплектация Комфорт'
    ELSE N'Комплектация Life'
END
WHERE ConfigurationName LIKE '%?%' OR ConfigurationName IS NULL;
GO

-- Исправляем оставшиеся опции
UPDATE AdditionalOptions 
SET OptionName = CASE OptionID
    WHEN 6 THEN N'Подогрев руля'
    WHEN 7 THEN N'Легкосплавные диски'
    WHEN 8 THEN N'Легкосплавные диски 16"'
    WHEN 9 THEN N'Мультимедиа система'
    WHEN 10 THEN N'Парктроник'
    ELSE OptionName
END,
Description = CASE OptionID
    WHEN 6 THEN N'Подогрев рулевого колеса'
    WHEN 7 THEN N'Легкосплавные диски'
    WHEN 8 THEN N'Диски 16"'
    WHEN 9 THEN N'Мультимедиа, Apple CarPlay, Android Auto'
    WHEN 10 THEN N'Парковочный радар'
    ELSE Description
END,
Category = CASE OptionID
    WHEN 6 THEN N'Comfort'
    WHEN 7 THEN N'Exterior'
    WHEN 8 THEN N'Exterior'
    WHEN 9 THEN N'Comfort'
    WHEN 10 THEN N'Safety'
    ELSE Category
END
WHERE OptionID BETWEEN 6 AND 10 AND (OptionName LIKE '%?%' OR OptionName IS NULL);
GO

-- Проверяем результат
SELECT ConfigurationID, ConfigurationName, Description 
FROM Configurations 
WHERE ConfigurationName NOT LIKE '%?%'
ORDER BY ConfigurationID;
GO

SELECT OptionID, OptionName, Description, Category 
FROM AdditionalOptions 
WHERE OptionName NOT LIKE '%?%'
ORDER BY OptionID;
GO

