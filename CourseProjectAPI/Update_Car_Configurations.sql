-- Обновление комплектаций для автомобилей, у которых нет заказов
-- Назначаем случайную комплектацию для каждой модели

-- Для автомобилей без заказов назначаем первую доступную комплектацию для их модели
UPDATE c
SET c.Status = c.Status -- Обновляем только для триггера, если нужно
FROM Cars c
WHERE NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.CarId = c.CarId
)
AND EXISTS (
    SELECT 1 FROM Configurations conf WHERE conf.ModelId = c.ModelId
);

-- Создаем временные заказы для автомобилей без комплектаций
-- Это позволит отображать комплектацию в админке
INSERT INTO Orders (UserId, CarId, ConfigurationId, OrderDate, TotalPrice, OrderStatus)
SELECT 
    (SELECT TOP 1 UserId FROM Users ORDER BY UserId), -- Первый пользователь
    c.CarId,
    (SELECT TOP 1 ConfigurationId FROM Configurations WHERE ModelId = c.ModelId ORDER BY ConfigurationId), -- Первая комплектация для модели
    GETDATE(),
    m.BasePrice + ISNULL((SELECT TOP 1 AdditionalPrice FROM Configurations WHERE ModelId = c.ModelId ORDER BY ConfigurationId), 0),
    'Pending' -- Временный статус
FROM Cars c
INNER JOIN Models m ON c.ModelId = m.ModelId
WHERE NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.CarId = c.CarId
)
AND EXISTS (
    SELECT 1 FROM Configurations conf WHERE conf.ModelId = c.ModelId
);

