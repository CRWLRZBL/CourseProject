-- Добавление таблиц для цветов, двигателей и трансмиссий

-- Таблица цветов
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Colors]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Colors] (
        [ColorID] INT IDENTITY(1,1) PRIMARY KEY,
        [ColorName] NVARCHAR(100) NOT NULL,
        [ColorCode] NVARCHAR(20) NOT NULL, -- HEX код цвета
        [PriceModifier] DECIMAL(15, 2) DEFAULT 0,
        [IsAvailable] BIT DEFAULT 1,
        [ImageUrl] NVARCHAR(500) NULL, -- URL изображения для этого цвета
        CONSTRAINT [UQ_Colors_ColorName] UNIQUE ([ColorName])
    );
    
    -- Добавляем индексы
    CREATE INDEX [IX_Colors_IsAvailable] ON [dbo].[Colors]([IsAvailable]);
END
GO

-- Таблица двигателей
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Engines]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Engines] (
        [EngineID] INT IDENTITY(1,1) PRIMARY KEY,
        [EngineName] NVARCHAR(100) NOT NULL,
        [EngineCapacity] DECIMAL(4, 2) NOT NULL, -- Объем в литрах
        [Power] INT NOT NULL, -- Мощность в л.с.
        [FuelType] NVARCHAR(20) NOT NULL, -- Petrol, Diesel, Electric, Hybrid
        [PriceModifier] DECIMAL(15, 2) DEFAULT 0,
        [IsAvailable] BIT DEFAULT 1,
        CONSTRAINT [UQ_Engines_EngineName] UNIQUE ([EngineName])
    );
    
    CREATE INDEX [IX_Engines_FuelType] ON [dbo].[Engines]([FuelType]);
    CREATE INDEX [IX_Engines_IsAvailable] ON [dbo].[Engines]([IsAvailable]);
END
GO

-- Таблица трансмиссий
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Transmissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Transmissions] (
        [TransmissionID] INT IDENTITY(1,1) PRIMARY KEY,
        [TransmissionName] NVARCHAR(100) NOT NULL,
        [TransmissionType] NVARCHAR(20) NOT NULL, -- Manual, Automatic, CVT, Robot
        [Gears] INT NOT NULL, -- Количество передач
        [PriceModifier] DECIMAL(15, 2) DEFAULT 0,
        [IsAvailable] BIT DEFAULT 1,
        CONSTRAINT [UQ_Transmissions_TransmissionName] UNIQUE ([TransmissionName])
    );
    
    CREATE INDEX [IX_Transmissions_TransmissionType] ON [dbo].[Transmissions]([TransmissionType]);
    CREATE INDEX [IX_Transmissions_IsAvailable] ON [dbo].[Transmissions]([IsAvailable]);
END
GO

