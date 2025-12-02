-- Миграция: Добавление полей для двигателя и КПП в таблицу Configurations
-- Выполните этот скрипт в вашей базе данных AutoSalon

USE AutoSalon;
GO

-- Добавление полей для двигателя и коробки передач
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Configurations]') AND name = 'EnginePower')
BEGIN
    ALTER TABLE [dbo].[Configurations]
    ADD [EnginePower] INT NULL;
    PRINT 'Поле EnginePower добавлено в таблицу Configurations';
END
ELSE
BEGIN
    PRINT 'Поле EnginePower уже существует в таблице Configurations';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Configurations]') AND name = 'EngineCapacity')
BEGIN
    ALTER TABLE [dbo].[Configurations]
    ADD [EngineCapacity] DECIMAL(4, 2) NULL;
    PRINT 'Поле EngineCapacity добавлено в таблицу Configurations';
END
ELSE
BEGIN
    PRINT 'Поле EngineCapacity уже существует в таблице Configurations';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Configurations]') AND name = 'FuelType')
BEGIN
    ALTER TABLE [dbo].[Configurations]
    ADD [FuelType] NVARCHAR(20) NULL;
    PRINT 'Поле FuelType добавлено в таблицу Configurations';
END
ELSE
BEGIN
    PRINT 'Поле FuelType уже существует в таблице Configurations';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Configurations]') AND name = 'TransmissionType')
BEGIN
    ALTER TABLE [dbo].[Configurations]
    ADD [TransmissionType] NVARCHAR(20) NULL;
    PRINT 'Поле TransmissionType добавлено в таблицу Configurations';
END
ELSE
BEGIN
    PRINT 'Поле TransmissionType уже существует в таблице Configurations';
END
GO

PRINT 'Миграция завершена успешно!';
GO

