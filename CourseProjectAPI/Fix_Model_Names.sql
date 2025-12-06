-- Исправление названий моделей с проблемами кодировки
USE Autosalon;
GO

-- Исправляем Largus
UPDATE Models 
SET ModelName = N'Largus Универсал' 
WHERE ModelID = 8;
GO

-- Исправляем Niva Legend
UPDATE Models 
SET ModelName = N'Niva Legend 3Д' 
WHERE ModelID = 10;
GO

-- Проверяем результат
SELECT ModelID, ModelName 
FROM Models 
WHERE ModelID IN (8, 10);
GO

