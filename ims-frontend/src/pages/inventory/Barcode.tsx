import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  message,
  Card,
  Row,
  Col,
  Tag,
} from 'antd';
import { BarcodeOutlined, PrinterOutlined } from '@ant-design/icons';
import { productApi, warehouseApi } from '../../api';

interface Product {
  id: number;
  productCode: string;
  productName: string;
  barcode?: string;
  spec?: string;
  unit?: string;
  categoryName?: string;
}

const BarcodePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pagination.current,
        pageSize: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await productApi.get('/product/list', { params });
      if (res.data.code === 200) {
        setData(res.data.data || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleSelectProducts = () => {
    if (selectedProducts.length === 0) {
      message.warning('请先选择要打印的商品');
      return;
    }
    setPrintModalVisible(true);
  };

  const handlePrint = () => {
    // 模拟打印，实际使用中可生成条码图片或调用打印服务
    if (selectedProducts.length === 0) {
      message.warning('请选择商品');
      return;
    }
    const printContent = selectedProducts.map(p =>
      `${p.productCode} | ${p.productName} | ${p.barcode || '无条码'}`
    ).join('\n');
    console.log('打印条码:', printContent);
    message.success(`已发送 ${selectedProducts.length} 个商品条码到打印机`);
    setPrintModalVisible(false);
  };

  const columns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '条码', dataIndex: 'barcode', key: 'barcode', width: 150, render: (v: string) => v || <Tag>未设置</Tag> },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 100 },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Product[]) => {
      setSelectedProducts(selectedRows);
    },
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>条码管理</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card title="商品总数">{data.length}</Card>
        </Col>
        <Col span={6}>
          <Card title="已设置条码">{data.filter(d => d.barcode).length}</Card>
        </Col>
        <Col span={6}>
          <Card title="未设置条码">{data.filter(d => !d.barcode).length}</Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索商品名称/编码/条码"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PrinterOutlined />} onClick={handleSelectProducts} disabled={selectedProducts.length === 0}>
          打印选中条码 ({selectedProducts.length})
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (current, size) => setPagination({ current, size, total: pagination.total }),
        }}
        scroll={{ x: 900 }}
      />

      <Modal
        title="打印条码"
        open={printModalVisible}
        onOk={handlePrint}
        onCancel={() => setPrintModalVisible(false)}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <strong>选中的商品 ({selectedProducts.length})：</strong>
        </div>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {selectedProducts.map(p => (
            <Card key={p.id} size="small" style={{ marginBottom: 8 }}>
              <Row>
                <Col span={8}><strong>{p.productCode}</strong></Col>
                <Col span={12}>{p.productName}</Col>
                <Col span={4}>{p.barcode || '无条码'}</Col>
              </Row>
            </Card>
          ))}
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <BarcodeOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <p>点击确定发送打印任务</p>
        </div>
      </Modal>
    </div>
  );
};

export default BarcodePage;