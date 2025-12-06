-- Добавление проданных автомобилей
-- Берем часть доступных автомобилей и помечаем их как проданные

-- Обновляем статус некоторых автомобилей на "Sold"
-- Используем CTE для случайного выбора
WITH RandomCars AS (
    SELECT TOP 20 CarId 
    FROM Cars 
    WHERE Status = 'Available' 
    ORDER BY NEWID()
)
UPDATE c
SET c.Status = 'Sold'
FROM Cars c
INNER JOIN RandomCars rc ON c.CarId = rc.CarId;

-- Добавляем заказы для проданных автомобилей
INSERT INTO Orders (UserId, CarId, ConfigurationId, OrderDate, TotalPrice, OrderStatus)
SELECT 
    (SELECT TOP 1 UserId FROM Users ORDER BY NEWID()), -- Случайный пользователь
    c.CarId,
    (SELECT TOP 1 ConfigurationId FROM Configurations WHERE ModelId = c.ModelId ORDER BY NEWID()), -- Случайная комплектация для модели
    DATEADD(DAY, -ABS(CHECKSUM(NEWID())) % 90, GETDATE()), -- Случайная дата за последние 90 дней
    m.BasePrice + ISNULL((SELECT TOP 1 AdditionalPrice FROM Configurations WHERE ModelId = c.ModelId ORDER BY NEWID()), 0), -- Цена модели + комплектация
    'Completed'
FROM Cars c
INNER JOIN Models m ON c.ModelId = m.ModelId
WHERE c.Status = 'Sold'
  AND NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.CarId = c.CarId
  );

