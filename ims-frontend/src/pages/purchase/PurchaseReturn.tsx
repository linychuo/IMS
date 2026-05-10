import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  
  Space,
  Modal,
  Form,
  
  
  
  message,
  
  Tag,
  Descriptions,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { procurementApi, supplierApi, warehouseApi } from '../../api';

interface PurchaseReturnDetail {
  id?: string;
  returnId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  amount?: number;
}

interface PurchaseReturn {
  id: string;
  returnNo: string;
  purchaseInId?: string;
  purchaseInNo?: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  returnDate: string;
  returnBy?: string;
  returnByName?: string;
  status: number;
  totalAmount: number;
  refundAmount: number;
  reason?: string;
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: PurchaseReturnDetail[];
}

const PurchaseReturnPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PurchaseReturn[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PurchaseReturn | null>(null);
  const [supplierList, setSupplierList] = useState<{ id: string; name: string }[]>([]);
  const [warehouseList, setWarehouseList] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSuppliers();
    fetchWarehouses();
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

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

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseApi.get('/warehouse/list');
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
      const res = await procurementApi.get('/return', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch returns:', error);
      message.error('获取采购退货失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleView = async (record: PurchaseReturn) => {
    try {
      const res = await procurementApi.get(`/return/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('获取退货单详情失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await procurementApi.post(`/return/${id}/approve`);
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await procurementApi.post(`/return/${id}/reject`, null, { params: { reason: '用户拒绝' } });
      message.success('拒绝成功');
      fetchData();
    } catch (error) {
      message.error('拒绝失败');
    }
  };

  const handleOutbound = async (id: string) => {
    try {
      await procurementApi.post(`/return/${id}/outbound`);
      message.success('退货出库成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord?.id) {
        await procurementApi.put(`/return/${editingRecord.id}`, values);
        message.success('修改成功');
      } else {
        await procurementApi.post('/return', values);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save return:', error);
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待审核', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
      2: { text: '已退货', color: 'green' },
      9: { text: '已拒绝', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '退货单号', dataIndex: 'returnNo', key: 'returnNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '退货日期', dataIndex: 'returnDate', key: 'returnDate', width: 120 },
    { title: '退货金额', dataIndex: 'refundAmount', key: 'refundAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '退货原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: PurchaseReturn) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)}>拒绝</Button>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleOutbound(record.id)}>退货出库</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>采购退货</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建退货</Button>
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
        scroll={{ x: 1300 }}
      />

      <Modal
        title="退货单详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="退货单号">{editingRecord?.returnNo}</Descriptions.Item>
          <Descriptions.Item label="供应商">{editingRecord?.supplierName}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingRecord?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="退货日期">{editingRecord?.returnDate}</Descriptions.Item>
          <Descriptions.Item label="退货金额">¥{editingRecord?.refundAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderStatus(editingRecord?.status || 0)}</Descriptions.Item>
          <Descriptions.Item label="退货原因" span={2}>{editingRecord?.reason}</Descriptions.Item>
        </Descriptions>
        {editingRecord?.details && editingRecord.details.length > 0 && (
          <>
            <Divider>退货明细</Divider>
            <Descriptions column={2} size="small">
              {editingRecord.details.map((d, i) => (
                <Descriptions.Item key={i} label={d.productName}>
                  {d.quantity} {d.unit} × ¥{d.price?.toFixed(2)} = ¥{d.amount?.toFixed(2)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseReturnPage;