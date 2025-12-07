-- =====================================================
-- Скрипт создания базы данных Autosalon
-- Полная структура базы данных со всеми таблицами,
-- индексами, внешними ключами и триггерами
-- =====================================================

USE master;
GO

-- Удаление базы данных, если она существует (для чистой установки)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Autosalon')
BEGIN
    ALTER DATABASE Autosalon SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE Autosalon;
END
GO

-- Создание базы данных
CREATE DATABASE Autosalon;
GO

USE Autosalon;
GO

-- =====================================================
-- Таблица: Roles (Роли пользователей)
-- =====================================================
CREATE TABLE [dbo].[Roles] (
    [RoleID] INT IDENTITY(1,1) NOT NULL,
    [RoleName] NVARCHAR(50) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    CONSTRAINT [PK__Roles__8AFACE3A71737522] PRIMARY KEY ([RoleID]),
    CONSTRAINT [UQ__Roles__8A2B61609852683A] UNIQUE ([RoleName])
);
GO

-- =====================================================
-- Таблица: Users (Пользователи)
-- =====================================================
CREATE TABLE [dbo].[Users] (
    [UserID] INT IDENTITY(1,1) NOT NULL,
    [Email] NVARCHAR(255) NOT NULL,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [RoleID] INT NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK__Users__1788CCAC05B3A282] PRIMARY KEY ([UserID]),
    CONSTRAINT [FK_Users_Roles] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Roles] ([RoleID]),
    CONSTRAINT [UQ__Users__A9D1053433B6664A] UNIQUE ([Email])
);
GO

CREATE INDEX [IX_Users_Email] ON [dbo].[Users] ([Email]);
GO

-- =====================================================
-- Таблица: UserProfiles (Профили пользователей)
-- =====================================================
CREATE TABLE [dbo].[UserProfiles] (
    [ProfileID] INT IDENTITY(1,1) NOT NULL,
    [UserID] INT NOT NULL,
    [FirstName] NVARCHAR(100) NOT NULL,
    [LastName] NVARCHAR(100) NOT NULL,
    [Phone] NVARCHAR(20) NULL,
    [Address] NVARCHAR(500) NULL,
    [DateOfBirth] DATE NULL,
    CONSTRAINT [PK__UserProf__290C8884920A62CC] PRIMARY KEY ([ProfileID]),
    CONSTRAINT [FK_UserProfiles_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [UQ__UserProf__1788CCAD084141F5] UNIQUE ([UserID])
);
GO

-- =====================================================
-- Таблица: Brands (Бренды)
-- =====================================================
CREATE TABLE [dbo].[Brands] (
    [BrandID] INT IDENTITY(1,1) NOT NULL,
    [BrandName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [Country] NVARCHAR(50) NULL,
    [LogoURL] NVARCHAR(500) NULL,
    CONSTRAINT [PK__Brands__DAD4F3BE1FBD0878] PRIMARY KEY ([BrandID]),
    CONSTRAINT [UQ__Brands__2206CE9BE376F531] UNIQUE ([BrandName])
);
GO

-- =====================================================
-- Таблица: Models (Модели автомобилей)
-- =====================================================
CREATE TABLE [dbo].[Models] (
    [ModelID] INT IDENTITY(1,1) NOT NULL,
    [BrandID] INT NOT NULL,
    [ModelName] NVARCHAR(100) NOT NULL,
    [ModelYear] INT NOT NULL,
    [BodyType] NVARCHAR(50) NOT NULL,
    [BasePrice] DECIMAL(15, 2) NOT NULL,
    [Description] NVARCHAR(1000) NULL,
    [EngineCapacity] DECIMAL(4, 2) NULL,
    [FuelType] NVARCHAR(20) NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [ImageUrl] NVARCHAR(500) NULL,
    CONSTRAINT [PK__Models__E8D7A1CC3A8CD188] PRIMARY KEY ([ModelID]),
    CONSTRAINT [FK_Models_Brands] FOREIGN KEY ([BrandID]) REFERENCES [dbo].[Brands] ([BrandID])
);
GO

CREATE INDEX [IX_Models_BrandID] ON [dbo].[Models] ([BrandID]);
GO

-- =====================================================
-- Таблица: Colors (Цвета)
-- =====================================================
CREATE TABLE [dbo].[Colors] (
    [ColorID] INT IDENTITY(1,1) NOT NULL,
    [ColorName] NVARCHAR(100) NOT NULL,
    [ColorCode] NVARCHAR(20) NOT NULL,
    [PriceModifier] DECIMAL(15, 2) NOT NULL DEFAULT 0,
    [IsAvailable] BIT NOT NULL DEFAULT 1,
    [ImageUrl] NVARCHAR(500) NULL,
    CONSTRAINT [PK_Colors_ColorID] PRIMARY KEY ([ColorID]),
    CONSTRAINT [UQ_Colors_ColorName] UNIQUE ([ColorName])
);
GO

-- =====================================================
-- Таблица: Engines (Двигатели)
-- =====================================================
CREATE TABLE [dbo].[Engines] (
    [EngineID] INT IDENTITY(1,1) NOT NULL,
    [EngineName] NVARCHAR(100) NOT NULL,
    [EngineCapacity] DECIMAL(4, 2) NOT NULL,
    [Power] INT NOT NULL,
    [FuelType] NVARCHAR(20) NOT NULL,
    [PriceModifier] DECIMAL(15, 2) NOT NULL DEFAULT 0,
    [IsAvailable] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Engines_EngineID] PRIMARY KEY ([EngineID]),
    CONSTRAINT [UQ_Engines_EngineName] UNIQUE ([EngineName])
);
GO

-- =====================================================
-- Таблица: Transmissions (Коробки передач)
-- =====================================================
CREATE TABLE [dbo].[Transmissions] (
    [TransmissionID] INT IDENTITY(1,1) NOT NULL,
    [TransmissionName] NVARCHAR(100) NOT NULL,
    [TransmissionType] NVARCHAR(20) NOT NULL,
    [Gears] INT NOT NULL,
    [PriceModifier] DECIMAL(15, 2) NOT NULL DEFAULT 0,
    [IsAvailable] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Transmissions_TransmissionID] PRIMARY KEY ([TransmissionID]),
    CONSTRAINT [UQ_Transmissions_TransmissionName] UNIQUE ([TransmissionName])
);
GO

-- =====================================================
-- Таблица: ModelColors (Связь моделей и цветов)
-- =====================================================
CREATE TABLE [dbo].[ModelColors] (
    [ModelID] INT NOT NULL,
    [ColorID] INT NOT NULL,
    [ImageUrl] NVARCHAR(500) NULL,
    CONSTRAINT [PK_ModelColors] PRIMARY KEY ([ModelID], [ColorID]),
    CONSTRAINT [FK_ModelColors_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ModelID]) ON DELETE CASCADE,
    CONSTRAINT [FK_ModelColors_Colors] FOREIGN KEY ([ColorID]) REFERENCES [dbo].[Colors] ([ColorID]) ON DELETE CASCADE
);
GO

-- =====================================================
-- Таблица: ModelEngines (Связь моделей и двигателей)
-- =====================================================
CREATE TABLE [dbo].[ModelEngines] (
    [ModelID] INT NOT NULL,
    [EngineID] INT NOT NULL,
    CONSTRAINT [PK_ModelEngines] PRIMARY KEY ([ModelID], [EngineID]),
    CONSTRAINT [FK_ModelEngines_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ModelID]) ON DELETE CASCADE,
    CONSTRAINT [FK_ModelEngines_Engines] FOREIGN KEY ([EngineID]) REFERENCES [dbo].[Engines] ([EngineID]) ON DELETE CASCADE
);
GO

