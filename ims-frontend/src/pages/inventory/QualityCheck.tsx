import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Input,
  message,
  Tag,
  Descriptions,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { inventoryApi, warehouseApi, supplierApi } from '../../api';

interface QualityCheckDetail {
  id?: string;
  checkId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  deliveredQty: number;
  qualifiedQty: number;
  unqualifiedQty: number;
  reason?: string;
}

interface QualityCheck {
  id: string;
  checkNo: string;
  orderType: string;
  orderId?: string;
  orderNo?: string;
  warehouseId: string;
  warehouseName: string;
  supplierId?: string;
  supplierName?: string;
  customerId?: string;
  customerName?: string;
  checkResult?: string;
  qualifiedQty?: number;
  unqualifiedQty?: number;
  inspectorId?: string;
  inspectorName?: string;
  checkTime?: string;
  status: number;
  remark?: string;
  details?: QualityCheckDetail[];
}

const QualityCheckPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QualityCheck[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<QualityCheck | null>(null);
  const [form] = Form.useForm();
  const [warehouseList, setWarehouseList] = useState<{ id: string; name: string }[]>([]);
  const [supplierList, setSupplierList] = useState<{ id: string; name: string }[]>([]);
  const [details, setDetails] = useState<QualityCheckDetail[]>([]);

  useEffect(() => {
    fetchWarehouses();
    fetchSuppliers();
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

  const fetchSuppliers = async () => {
    try {
      const res = await supplierApi.get('/supplier/list');
      if (res.data.code === 200) {
        setSupplierList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.get('/inventory/quality-check/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取质检单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record: QualityCheck) => {
    try {
      const res = await inventoryApi.get(`/inventory/quality-check/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('获取质检单详情失败');
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDetails([]);
    setModalVisible(true);
  };

  const handleAddDetail = () => {
    setDetails([...details, { productId: '', productName: '', spec: '', unit: '', deliveredQty: 0, qualifiedQty: 0, unqualifiedQty: 0, reason: '' }]);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDetails(newDetails);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const checkData = {
        orderType: values.orderType,
        orderNo: values.orderNo || '',
        warehouseId: values.warehouseId,
        warehouseName: warehouseList.find(w => w.id === values.warehouseId)?.name || '',
        supplierId: values.supplierId,
        supplierName: supplierList.find(s => s.id === values.supplierId)?.name || '',
        remark: values.remark || '',
      };
      const res = await inventoryApi.post('/inventory/quality-check', { check: checkData, details });
      if (res.data.code === 200) {
        message.success('创建成功');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('操作失败');
    }
  };

  const handleSubmitResult = async (record: QualityCheck) => {
    try {
      const res = await inventoryApi.put(`/inventory/quality-check/${record.id}/submit`, null, {
        params: { inspectorId: 1, inspectorName: '质检员' },
      });
      if (res.data.code === 200) {
        message.success('提交成功');
        fetchData();
      }
    } catch (error) {
      message.error('提交失败');
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待质检', color: 'orange' },
      1: { text: '质检中', color: 'blue' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'default' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderResult = (result: string) => {
    const map: Record<string, { text: string; color: string }> = {
      QUALIFIED: { text: '合格', color: 'green' },
      UNQUALIFIED: { text: '不合格', color: 'red' },
      PARTIAL: { text: '部分合格', color: 'orange' },
    };
    const r = map[result] || { text: result || '-', color: 'default' };
    return <Tag color={r.color}>{r.text}</Tag>;
  };

  const columns = [
    { title: '质检单号', dataIndex: 'checkNo', key: 'checkNo', width: 150 },
    { title: '单据类型', dataIndex: 'orderType', key: 'orderType', width: 120, render: (v: string) => v === 'PURCHASE_IN' ? '采购入库' : v === 'SALES_OUT' ? '销售出库' : v || '-' },
    { title: '关联单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 120 },
    { title: '质检结果', dataIndex: 'checkResult', key: 'checkResult', width: 100, render: renderResult },
    { title: '合格数量', dataIndex: 'qualifiedQty', key: 'qualifiedQty', width: 80, render: (v: number) => v || 0 },
    { title: '不合格数量', dataIndex: 'unqualifiedQty', key: 'unqualifiedQty', width: 80, render: (v: number) => v || 0 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: QualityCheck) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleSubmitResult(record)}>提交</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>质检管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建质检单
        </Button>
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
        scroll={{ x: 1400 }}
      />

      {/* 新增弹窗 */}
      <Modal
        title="新建质检单"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="orderType" label="单据类型" rules={[{ required: true, message: '请选择单据类型' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择单据类型">
                <Select.Option value="PURCHASE_IN">采购入库</Select.Option>
                <Select.Option value="SALES_OUT">销售出库</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="orderNo" label="关联单号" style={{ flex: 1 }}>
              <Input placeholder="请输入关联单号" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="warehouseId" label="仓库" rules={[{ required: true, message: '请选择仓库' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择仓库">
                {warehouseList.map(w => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="supplierId" label="供应商" style={{ flex: 1 }}>
              <Select placeholder="请选择供应商" allowClear>
                {supplierList.map(s => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Button type="dashed" onClick={handleAddDetail} style={{ marginBottom: 16 }}>
            添加商品
          </Button>
          {details.map((detail, index) => (
            <Space key={index} style={{ display: 'flex', marginBottom: 8 }} size="middle">
              <Input placeholder="商品名称" value={detail.productName} onChange={(e) => handleDetailChange(index, 'productName', e.target.value)} style={{ width: 120 }} />
              <InputNumber placeholder="送检数量" value={detail.deliveredQty} onChange={(value) => handleDetailChange(index, 'deliveredQty', value)} style={{ width: 80 }} min={0} />
              <InputNumber placeholder="合格数量" value={detail.qualifiedQty} onChange={(value) => handleDetailChange(index, 'qualifiedQty', value)} style={{ width: 80 }} min={0} />
              <InputNumber placeholder="不合格数量" value={detail.unqualifiedQty} onChange={(value) => handleDetailChange(index, 'unqualifiedQty', value)} style={{ width: 100 }} min={0} />
              <Button type="link" danger onClick={() => handleRemoveDetail(index)}>删除</Button>
            </Space>
          ))}
        </div>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="质检单详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        {editingRecord && (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="质检单号">{editingRecord.checkNo}</Descriptions.Item>
            <Descriptions.Item label="单据类型">{editingRecord.orderType === 'PURCHASE_IN' ? '采购入库' : editingRecord.orderType === 'SALES_OUT' ? '销售出库' : '-'}</Descriptions.Item>
            <Descriptions.Item label="关联单号">{editingRecord.orderNo}</Descriptions.Item>
            <Descriptions.Item label="仓库">{editingRecord.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="供应商">{editingRecord.supplierName}</Descriptions.Item>
            <Descriptions.Item label="质检结果">{renderResult(editingRecord.checkResult || '')}</Descriptions.Item>
            <Descriptions.Item label="合格数量">{editingRecord.qualifiedQty || 0}</Descriptions.Item>
            <Descriptions.Item label="不合格数量">{editingRecord.unqualifiedQty || 0}</Descriptions.Item>
            <Descriptions.Item label="质检员">{editingRecord.inspectorName || '-'}</Descriptions.Item>
            <Descriptions.Item label="质检时间">{editingRecord.checkTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{renderStatus(editingRecord.status)}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{editingRecord.remark || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default QualityCheckPage;