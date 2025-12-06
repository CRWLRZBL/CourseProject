-- Финальное обновление цветов на официальные названия LADA
USE Autosalon;
GO

-- Обновляем все цвета на правильные названия
UPDATE Cars SET Color = N'Ледниковый' WHERE CarID BETWEEN 1 AND 5;
UPDATE Cars SET Color = N'Пантера' WHERE CarID BETWEEN 6 AND 10;
UPDATE Cars SET Color = N'Платина' WHERE CarID BETWEEN 11 AND 15;
UPDATE Cars SET Color = N'Борнео' WHERE CarID BETWEEN 16 AND 20;

-- Если есть еще автомобили, устанавливаем базовый цвет
UPDATE Cars SET Color = N'Ледниковый' WHERE Color IS NULL OR Color = '' OR LEN(Color) < 3;

-- Проверяем результат
SELECT DISTINCT Color, COUNT(*) as Count
FROM Cars
GROUP BY Color
ORDER BY Color;
GO

