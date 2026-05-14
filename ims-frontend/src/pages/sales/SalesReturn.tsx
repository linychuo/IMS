import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  DatePicker,
  message,
  Tag,
  Descriptions,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { salesApi } from '../../api';

interface SalesReturnDetail {
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

interface SalesReturn {
  id: string;
  returnNo: string;
  orderId?: string;
  orderNo?: string;
  outId?: string;
  outNo?: string;
  customerId: string;
  customerName: string;
  returnDate: string;
  warehouseId: string;
  warehouseName: string;
  status: number;
  totalAmount: number;
  refundAmount?: number;
  reason?: string;
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: SalesReturnDetail[];
}

const SalesReturnPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SalesReturn[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesReturn | null>(null);
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
      const res = await salesApi.get('/return/list', { params });
      setData(res.data.data || []);
      setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch returns:', error);
      message.error('获取销售退货失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleView = async (record: SalesReturn) => {
    try {
      const res = await salesApi.get(`/return/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取退货单详情失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await salesApi.post(`/return/${id}/approve`);
      message.success('审核通过');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await salesApi.post(`/return/${id}/reject`, null, { params: { reason: '不符要求' } });
      message.success('已拒绝');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleInbound = async (id: string) => {
    try {
      await salesApi.post(`/return/${id}/inbound`);
      message.success('入库成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待审核', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
      2: { text: '已入库', color: 'green' },
      9: { text: '已拒绝', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '退货单号', dataIndex: 'returnNo', key: 'returnNo', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '关联出库', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 120 },
    { title: '退货日期', dataIndex: 'returnDate', key: 'returnDate', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '退货金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: SalesReturn) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>通过</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)}>拒绝</Button>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleInbound(record.id)}>入库</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>销售退货</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索退货单"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
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

      <Modal
        title="退货单详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[<Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="退货单号">{editingRecord?.returnNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{editingRecord?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="关联出库">{editingRecord?.outNo}</Descriptions.Item>
          <Descriptions.Item label="客户">{editingRecord?.customerName}</Descriptions.Item>
          <Descriptions.Item label="退货日期">{editingRecord?.returnDate}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingRecord?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="退货金额">¥{editingRecord?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="退款金额">¥{editingRecord?.refundAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="退货原因" span={2}>{editingRecord?.reason}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderStatus(editingRecord?.status || 0)}</Descriptions.Item>
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

export default SalesReturnPage;