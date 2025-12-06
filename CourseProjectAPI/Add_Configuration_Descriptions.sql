-- Добавление описаний для комплектаций, где они отсутствуют

-- Granta Седан
UPDATE Configurations
SET Description = N'Базовая комплектация с двигателем 1.6 л, 90 л.с. и механической КПП'
WHERE ModelId = 1 AND ConfigurationName = N'Standard' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Базовая комплектация с дополнительными опциями'
WHERE ModelId = 1 AND ConfigurationName = N'Standard Plus' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Comfort с улучшенным оснащением'
WHERE ModelId = 1 AND ConfigurationName = N'Comfort' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Life с расширенным набором опций'
WHERE ModelId = 1 AND ConfigurationName = N'Life' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Classic с классическим набором опций'
WHERE ModelId = 1 AND ConfigurationName = N'Classic' AND (Description IS NULL OR Description = '');

-- Granta Cross
UPDATE Configurations
SET Description = N'Комплектация Cross с защитными элементами и увеличенным дорожным просветом'
WHERE ModelId = 3 AND ConfigurationName LIKE N'%Cross%' AND (Description IS NULL OR Description = '');

-- Vesta Седан
UPDATE Configurations
SET Description = N'Базовая комплектация с двигателем 1.6 л, 90 л.с. и механической КПП'
WHERE ModelId = 4 AND ConfigurationName = N'Standard' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Enjoy с двигателем 1.6 л, 106 л.с. и вариатором CVT'
WHERE ModelId = 4 AND ConfigurationName = N'Enjoy' AND EnginePower = 106 AND TransmissionType = 'CVT' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Techno с двигателем 1.8 л, 122 л.с. и вариатором CVT'
WHERE ModelId = 4 AND ConfigurationName = N'Techno' AND EnginePower = 122 AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 4 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Vesta SW
UPDATE Configurations
SET Description = N'Комплектация Enjoy с двигателем 1.6 л, 106 л.с. и вариатором CVT'
WHERE ModelId = 6 AND ConfigurationName = N'Enjoy' AND EnginePower = 106 AND TransmissionType = 'CVT' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Techno с двигателем 1.8 л, 122 л.с. и вариатором CVT'
WHERE ModelId = 6 AND ConfigurationName = N'Techno' AND EnginePower = 122 AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 6 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Vesta SW Cross
UPDATE Configurations
SET Description = N'Комплектация Cross с двигателем 1.8 л, 122 л.с. и вариатором CVT'
WHERE ModelId = 7 AND ConfigurationName = N'Cross' AND EnginePower = 122 AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 7 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Vesta Cross
UPDATE Configurations
SET Description = N'Комплектация Cross с двигателем 1.8 л, 122 л.с. и вариатором CVT'
WHERE ModelId = 5 AND ConfigurationName = N'Cross' AND EnginePower = 122 AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 5 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Iskra
UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 11 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Iskra SW
UPDATE Configurations
SET Description = N'Комплектация Comfort с двигателем 1.8 л, 122 л.с. и механической КПП'
WHERE ModelId = 13 AND ConfigurationName = N'Comfort' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 13 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Iskra SW Cross
UPDATE Configurations
SET Description = N'Комплектация Cross с двигателем 1.8 л, 122 л.с. и механической КПП'
WHERE ModelId = 14 AND ConfigurationName = N'Cross' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Luxury H4M с двигателем H4M 1.6 л, 113 л.с. и вариатором CVT'
WHERE ModelId = 14 AND ConfigurationName LIKE N'%H4M%' AND (Description IS NULL OR Description = '');

-- Largus Универсал
UPDATE Configurations
SET Description = N'Базовая комплектация с двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 8 AND ConfigurationName = N'Comfort' AND EnginePower = 87 AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Enjoy с двигателем 1.6 л, 106 л.с. и механической КПП'
WHERE ModelId = 8 AND ConfigurationName = N'Enjoy' AND EnginePower = 106 AND (Description IS NULL OR Description = '');

-- Largus Cross
UPDATE Configurations
SET Description = N'Комплектация Cross с двигателем 1.6 л, 106 л.с. и механической КПП'
WHERE ModelId = 15 AND ConfigurationName = N'Cross' AND (Description IS NULL OR Description = '');

-- Largus Универсал CNG
UPDATE Configurations
SET Description = N'Базовая комплектация с газовым двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 18 AND ConfigurationName = N'Standard' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Comfort с газовым двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 18 AND ConfigurationName = N'Comfort' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Life с газовым двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 18 AND ConfigurationName = N'Life' AND (Description IS NULL OR Description = '');

-- Largus Фургон CNG
UPDATE Configurations
SET Description = N'Базовая комплектация с газовым двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 17 AND ConfigurationName = N'Standard' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Comfort с газовым двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 17 AND ConfigurationName = N'Comfort' AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация Life с газовым двигателем 1.6 л, 87 л.с. и механической КПП'
WHERE ModelId = 17 AND ConfigurationName = N'Life' AND (Description IS NULL OR Description = '');

-- Aura
UPDATE Configurations
SET Description = N'Комплектация с двигателем 1.8 л, 122 л.с. и вариатором CVT'
WHERE ModelId = 12 AND (Description IS NULL OR Description = '');

-- Niva Legend
UPDATE Configurations
SET Description = N'Комплектация с двигателем 1.7 л, 83 л.с. и механической КПП, полный привод'
WHERE ModelId IN (9, 19, 20, 21) AND (Description IS NULL OR Description = '');

-- Niva Travel
UPDATE Configurations
SET Description = N'Комплектация с двигателем 1.7 л, 83 л.с. и механической КПП, полный привод'
WHERE ModelId = 10 AND EnginePower = 83 AND (Description IS NULL OR Description = '');

UPDATE Configurations
SET Description = N'Комплектация с двигателем 1.8 л, 90 л.с. и механической КПП, полный привод'
WHERE ModelId = 10 AND EnginePower = 90 AND (Description IS NULL OR Description = '');

