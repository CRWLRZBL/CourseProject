import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Model } from '../../services/models/car';
import ModelCard from './ModelCard';

interface ModelListProps {
  models: Model[];
}

const ModelList: React.FC<ModelListProps> = ({ models }) => {
  return (
    <Row>
      {models.map(model => (
        <Col key={model.modelId} xs={12} sm={6} lg={4} className="mb-4">
          <ModelCard model={model} />
        </Col>
      ))}
    </Row>
  );
};

export default ModelList;

