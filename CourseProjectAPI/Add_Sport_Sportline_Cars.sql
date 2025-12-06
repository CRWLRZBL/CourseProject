-- Добавление автомобилей версий Sport и Sportline

-- Vesta Sport (используем Vesta Седан как базовую модель, ModelId = 4)
-- Добавляем несколько автомобилей Vesta Sport с разными цветами
INSERT INTO Cars (ModelId, Vin, Color, Status, Mileage, ProductionDate, CreatedAt)
SELECT 4, 
       'VS' + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 200 AS NVARCHAR(3)), 3),
       ColorName,
       'Available',
       0,
       CAST(GETDATE() AS DATE),
       GETDATE()
FROM (VALUES 
    (N'Ледниковый'),
    (N'Пантера'),
    (N'Платина'),
    (N'Борнео'),
    (N'Капитан'),
    (N'Кориандр'),
    (N'Фламенко'),
    (N'Несси'),
    (N'Табаско')
) AS Colors(ColorName)
WHERE NOT EXISTS (
    SELECT 1 FROM Cars WHERE ModelId = 4 AND Vin LIKE 'VS%' AND Vin NOT LIKE 'VESTA%'
);

-- Vesta Sportline (используем Vesta Седан как базовую модель, ModelId = 4)
INSERT INTO Cars (ModelId, Vin, Color, Status, Mileage, ProductionDate, CreatedAt)
SELECT 4, 
       'VSL' + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 300 AS NVARCHAR(3)), 3),
       ColorName,
       'Available',
       0,
       CAST(GETDATE() AS DATE),
       GETDATE()
FROM (VALUES 
    (N'Ледниковый'),
    (N'Пантера'),
    (N'Платина'),
    (N'Борнео'),
    (N'Капитан'),
    (N'Кориандр'),
    (N'Фламенко'),
    (N'Несси'),
    (N'Табаско')
) AS Colors(ColorName)
WHERE NOT EXISTS (
    SELECT 1 FROM Cars WHERE ModelId = 4 AND Vin LIKE 'VSL%'
);

-- Granta Sport (используем Granta Седан как базовую модель, ModelId = 1)
INSERT INTO Cars (ModelId, Vin, Color, Status, Mileage, ProductionDate, CreatedAt)
SELECT 1, 
       'GS' + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 400 AS NVARCHAR(3)), 3),
       ColorName,
       'Available',
       0,
       CAST(GETDATE() AS DATE),
       GETDATE()
FROM (VALUES 
    (N'Ледниковый'),
    (N'Пантера'),
    (N'Платина'),
    (N'Борнео'),
    (N'Капитан'),
    (N'Кориандр'),
    (N'Фламенко'),
    (N'Несси'),
    (N'Табаско')
) AS Colors(ColorName)
WHERE NOT EXISTS (
    SELECT 1 FROM Cars WHERE ModelId = 1 AND Vin LIKE 'GS%'
);

-- Granta Sportline (используем Granta Седан как базовую модель, ModelId = 1)
INSERT INTO Cars (ModelId, Vin, Color, Status, Mileage, ProductionDate, CreatedAt)
SELECT 1, 
       'GSL' + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 500 AS NVARCHAR(3)), 3),
       ColorName,
       'Available',
       0,
       CAST(GETDATE() AS DATE),
       GETDATE()
FROM (VALUES 
    (N'Ледниковый'),
    (N'Пантера'),
    (N'Платина'),
    (N'Борнео'),
    (N'Капитан'),
    (N'Кориандр'),
    (N'Фламенко'),
    (N'Несси'),
    (N'Табаско')
) AS Colors(ColorName)
WHERE NOT EXISTS (
    SELECT 1 FROM Cars WHERE ModelId = 1 AND Vin LIKE 'GSL%'
);

