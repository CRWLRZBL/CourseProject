# Используем официальный образ .NET SDK для сборки
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем файл проекта и восстанавливаем зависимости
COPY CourseProjectAPI/CourseProjectAPI.csproj CourseProjectAPI/
RUN dotnet restore CourseProjectAPI/CourseProjectAPI.csproj

# Копируем остальные файлы и собираем проект
COPY CourseProjectAPI/ CourseProjectAPI/
WORKDIR /src/CourseProjectAPI
RUN dotnet build -c Release -o /app/build

# Публикуем приложение
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Финальный образ для запуска
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Копируем опубликованное приложение
COPY --from=publish /app/publish .

# Устанавливаем переменную окружения для ASP.NET Core
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "CourseProjectAPI.dll"]

