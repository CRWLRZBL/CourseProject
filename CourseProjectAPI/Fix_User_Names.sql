-- Исправление имен пользователей - добавление первых букв

-- Обновляем имена пользователей
UPDATE UserProfiles
SET FirstName = N'Иван', LastName = N'Иванов'
WHERE UserId = 1 AND FirstName = N'ван' AND LastName = N'ванов';

UPDATE UserProfiles
SET FirstName = N'Петр', LastName = N'Петров'
WHERE UserId = 2 AND FirstName = N'етр' AND LastName = N'етров';

