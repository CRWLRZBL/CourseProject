-- Создание записей Cars для всех моделей с разными комплектациями и цветами
-- Это необходимо для отображения моделей на сайте

USE Autosalon;
GO

-- Массив цветов LADA
DECLARE @Colors TABLE (ColorName NVARCHAR(50));
INSERT INTO @Colors VALUES 
    (N'Ледниковый'), (N'Пантера'), (N'Платина'), (N'Борнео'), 
    (N'Капитан'), (N'Кориандр'), (N'Фламенко'), (N'Несси'), (N'Несси2'), (N'Табаско');

-- Создаем автомобили для каждой модели и комплектации
DECLARE @ModelID INT;
DECLARE @ConfigID INT;
DECLARE @ColorName NVARCHAR(50);
DECLARE @VIN NVARCHAR(17);
DECLARE @VINCounter INT = 1;

-- Курсор для всех моделей
DECLARE model_cursor CURSOR FOR
SELECT ModelID FROM Models WHERE IsActive = 1 ORDER BY ModelID;

OPEN model_cursor;
FETCH NEXT FROM model_cursor INTO @ModelID;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Для каждой модели получаем первые 2-3 комплектации
    DECLARE config_cursor CURSOR FOR
    SELECT TOP 3 ConfigurationID 
    FROM Configurations 
    WHERE ModelID = @ModelID 
    ORDER BY AdditionalPrice, ConfigurationID;
    
    OPEN config_cursor;
    FETCH NEXT FROM config_cursor INTO @ConfigID;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Для каждой комплектации создаем 2-3 автомобиля с разными цветами
        DECLARE color_cursor CURSOR FOR
        SELECT TOP 3 ColorName FROM @Colors ORDER BY NEWID();
        
        OPEN color_cursor;
        FETCH NEXT FROM color_cursor INTO @ColorName;
        
        DECLARE @ColorCount INT = 0;
        WHILE @@FETCH_STATUS = 0 AND @ColorCount < 2
        BEGIN
            SET @VIN = N'LADA' + RIGHT('0000000000000' + CAST(@VINCounter AS NVARCHAR), 13);
            
            INSERT INTO Cars (ModelID, VIN, Color, ProductionDate, Mileage, Status, CreatedAt)
            VALUES (
                @ModelID,
                @VIN,
                @ColorName,
                CAST(GETDATE() AS DATE),
                0,
                N'Available',
                GETDATE()
            );
            
            SET @VINCounter = @VINCounter + 1;
            SET @ColorCount = @ColorCount + 1;
            
            FETCH NEXT FROM color_cursor INTO @ColorName;
        END;
        
        CLOSE color_cursor;
        DEALLOCATE color_cursor;
        
        FETCH NEXT FROM config_cursor INTO @ConfigID;
    END;
    
    CLOSE config_cursor;
    DEALLOCATE config_cursor;
    
    FETCH NEXT FROM model_cursor INTO @ModelID;
END;

CLOSE model_cursor;
DEALLOCATE model_cursor;

PRINT 'Автомобили созданы для всех моделей!';
GO

-- Проверяем результат
SELECT 
    m.ModelName,
    COUNT(c.CarID) as CarCount,
    COUNT(CASE WHEN c.Status = 'Available' THEN 1 END) as AvailableCount
FROM Models m
LEFT JOIN Cars c ON m.ModelID = c.ModelID
WHERE m.IsActive = 1
GROUP BY m.ModelID, m.ModelName
ORDER BY m.ModelID;