-- Связь моделей с цветами (многие ко многим)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ModelColors]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ModelColors] (
        [ModelID] INT NOT NULL,
        [ColorID] INT NOT NULL,
        [ImageUrl] NVARCHAR(500) NULL, -- Специфичное изображение для модели+цвета
        PRIMARY KEY ([ModelID], [ColorID]),
        CONSTRAINT [FK_ModelColors_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models]([ModelID]) ON DELETE CASCADE,
        CONSTRAINT [FK_ModelColors_Colors] FOREIGN KEY ([ColorID]) REFERENCES [dbo].[Colors]([ColorID]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_ModelColors_ModelID] ON [dbo].[ModelColors]([ModelID]);
    CREATE INDEX [IX_ModelColors_ColorID] ON [dbo].[ModelColors]([ColorID]);
END
GO

-- Связь моделей с двигателями (многие ко многим)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ModelEngines]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ModelEngines] (
        [ModelID] INT NOT NULL,
        [EngineID] INT NOT NULL,
        PRIMARY KEY ([ModelID], [EngineID]),
        CONSTRAINT [FK_ModelEngines_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models]([ModelID]) ON DELETE CASCADE,
        CONSTRAINT [FK_ModelEngines_Engines] FOREIGN KEY ([EngineID]) REFERENCES [dbo].[Engines]([EngineID]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_ModelEngines_ModelID] ON [dbo].[ModelEngines]([ModelID]);
    CREATE INDEX [IX_ModelEngines_EngineID] ON [dbo].[ModelEngines]([EngineID]);
END
GO

-- Связь моделей с трансмиссиями (многие ко многим)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ModelTransmissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ModelTransmissions] (
        [ModelID] INT NOT NULL,
        [TransmissionID] INT NOT NULL,
        PRIMARY KEY ([ModelID], [TransmissionID]),
        CONSTRAINT [FK_ModelTransmissions_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models]([ModelID]) ON DELETE CASCADE,
        CONSTRAINT [FK_ModelTransmissions_Transmissions] FOREIGN KEY ([TransmissionID]) REFERENCES [dbo].[Transmissions]([TransmissionID]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_ModelTransmissions_ModelID] ON [dbo].[ModelTransmissions]([ModelID]);
    CREATE INDEX [IX_ModelTransmissions_TransmissionID] ON [dbo].[ModelTransmissions]([TransmissionID]);
END
GO

-- Добавляем поле ImageUrl в Models для базового изображения модели
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Models]') AND name = 'ImageUrl')
BEGIN
    ALTER TABLE [dbo].[Models] ADD [ImageUrl] NVARCHAR(500) NULL;
END
GO

-- Заполняем базовые данные для цветов
IF NOT EXISTS (SELECT * FROM [dbo].[Colors] WHERE [ColorName] = 'Белый')
BEGIN
    INSERT INTO [dbo].[Colors] ([ColorName], [ColorCode], [PriceModifier], [IsAvailable], [ImageUrl])
    VALUES 
        ('Белый', '#FFFFFF', 0, 1, NULL),
        ('Черный', '#000000', 15000, 1, NULL),
        ('Серебристый', '#C0C0C0', 20000, 1, NULL),
        ('Красный', '#FF0000', 25000, 1, NULL),
        ('Синий', '#0000FF', 22000, 1, NULL),
        ('Серый', '#808080', 10000, 1, NULL),
        ('Бежевый', '#F5F5DC', 15000, 1, NULL),
        ('Оранжевый', '#FFA500', 30000, 1, NULL);
END
GO

-- Заполняем базовые данные для двигателей
IF NOT EXISTS (SELECT * FROM [dbo].[Engines] WHERE [EngineName] = '1.6L Бензин')
BEGIN
    INSERT INTO [dbo].[Engines] ([EngineName], [EngineCapacity], [Power], [FuelType], [PriceModifier], [IsAvailable])
    VALUES 
        ('1.6L Бензин', 1.6, 90, 'Petrol', 0, 1),
        ('1.6L Бензин Turbo', 1.6, 106, 'Petrol', 50000, 1),
        ('1.8L Бензин', 1.8, 122, 'Petrol', 80000, 1),
        ('1.5L Бензин', 1.5, 113, 'Petrol', 40000, 1);
END
GO

-- Заполняем базовые данные для трансмиссий
IF NOT EXISTS (SELECT * FROM [dbo].[Transmissions] WHERE [TransmissionName] = 'Механика 5МТ')
BEGIN
    INSERT INTO [dbo].[Transmissions] ([TransmissionName], [TransmissionType], [Gears], [PriceModifier], [IsAvailable])
    VALUES 
        ('Механика 5МТ', 'Manual', 5, 0, 1),
        ('Механика 6МТ', 'Manual', 6, 20000, 1),
        ('Автомат 4АТ', 'Automatic', 4, 100000, 1),
        ('Автомат 6АТ', 'Automatic', 6, 150000, 1),
        ('Вариатор CVT', 'CVT', 0, 120000, 1),
        ('Робот AMT', 'Robot', 5, 80000, 1);
END
GO

PRINT 'Таблицы Colors, Engines, Transmissions и связи успешно созданы!';
GO

