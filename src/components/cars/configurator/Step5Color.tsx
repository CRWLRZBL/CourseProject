import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { carService } from '../../../services/api/carService';
import { getModelImagePath } from '../../../utils/imageUtils';
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
  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    loadColors();
  }, [modelId, modelName, configurationName]);

  // Автоматически выбираем первый доступный цвет при загрузке, если цвет не выбран
  useEffect(() => {
    if (colors.length > 0 && selectedColorId === null && !hasAutoSelectedRef.current) {
      // Всегда выбираем первый цвет из списка доступных цветов
      const colorId = 1;
      hasAutoSelectedRef.current = true;
      onColorSelect(colorId, colors[0].name);
      
      // Отладочное логирование
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Auto Select] Auto-selected first color: ${colors[0].name} (ID: ${colorId}) for model: ${modelName}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.length, selectedColorId]); // Используем colors.length вместо colors, чтобы избежать лишних вызовов

  // Сбрасываем флаг при изменении модели или комплектации
  useEffect(() => {
    hasAutoSelectedRef.current = false;
  }, [modelId, modelName, configurationName]);

  // Функция для проверки существования изображения без ошибок в консоли
  const checkImageExists = async (imagePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Используем Image объект для проверки (более надежно, чем fetch)
      const img = new Image();
      let resolved = false;
      
      const resolveOnce = (value: boolean) => {
        if (!resolved) {
          resolved = true;
          // Очищаем обработчики, чтобы избежать утечек памяти
          img.onerror = null;
          img.onload = null;
          resolve(value);
        }
      };
      
      // Увеличиваем таймаут до 3 секунд для более надежной проверки
      const timeout = setTimeout(() => {
        resolveOnce(false);
      }, 3000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolveOnce(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolveOnce(false);
      };
      
      // Устанавливаем src после настройки всех обработчиков
      img.src = imagePath;
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
      const colorsData = await carService.getColors();
      // Преобразуем формат данных
      const allColors = Array.isArray(colorsData) 
        ? colorsData.map((color: any) => ({
            name: color.name || color.colorName || 'Цвет',
            hexCode: color.hexCode || color.colorCode || '#CCCCCC',
          }))
        : [];

      // Фильтруем цвета по наличию изображений для данной модели и комплектации
      // Используем configurationName как bodyType, если оно есть, иначе используем 'Sedan'
      const bodyType = configurationName || 'Sedan';
      
      // Проверяем все цвета последовательно с задержкой, чтобы не перегружать браузер
      const filteredColors: Color[] = [];
      
      for (const color of allColors) {
        // Формируем путь к изображению для данного цвета
        const imagePath = getModelImagePath(modelName, bodyType, undefined, configurationName, color.name);
        
        // Проверяем существование изображения
        const exists = await checkImageExists(imagePath);
        
        // Отладочное логирование (можно убрать в production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Color Check] Model: ${modelName}, Config: ${configurationName}, BodyType: ${bodyType}, Color: ${color.name}, Path: ${imagePath}, Exists: ${exists}`);
        }
        
        if (exists) {
          filteredColors.push(color);
        }
        
        // Небольшая задержка между проверками, чтобы не перегружать браузер
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Если не найдено ни одного цвета, логируем предупреждение
      if (filteredColors.length === 0 && allColors.length > 0) {
        console.warn(`[Color Check] No available colors found for model: ${modelName}, configuration: ${configurationName}`);
      }
      
      setColors(filteredColors);
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
      // Если нет модели, возвращаем базовое изображение Granta в цвете Ледниковый
      return '/images/cars/Granta/Sedan-Ледниковый.png';
    }

    // Используем функцию getModelImagePath из imageUtils для правильного формирования пути
    const currentBodyType = bodyType || configurationName || 'Sedan';
    const colorName = selectedColorId && colors.length > 0 && selectedColorId <= colors.length
      ? colors[selectedColorId - 1].name
      : null;
    
    return getModelImagePath(modelName, currentBodyType, undefined, configurationName, colorName);
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
                // При ошибке используем базовое изображение модели в цвете Ледниковый
                (e.target as HTMLImageElement).src = getModelImagePath(modelName || '', bodyType || '', undefined, configurationName, 'Ледниковый');
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

