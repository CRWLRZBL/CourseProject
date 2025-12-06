import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { carService } from '../../../services/api/carService';
import { getModelFolderName, getConfigurationPrefix } from '../../../utils/imageUtils';
import './Step5Color.css';

interface Color {
  name: string;
  hexCode: string;
}

interface Step5ColorProps {
  modelId?: number;
  modelName?: string;
  configurationName?: string;
  selectedColorId: number | null;
  onColorSelect: (colorId: number, colorName: string) => void;
  onContinue?: () => void;
}

const Step5Color: React.FC<Step5ColorProps> = ({
  modelId,
  modelName,
  configurationName,
  selectedColorId,
  onColorSelect,
  onContinue,
}) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadColors();
  }, [modelId, modelName, configurationName]);

  // Функция для проверки существования изображения
  const checkImageExists = async (imagePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      let resolved = false;
      
      const resolveOnce = (value: boolean) => {
        if (!resolved) {
          resolved = true;
          resolve(value);
        }
      };
      
      img.onload = () => resolveOnce(true);
      img.onerror = () => resolveOnce(false);
      img.src = imagePath;
      
      // Таймаут на случай, если изображение загружается очень долго
      setTimeout(() => resolveOnce(false), 2000);
    });
  };

  const loadColors = async () => {
    if (!modelName) {
      setColors([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5171/api/cars/colors');
      if (response.ok) {
        const colorsData = await response.json();
        // Преобразуем формат данных
        const allColors = Array.isArray(colorsData) 
          ? colorsData.map((color: any) => ({
              name: color.name || color.colorName || 'Цвет',
              hexCode: color.hexCode || color.colorCode || '#CCCCCC',
            }))
          : [];

        // Фильтруем цвета по наличию изображений
        const modelFolder = getModelFolderName(modelName);
        const bodyType = configurationName || 'Sedan';
        const configPrefix = getConfigurationPrefix(bodyType, modelName, configurationName);
        
        // Проверяем все изображения последовательно для более точной проверки
        const imageChecks = [];
        for (const color of allColors) {
          // Нормализуем название цвета для поиска файла (убираем пробелы)
          const normalizedColorName = color.name.replace(/\s+/g, '');
          // Пробуем оба варианта: с пробелом и без
          const imagePath1 = `/images/cars/${modelFolder}/${configPrefix}-${color.name}.png`;
          const imagePath2 = `/images/cars/${modelFolder}/${configPrefix}-${normalizedColorName}.png`;
          
          // Также пробуем вариант с "Несси2" вместо "Несси 2"
          let imagePath3 = '';
          if (color.name === 'Несси 2' || color.name === 'Несси2') {
            imagePath3 = `/images/cars/${modelFolder}/${configPrefix}-Несси2.png`;
          }
          
          // Для Niva Travel также пробуем вариант с Travel вместо Travel-NEW
          let imagePath4 = '';
          if (configPrefix === 'Travel-NEW') {
            imagePath4 = `/images/cars/${modelFolder}/Travel-${color.name}.png`;
          }
          
          const exists1 = await checkImageExists(imagePath1);
          if (exists1) {
            imageChecks.push({ color, exists: true });
            continue;
          }
          
          const exists2 = await checkImageExists(imagePath2);
          if (exists2) {
            imageChecks.push({ color: { ...color, name: normalizedColorName }, exists: true });
            continue;
          }
          
          if (imagePath3) {
            const exists3 = await checkImageExists(imagePath3);
            if (exists3) {
              imageChecks.push({ color: { ...color, name: 'Несси2' }, exists: true });
              continue;
            }
          }
          
          if (imagePath4) {
            const exists4 = await checkImageExists(imagePath4);
            if (exists4) {
              imageChecks.push({ color, exists: true });
              continue;
            }
          }
          
          // Если ни один вариант не найден, не добавляем цвет
          imageChecks.push({ color, exists: false });
        }
        
        // Фильтруем только те цвета, для которых есть изображения
        const availableColors = imageChecks
          .filter(check => check.exists)
          .map(check => check.color);
        
        setColors(availableColors);
      }
    } catch (err) {
      setError('Ошибка при загрузке цветов');
      console.error('Error loading colors:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Функция для получения пути к изображению автомобиля в выбранном цвете
  const getCarImagePath = (): string => {
    if (!modelName) {
      return '/images/cars/default.jpg';
    }

    // Формируем путь к изображению на основе модели, комплектации и цвета
    // Путь: /images/cars/{ModelFolder}/{ConfigurationPrefix}-{ColorName}.png
    const modelFolder = getModelFolderName(modelName);
    // Для определения префикса используем modelName и configurationName
    // Если нет configurationName, используем 'Sedan' как fallback
    const bodyType = configurationName || 'Sedan';
    const configPrefix = getConfigurationPrefix(bodyType, modelName, configurationName);
    
    // Если цвет выбран, используем его, иначе используем базовый цвет Ледниковый
    const colorName = selectedColorId && colors.length >= selectedColorId
      ? colors[selectedColorId - 1].name
      : 'Ледниковый';
    
    return `/images/cars/${modelFolder}/${configPrefix}-${colorName}.png`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const selectedColor = selectedColorId ? colors[selectedColorId - 1] : null;

  return (
    <div className="step5-color">
      <h2 className="step-title mb-5">ЦВЕТ</h2>

      <div className="color-selection-container">
        {/* Изображение автомобиля */}
        <div className="car-image-section mb-5">
          <div className="car-image-wrapper">
            <img
              src={getCarImagePath()}
              alt="Автомобиль"
              className="car-image"
              style={{
                filter: selectedColor
                  ? `drop-shadow(0 0 20px ${selectedColor.hexCode}40)`
                  : 'none',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/cars/default.jpg';
              }}
            />
          </div>
        </div>

        {/* Палитра цветов */}
        <Card className="color-palette-card">
          <Card.Body>
            <div className="color-swatches">
              {colors.map((color, index) => {
                const colorId = index + 1;
                const isSelected = selectedColorId === colorId;

                return (
                  <div
                    key={colorId}
                    className={`color-swatch ${isSelected ? 'selected' : ''}`}
                    onClick={() => onColorSelect(colorId, color.name)}
                    style={{
                      backgroundColor: color.hexCode,
                    }}
                    title={color.name}
                  >
                    {isSelected && <span className="checkmark">✓</span>}
                  </div>
                );
              })}
            </div>

            {selectedColor && (
              <div className="color-info mt-4 text-center">
                <h4 className="color-name mb-2">{selectedColor.name.toUpperCase()}</h4>
                <p className="text-muted mb-0">Металлик</p>
                <div className="color-price mt-2">
                  {selectedColor.name !== 'Ледниковый' ? (
                    <>
                      <span className="text-muted small">Доплата: </span>
                      <span className="text-primary fw-bold">
                        {formatPrice(20000)}
                      </span>
                    </>
                  ) : (
                    <span className="text-success fw-bold">В базовой комплектации</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Кнопка продолжения */}
            {onContinue && selectedColorId && (
              <div className="mt-4 text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onContinue}
                  className="px-5"
                >
                  Продолжить →
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Step5Color;

