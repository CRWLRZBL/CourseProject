import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Model } from '../../services/models/car';
import { carService } from '../../services/api/carService';
import Step1Model from './configurator/Step1Model';
import Step2Configuration from './configurator/Step2Configuration';
import Step3EngineTransmission from './configurator/Step3EngineTransmission';
import Step4Options from './configurator/Step4Options';
import Step5Color from './configurator/Step5Color';
import Step6Summary from './configurator/Step6Summary';
import './configurator/ConfiguratorWizard.css';

export interface ConfiguratorState {
  // Шаг 1: Семейство и модель
  selectedModel: Model | null;
  
  // Шаг 2: Комплектация
  selectedConfigurationId: number | null;
  
  // Шаг 3: Двигатель и трансмиссия
  selectedEngineId: number | null;
  selectedTransmissionId: number | null;
  
  // Шаг 4: Опции
  selectedOptionIds: number[];
  
  // Шаг 5: Цвет
  selectedColorId: number | null;
  selectedColorName: string | null; // Сохраняем название выбранного цвета
  
  // Итоговая цена
  totalPrice: number;
}

const STEPS = [
  { id: 1, title: 'Модель', key: 'model' },
  { id: 2, title: 'Комплектация', key: 'configuration' },
  { id: 3, title: 'Двигатель', key: 'engine' },
  { id: 4, title: 'Опции', key: 'options' },
  { id: 5, title: 'Цвет', key: 'color' },
  { id: 6, title: 'Итог', key: 'summary' },
];

const CarConfiguratorWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<ConfiguratorState>({
    selectedModel: null,
    selectedConfigurationId: null,
    selectedEngineId: null,
    selectedTransmissionId: null,
    selectedOptionIds: [],
    selectedColorId: null,
    selectedColorName: null,
    totalPrice: 0,
  });
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<{
    configuration?: { configurationId: number; configurationName: string };
  }>({});

  useEffect(() => {
    loadModels();
  }, []);

  // Загружаем предвыбранную модель из URL параметров
  useEffect(() => {
    const modelIdParam = searchParams.get('modelId');
    if (modelIdParam && models.length > 0) {
      const modelId = parseInt(modelIdParam, 10);
      const model = models.find(m => m.modelId === modelId);
      if (model && (!state.selectedModel || state.selectedModel.modelId !== modelId)) {
        setState(prev => ({ ...prev, selectedModel: model }));
        // Автоматически переходим на следующий шаг, если модель выбрана
        if (currentStep === 1) {
          setCurrentStep(2);
        }
      }
    }
  }, [models, searchParams]);

  useEffect(() => {
    calculateTotalPrice();
  }, [
    state.selectedModel,
    state.selectedConfigurationId,
    state.selectedEngineId,
    state.selectedTransmissionId,
    state.selectedOptionIds,
    state.selectedColorId,
  ]);

  const loadModels = async () => {
    try {
      setLoading(true);
      const modelsData = await carService.getModels();
      setModels(modelsData);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    // Расчет цены на основе выбранных опций
    let price = state.selectedModel?.basePrice || 0;
    
    // TODO: Добавить расчет доплат за комплектацию, двигатель, трансмиссию, цвет и опции
    // Пока используем базовую цену модели
    setState(prev => ({ ...prev, totalPrice: price }));
  };

  const updateState = (updates: Partial<ConfiguratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const canGoToNextStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return state.selectedModel !== null;
      case 2:
        return state.selectedConfigurationId !== null;
      case 3:
        return state.selectedEngineId !== null && state.selectedTransmissionId !== null;
      case 4:
        return true; // Опции опциональны
      case 5:
        return state.selectedColorId !== null;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoToNextStep() && currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Можно переходить только к пройденным шагам
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Model
            models={models}
            selectedModel={state.selectedModel}
            onModelSelect={(model) => {
              updateState({ selectedModel: model });
              // Автоматически переходим на следующий шаг после выбора модели
              setTimeout(() => goToNextStep(), 300);
            }}
          />
        );
      case 2:
        return (
          <Step2Configuration
            modelId={state.selectedModel?.modelId}
            selectedConfigurationId={state.selectedConfigurationId}
            onConfigurationSelect={async (configId) => {
              updateState({ selectedConfigurationId: configId });
              // Загружаем название комплектации для использования в Step5Color
              try {
                if (state.selectedModel?.modelId) {
                  const configs = await carService.getConfigurationsByModelId(state.selectedModel.modelId);
                  const config = configs.find(c => c.configurationId === configId);
                  if (config) {
                    setSummaryData({ configuration: { configurationId: config.configurationId, configurationName: config.configurationName } });
                  }
                }
              } catch (err) {
                console.error('Error loading configuration name:', err);
              }
              // Автоматически переходим на следующий шаг после выбора комплектации
              setTimeout(() => goToNextStep(), 300);
            }}
          />
        );
      case 3:
        return (
          <Step3EngineTransmission
            modelId={state.selectedModel?.modelId}
            modelName={state.selectedModel?.modelName}
            configurationId={state.selectedConfigurationId}
            selectedEngineId={state.selectedEngineId}
            selectedTransmissionId={state.selectedTransmissionId}
            onEngineSelect={(engineId) => {
              updateState({ selectedEngineId: engineId });
              // Автоматически выбираем первую трансмиссию и переходим дальше
              setTimeout(() => {
                updateState({ selectedTransmissionId: 1 });
                setTimeout(() => goToNextStep(), 300);
              }, 300);
            }}
            onTransmissionSelect={(transmissionId) => {
              updateState({ selectedTransmissionId: transmissionId });
              // Автоматически переходим на следующий шаг после выбора трансмиссии
              setTimeout(() => goToNextStep(), 300);
            }}
          />
        );
      case 4:
        return (
          <Step4Options
            modelId={state.selectedModel?.modelId}
            selectedOptionIds={state.selectedOptionIds}
            onOptionsChange={(optionIds) => updateState({ selectedOptionIds: optionIds })}
            onContinue={() => goToNextStep()}
          />
        );
      case 5:
        return (
          <Step5Color
            modelId={state.selectedModel?.modelId}
            modelName={state.selectedModel?.modelName}
            bodyType={state.selectedModel?.bodyType}
            configurationName={state.selectedConfigurationId 
              ? summaryData.configuration?.configurationName 
              : undefined}
            selectedColorId={state.selectedColorId}
            onColorSelect={(colorId, colorName) => {
              updateState({ selectedColorId: colorId, selectedColorName: colorName });
            }}
            onContinue={() => goToNextStep()}
          />
        );
      case 6:
        return (
          <Step6Summary
            state={state}
            onOrderCreate={() => {
              // Переход на страницу оформления заказа с передачей всех данных
              const params = new URLSearchParams();
              if (state.selectedModel?.modelId) {
                params.append('modelId', state.selectedModel.modelId.toString());
              }
              if (state.selectedConfigurationId) {
                params.append('configurationId', state.selectedConfigurationId.toString());
              }
              if (state.selectedColorName) {
                params.append('color', state.selectedColorName);
              }
              if (state.selectedOptionIds.length > 0) {
                params.append('optionIds', state.selectedOptionIds.join(','));
              }
              navigate(`/order?${params.toString()}`);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </Container>
    );
  }

  return (
    <div className="configurator-wizard">
      {/* Навигация по шагам */}
      <div className="wizard-header">
        <Container>
          <h1 className="wizard-title">
            {STEPS.find(s => s.id === currentStep)?.title.toUpperCase()}
          </h1>
          <div className="wizard-steps">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`wizard-step ${step.id === currentStep ? 'active' : ''} ${
                  step.id < currentStep ? 'completed' : ''
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="step-number">
                  {step.id < currentStep ? (
                    <span className="checkmark">✓</span>
                  ) : (
                    <span>{String(step.id).padStart(2, '0')}</span>
                  )}
                </div>
                <div className="step-title">{step.title}</div>
                {step.id === currentStep && <div className="step-indicator" />}
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Контент шага */}
      <div className="wizard-content">
        <Container>{renderStep()}</Container>
      </div>
    </div>
  );
};

export default CarConfiguratorWizard;

