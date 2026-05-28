import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Table,
  Select,
  Button,
  Space,
  Tag,
  message,
  Row,
  Col,
  Statistic,
  Spin,
} from 'antd';
import {
  LineChartOutlined,
  ShoppingCartOutlined,
  AlertOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { reportApi } from '../../api';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesForecast {
  productId: number;
  productName: string;
  productCode: string;
  date: string;
  forecastQuantity: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

interface PurchaseSuggestion {
  productId: number;
  productName: string;
  productCode: string;
  currentStock: number;
  suggestedQuantity: number;
  estimatedStockoutDate: string;
  suggestedPurchaseDate: string;
  urgency: string;
  remark: string;
}

interface InventoryAlert {
  productId: number;
  productName: string;
  productCode: string;
  alertType: string;
  currentStock: number;
  threshold: number;
  alertDate: string;
  message: string;
}

const PredictionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [forecasts, setForecasts] = useState<SalesForecast[]>([]);
  const [suggestions, setSuggestions] = useState<PurchaseSuggestion[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
  const [forecastDays, setForecastDays] = useState(30);

  useEffect(() => {
    fetchForecasts();
    fetchSuggestions();
    fetchAlerts();
  }, []);

  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const res: any = await reportApi.get('/prediction/sales', {
        params: { productId: selectedProduct, forecastDays },
      });
      if (res.data.code === 200) {
        setForecasts(res.data.data || []);
        // 提取产品选项
        const productMap = new Map<number, { label: string; value: string }>();
        res.data.data?.forEach((f: SalesForecast) => {
          if (!productMap.has(f.productId)) {
            productMap.set(f.productId, { label: f.productName, value: String(f.productId) });
          }
        });
        setProductOptions(Array.from(productMap.values()));
      }
    } catch (e) {
      message.error('获取销售预测失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res: any = await reportApi.get('/prediction/purchase-suggestion');
      if (res.data.code === 200) {
        setSuggestions(res.data.data || []);
      }
    } catch (e) {
      message.error('获取采购建议失败');
    }
  };

  const fetchAlerts = async () => {
    try {
      const res: any = await reportApi.get('/prediction/inventory-alert');
      if (res.data.code === 200) {
        setAlerts(res.data.data || []);
      }
    } catch (e) {
      message.error('获取库存预警失败');
    }
  };

  // 准备图表数据
  const chartData = React.useMemo(() => {
    if (!selectedProduct) {
      // 汇总所有产品的每日预测
      const dailyMap = new Map<string, { date: string; total: number; low: number; high: number }>();
      forecasts.forEach(f => {
        const existing = dailyMap.get(f.date) || { date: f.date, total: 0, low: 0, high: 0 };
        existing.total += f.forecastQuantity;
        existing.low += f.lowerBound;
        existing.high += f.upperBound;
        dailyMap.set(f.date, existing);
      });
      return Array.from(dailyMap.values()).map(d => ({
        date: d.date,
        预测销量: Math.round(d.total),
        预测下限: Math.round(d.low),
        预测上限: Math.round(d.high),
      })).sort((a, b) => a.date.localeCompare(b.date));
    } else {
      return forecasts
        .filter(f => f.productId === Number(selectedProduct))
        .map(f => ({
          date: f.date,
          预测销量: f.forecastQuantity,
          预测下限: f.lowerBound,
          预测上限: f.upperBound,
        })).sort((a, b) => a.date.localeCompare(b.date));
    }
  }, [forecasts, selectedProduct]);

  const urgencyColor: Record<string, string> = {
    HIGH: 'red',
    MEDIUM: 'orange',
    LOW: 'green',
  };

  const alertTypeMap: Record<string, { color: string; label: string }> = {
    LOW_STOCK: { color: 'red', label: '低库存' },
    OVERSTOCK: { color: 'blue', label: '高库存' },
    EXPIRY: { color: 'orange', label: '过期风险' },
    STAGNANT: { color: 'purple', label: '滞销' },
  };

  const forecastColumns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '预测销量', dataIndex: 'forecastQuantity', key: 'forecastQuantity', width: 100 },
    { title: '预测下限', dataIndex: 'lowerBound', key: 'lowerBound', width: 100 },
    { title: '预测上限', dataIndex: 'upperBound', key: 'upperBound', width: 100 },
  ];

  const suggestionColumns = [
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock', width: 100 },
    { title: '建议采购量', dataIndex: 'suggestedQuantity', key: 'suggestedQuantity', width: 120 },
    { title: '建议采购日期', dataIndex: 'suggestedPurchaseDate', key: 'suggestedPurchaseDate', width: 130 },
    { title: '预计耗尽日期', dataIndex: 'estimatedStockoutDate', key: 'estimatedStockoutDate', width: 130 },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: (urgency: string) => (
        <Tag color={urgencyColor[urgency]}>
          {urgency === 'HIGH' ? '高' : urgency === 'MEDIUM' ? '中' : '低'}
        </Tag>
      ),
    },
  ];

  const alertColumns = [
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 150 },
    {
      title: '预警类型',
      dataIndex: 'alertType',
      key: 'alertType',
      width: 100,
      render: (type: string) => (
        <Tag color={alertTypeMap[type]?.color}>{alertTypeMap[type]?.label || type}</Tag>
      ),
    },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock', width: 100 },
    { title: '阈值', dataIndex: 'threshold', key: 'threshold', width: 100 },
    { title: '预警信息', dataIndex: 'message', key: 'message' },
  ];

  const highUrgencyCount = suggestions.filter(s => s.urgency === 'HIGH').length;
  const alertCount = alerts.length;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="高紧急采购建议"
              value={highUrgencyCount}
              valueStyle={{ color: highUrgencyCount > 0 ? '#cf1322' : '#3f8600' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存预警数量"
              value={alertCount}
              valueStyle={{ color: alertCount > 0 ? '#faad14' : '#3f8600' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Space>
              <Select
                placeholder="选择商品查看预测"
                allowClear
                style={{ width: 200 }}
                options={productOptions}
                onChange={(val) => setSelectedProduct(val)}
              />
              <Select
                value={forecastDays}
                onChange={(val) => setForecastDays(val)}
                style={{ width: 120 }}
                options={[
                  { label: '预测7天', value: 7 },
                  { label: '预测30天', value: 30 },
                  { label: '预测90天', value: 90 },
                ]}
              />
              <Button icon={<ReloadOutlined />} onClick={fetchForecasts}>
                刷新预测
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="forecast"
        items={[
          {
            key: 'forecast',
            label: <span><LineChartOutlined /> 销售预测</span>,
            children: (
              <Card>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="预测销量" stroke="#1890ff" strokeWidth={2} />
                      <Line type="monotone" dataKey="预测上限" stroke="#52c41a" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="预测下限" stroke="#ff4d4f" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40 }}>暂无预测数据</div>
                )}
                <Table
                  columns={forecastColumns}
                  dataSource={forecasts.slice(0, 50)}
                  rowKey={(r, i) => `${r.productId}-${r.date}-${i}`}
                  pagination={{ pageSize: 10 }}
                  style={{ marginTop: 24 }}
                />
              </Card>
            ),
          },
          {
            key: 'suggestion',
            label: <span><ShoppingCartOutlined /> 采购建议</span>,
            children: (
              <Card>
                <Table
                  columns={suggestionColumns}
                  dataSource={suggestions}
                  rowKey="productId"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: 'alert',
            label: <span><AlertOutlined /> 库存预警</span>,
            children: (
              <Card>
                <Table
                  columns={alertColumns}
                  dataSource={alerts}
                  rowKey="productId"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PredictionPage;
