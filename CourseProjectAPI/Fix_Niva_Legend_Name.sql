-- Обновление названия модели Niva Legend 3Д на Niva Legend
USE Autosalon;
GO

UPDATE Models 
SET ModelName = N'Niva Legend' 
WHERE ModelName LIKE N'%Niva Legend%3%' OR ModelName LIKE N'%Niva Legend%3Д%';

-- Проверяем результат
SELECT ModelID, ModelName 
FROM Models 
WHERE ModelName LIKE N'%Niva%'
ORDER BY ModelID;
GO

