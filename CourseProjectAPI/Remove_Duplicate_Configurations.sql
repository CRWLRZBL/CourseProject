-- Удаление дублирующихся комплектаций
-- Оставляем только первую (с наименьшим ConfigurationID)

-- Granta Седан (ModelId = 1)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 1
    ) t
    WHERE rn > 1
);

-- Granta Хэтчбек (ModelId = 2)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 2
    ) t
    WHERE rn > 1
);

-- Granta Cross (ModelId = 3)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 3
    ) t
    WHERE rn > 1
);

-- Vesta Седан (ModelId = 4)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 4
    ) t
    WHERE rn > 1
);

-- Vesta Cross (ModelId = 5)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 5
    ) t
    WHERE rn > 1
);

-- Vesta SW (ModelId = 6)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 6
    ) t
    WHERE rn > 1
);

-- Vesta SW Cross (ModelId = 7)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 7
    ) t
    WHERE rn > 1
);

-- Largus Универсал (ModelId = 8)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 8
    ) t
    WHERE rn > 1
);

-- Niva Legend (ModelId = 9)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 9
    ) t
    WHERE rn > 1
);

-- Niva Travel (ModelId = 10)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 10
    ) t
    WHERE rn > 1
);

-- Iskra (ModelId = 11)
DELETE FROM Configurations 
WHERE ConfigurationID IN (
    SELECT ConfigurationID 
    FROM (
        SELECT ConfigurationID, 
               ROW_NUMBER() OVER (PARTITION BY ModelId, ConfigurationName ORDER BY ConfigurationID) as rn
        FROM Configurations
        WHERE ModelId = 11
    ) t
    WHERE rn > 1
);