-- =====================================================
-- Таблица: ModelTransmissions (Связь моделей и КПП)
-- =====================================================
CREATE TABLE [dbo].[ModelTransmissions] (
    [ModelID] INT NOT NULL,
    [TransmissionID] INT NOT NULL,
    CONSTRAINT [PK_ModelTransmissions] PRIMARY KEY ([ModelID], [TransmissionID]),
    CONSTRAINT [FK_ModelTransmissions_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ModelID]) ON DELETE CASCADE,
    CONSTRAINT [FK_ModelTransmissions_Transmissions] FOREIGN KEY ([TransmissionID]) REFERENCES [dbo].[Transmissions] ([TransmissionID]) ON DELETE CASCADE
);
GO

-- =====================================================
-- Таблица: Configurations (Комплектации)
-- =====================================================
CREATE TABLE [dbo].[Configurations] (
    [ConfigurationID] INT IDENTITY(1,1) NOT NULL,
    [ModelID] INT NOT NULL,
    [ConfigurationName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [AdditionalPrice] DECIMAL(15, 2) NOT NULL DEFAULT 0,
    [EnginePower] INT NULL,
    [EngineCapacity] DECIMAL(4, 2) NULL,
    [FuelType] NVARCHAR(20) NULL,
    [TransmissionType] NVARCHAR(20) NULL,
    CONSTRAINT [PK__Configur__95AA539BA454B50F] PRIMARY KEY ([ConfigurationID]),
    CONSTRAINT [FK_Configurations_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ModelID])
);
GO

-- =====================================================
-- Таблица: AdditionalOptions (Дополнительные опции)
-- =====================================================
CREATE TABLE [dbo].[AdditionalOptions] (
    [OptionID] INT IDENTITY(1,1) NOT NULL,
    [OptionName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [OptionPrice] DECIMAL(15, 2) NOT NULL,
    [Category] NVARCHAR(50) NULL,
    CONSTRAINT [PK__Addition__92C7A1DF1C48BBCA] PRIMARY KEY ([OptionID])
);
GO

-- =====================================================
-- Таблица: Cars (Автомобили)
-- =====================================================
CREATE TABLE [dbo].[Cars] (
    [CarID] INT IDENTITY(1,1) NOT NULL,
    [ModelID] INT NOT NULL,
    [VIN] NVARCHAR(17) NOT NULL,
    [Color] NVARCHAR(50) NOT NULL,
    [ProductionDate] DATE NULL,
    [Mileage] INT NOT NULL DEFAULT 0,
    [Status] NVARCHAR(20) NOT NULL DEFAULT 'Available',
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK__Cars__68A0340ED23855BA] PRIMARY KEY ([CarID]),
    CONSTRAINT [FK_Cars_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ModelID]),
    CONSTRAINT [UQ__Cars__C5DF234CB587C62F] UNIQUE ([VIN])
);
GO

CREATE INDEX [IX_Cars_Status] ON [dbo].[Cars] ([Status]);
GO

