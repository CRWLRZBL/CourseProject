import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { reportService } from '../../services/api/reportService';

const SalesReportExport: React.FC = () => {
  const [period, setPeriod] = useState<'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    try {
      setLoading(true);
      setError('');

      let start: string | undefined;
      let end: string | undefined;

      if (period === 'custom') {
        if (!startDate || !endDate) {
          setError('Укажите начальную и конечную даты');
          return;
        }
        start = startDate;
        end = endDate;
      }

      const blob = await reportService.exportSalesReportPdf(start, end, undefined, period);
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = period === 'month' 
        ? `sales_report_month_${new Date().toISOString().split('T')[0]}.pdf`
        : period === 'year'
        ? `sales_report_year_${new Date().getFullYear()}.pdf`
        : `sales_report_${startDate}_${endDate}.pdf`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при экспорте отчета');
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-light">
        <h4 className="mb-0">📊 Экспорт отчета по продажам</h4>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Период отчета</Form.Label>
            <Form.Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'month' | 'year' | 'custom')}
            >
              <option value="month">За текущий месяц</option>
              <option value="year">За текущий год</option>
              <option value="custom">Произвольный период</option>
            </Form.Select>
          </Form.Group>

          {period === 'custom' && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Начальная дата</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Конечная дата</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Button
            variant="primary"
            onClick={handleExport}
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Генерация PDF...' : '📥 Экспортировать в PDF'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SalesReportExport;

