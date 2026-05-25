import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  message,
  Tag,
  Descriptions,
} from 'antd';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, CameraOutlined } from '@ant-design/icons';
import BarcodeScanner from '../../components/BarcodeScanner';
import { inventoryApi, warehouseApi } from '../../api';

interface InventoryOut {
  id: number;
  outNo: string;
  outType: number;
  warehouseId: number;
  warehouseName: string;
  totalAmount: number;
  status: number;
  outDate: string;
  remark?: string;
}

const InventoryOutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InventoryOut[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryOut | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchWarehouses = async () => {
    try {
      const res = await inventoryApi.get('/warehouse/list');
      if (res.data.code === 200) {
        setWarehouseList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.get('/inventory/out/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch out records:', error);
      message.error('获取出库单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record: InventoryOut) => {
    try {
      const res = await inventoryApi.get(`/inventory/out/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取出库单详情失败');
    }
  };

  const handleAudit = async (id: number) => {
    try {
      await inventoryApi.post(`/inventory/out/${id}/audit`);
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await inventoryApi.post(`/inventory/out/${id}/cancel`);
      message.success('取消成功');
      fetchData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await inventoryApi.post('/inventory/out', values);
      message.success('新增成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleScanCallback = async (barcode: string) => {
    try {
      const res = await inventoryApi.get(`/inventory/out/barcode/${barcode}`);
      if (res.data?.code === 200) {
        const product = res.data.data;
        message.success(`已识别商品: ${product.productName}`);
        console.log('Scanned product:', product);
      } else {
        message.error(res.data?.message || '商品不存在');
      }
    } catch (error) {
      message.error('获取商品信息失败');
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '待审核', color: 'orange' },
      2: { text: '已审核', color: 'green' },
      3: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '出库单号', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '出库类型', dataIndex: 'outType', key: 'outType', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '销售出库', 2: '采购退货', 3: '调拨出库' };
      return map[v] || '其他';
    }},
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '出库日期', dataIndex: 'outDate', key: 'outDate', width: 180 },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: InventoryOut) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          {record.status === 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAudit(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancel(record.id)}>取消</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>出库单</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setEditingRecord(null); setModalVisible(true); }}>新建出库</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (current, size) => setPagination({ current, size, total: pagination.total }),
        }}
        scroll={{ x: 1100 }}
      />

      <Modal
        title={editingRecord ? '出库单详情' : '新建出库'}
        open={modalVisible}
        onOk={editingRecord ? () => setModalVisible(false) : handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={editingRecord ? [<Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>] : undefined}
      >
        {editingRecord ? (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="出库单号">{editingRecord.outNo}</Descriptions.Item>
            <Descriptions.Item label="出库类型">{['', '销售出库', '采购退货', '调拨出库'][editingRecord.outType]}</Descriptions.Item>
            <Descriptions.Item label="仓库">{editingRecord.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="出库日期">{editingRecord.outDate}</Descriptions.Item>
            <Descriptions.Item label="总金额">¥{editingRecord.totalAmount?.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="状态">{renderStatus(editingRecord.status)}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="warehouseId" label="仓库" rules={[{ required: true }]}>
              <Select placeholder="请选择仓库">
                {warehouseList.map((w) => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="outType" label="出库类型" rules={[{ required: true }]}>
              <Select placeholder="请选择">
                <Select.Option value={1}>销售出库</Select.Option>
                <Select.Option value={2}>采购退货</Select.Option>
                <Select.Option value={3}>调拨出库</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="outDate" label="出库日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
            <Form.Item label="扫码出库">
              <Button icon={<CameraOutlined />} onClick={() => setScannerVisible(true)}>
                扫码添加商品
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={handleScanCallback}
      />
    </div>
  );
};

export default InventoryOutPage;