-- Обновление описаний комплектаций с указанием количества передач

-- Обновляем описания для механических КПП (5MT)
UPDATE Configurations
SET Description = REPLACE(Description, N'механической КПП', N'механической КПП (5 передач)')
WHERE TransmissionType = 'Manual' AND Description LIKE N'%механической КПП%';

UPDATE Configurations
SET Description = REPLACE(Description, N'механической трансмиссией', N'механической трансмиссией (5 передач)')
WHERE TransmissionType = 'Manual' AND Description LIKE N'%механической трансмиссией%';

-- Обновляем описания для роботизированных КПП (6MT)
UPDATE Configurations
SET Description = REPLACE(Description, N'роботизированной КПП', N'роботизированной КПП (6 передач)')
WHERE TransmissionType = 'Robot' AND Description LIKE N'%роботизированной КПП%';

-- Обновляем описания для вариаторов CVT
UPDATE Configurations
SET Description = REPLACE(Description, N'вариатором CVT', N'вариатором CVT (бесступенчатая)')
WHERE TransmissionType = 'CVT' AND Description LIKE N'%вариатором CVT%';

UPDATE Configurations
SET Description = REPLACE(Description, N'CVT', N'CVT (бесступенчатая)')
WHERE TransmissionType = 'CVT' AND Description LIKE N'%CVT%' AND Description NOT LIKE N'%бесступенчатая%';

-- Обновляем описания для автоматических КПП
UPDATE Configurations
SET Description = REPLACE(Description, N'автоматической КПП', N'автоматической КПП (6 передач)')
WHERE TransmissionType = 'Automatic' AND Description LIKE N'%автоматической КПП%';