-- =====================================================
-- Таблица: Orders (Заказы)
-- =====================================================
CREATE TABLE [dbo].[Orders] (
    [OrderID] INT IDENTITY(1,1) NOT NULL,
    [UserID] INT NOT NULL,
    [CarID] INT NOT NULL,
    [ConfigurationID] INT NOT NULL,
    [TotalPrice] DECIMAL(15, 2) NOT NULL,
    [OrderStatus] NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    [OrderDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [DeliveryDate] DATE NULL,
    [Notes] NVARCHAR(1000) NULL,
    CONSTRAINT [PK__Orders__C3905BAF5870167A] PRIMARY KEY ([OrderID]),
    CONSTRAINT [FK_Orders_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK_Orders_Cars] FOREIGN KEY ([CarID]) REFERENCES [dbo].[Cars] ([CarID]),
    CONSTRAINT [FK_Orders_Configurations] FOREIGN KEY ([ConfigurationID]) REFERENCES [dbo].[Configurations] ([ConfigurationID])
);
GO

CREATE INDEX [IX_Orders_UserID] ON [dbo].[Orders] ([UserID]);
CREATE INDEX [IX_Orders_Status] ON [dbo].[Orders] ([OrderStatus]);
GO

-- =====================================================
-- Таблица: OrderOptions (Опции в заказе)
-- =====================================================
CREATE TABLE [dbo].[OrderOptions] (
    [OrderOptionID] INT IDENTITY(1,1) NOT NULL,
    [OrderID] INT NOT NULL,
    [OptionID] INT NOT NULL,
    [Quantity] INT NOT NULL DEFAULT 1,
    [PriceAtOrder] DECIMAL(15, 2) NOT NULL,
    CONSTRAINT [PK__OrderOpt__59E1EBBC50C34C36] PRIMARY KEY ([OrderOptionID]),
    CONSTRAINT [FK_OrderOptions_Orders] FOREIGN KEY ([OrderID]) REFERENCES [dbo].[Orders] ([OrderID]),
    CONSTRAINT [FK_OrderOptions_AdditionalOptions] FOREIGN KEY ([OptionID]) REFERENCES [dbo].[AdditionalOptions] ([OptionID])
);
GO

-- =====================================================
-- Таблица: OrderStatusHistory (История изменений статусов заказов)
-- =====================================================
CREATE TABLE [dbo].[OrderStatusHistory] (
    [HistoryID] INT IDENTITY(1,1) NOT NULL,
    [OrderID] INT NOT NULL,
    [Status] NVARCHAR(20) NOT NULL,
    [ChangedAt] DATETIME NOT NULL DEFAULT GETDATE(),
    [ChangedBy] INT NULL,
    [Notes] NVARCHAR(500) NULL,
    CONSTRAINT [PK__OrderSta__4D7B4ADDAA186F83] PRIMARY KEY ([HistoryID]),
    CONSTRAINT [FK_OrderStatusHistory_Orders] FOREIGN KEY ([OrderID]) REFERENCES [dbo].[Orders] ([OrderID]),
    CONSTRAINT [FK_OrderStatusHistory_Users] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID])
);
GO

-- =====================================================
-- Триггеры
-- =====================================================

-- Триггер для предотвращения дублирования email
CREATE TRIGGER [tr_Users_PreventDuplicateEmail]
ON [dbo].[Users]
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM [dbo].[Users] u
        INNER JOIN inserted i ON u.Email = i.Email AND u.UserID != i.UserID
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Email уже существует', 16, 1);
    END
END;
GO

-- Триггер для обновления UpdatedAt
CREATE TRIGGER [tr_Users_UpdateTimestamp]
ON [dbo].[Users]
AFTER UPDATE
AS
BEGIN
    UPDATE [dbo].[Users]
    SET [UpdatedAt] = GETDATE()
    FROM [dbo].[Users] u
    INNER JOIN inserted i ON u.UserID = i.UserID;
END;
GO

-- Триггер для истории изменений статусов заказов
CREATE TRIGGER [tr_Orders_StatusChange]
ON [dbo].[Orders]
AFTER UPDATE
AS
BEGIN
    IF UPDATE([OrderStatus])
    BEGIN
        INSERT INTO [dbo].[OrderStatusHistory] ([OrderID], [Status], [ChangedAt], [Notes])
        SELECT 
            i.[OrderID],
            i.[OrderStatus],
            GETDATE(),
            'Статус изменен системой'
        FROM inserted i
        INNER JOIN deleted d ON i.[OrderID] = d.[OrderID]
        WHERE i.[OrderStatus] != d.[OrderStatus];
    END
END;
GO

-- =====================================================
-- Начальные данные (базовые роли)
-- =====================================================

-- Вставка базовых ролей
INSERT INTO [dbo].[Roles] ([RoleName], [Description]) VALUES
    ('Admin', 'Администратор системы'),
    ('Manager', 'Менеджер'),
    ('Client', 'Клиент');
GO

PRINT 'База данных Autosalon успешно создана!';
GO

