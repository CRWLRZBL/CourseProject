-- Обновление названий цветов на официальные названия LADA
-- Базовый цвет: Ледниковый (белый)

USE Autosalon;
GO

-- Обновляем цвета в таблице Cars
UPDATE Cars 
SET Color = N'Ледниковый' 
WHERE Color IN (N'Белый', N'White', N'белый');

UPDATE Cars 
SET Color = N'Пантера' 
WHERE Color IN (N'Черный', N'Black', N'черный');

UPDATE Cars 
SET Color = N'Платина' 
WHERE Color IN (N'Серебристый', N'Silver', N'серебристый', N'Серый', N'Gray', N'Grey');

UPDATE Cars 
SET Color = N'Борнео' 
WHERE Color IN (N'Синий', N'Blue', N'синий');

UPDATE Cars 
SET Color = N'Капитан' 
WHERE Color LIKE N'%Капитан%' OR Color LIKE N'%Captain%';

UPDATE Cars 
SET Color = N'Кориандр' 
WHERE Color IN (N'Зеленый', N'Green', N'зеленый');

UPDATE Cars 
SET Color = N'Фламенко' 
WHERE Color IN (N'Красный', N'Red', N'красный');

UPDATE Cars 
SET Color = N'Несси' 
WHERE Color LIKE N'%Несси%' OR Color LIKE N'%Nessie%';

UPDATE Cars 
SET Color = N'Табаско' 
WHERE Color LIKE N'%Табаско%' OR Color LIKE N'%Tabasco%';

-- Если цвет не определен, устанавливаем базовый цвет Ледниковый
UPDATE Cars 
SET Color = N'Ледниковый' 
WHERE Color IS NULL OR Color = '';

-- Проверяем результат
SELECT DISTINCT Color, COUNT(*) as Count
FROM Cars
GROUP BY Color
ORDER BY Color;
GO

