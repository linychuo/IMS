import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import { warehouseApi } from '../../api';

interface Receivable {
  id: number;
  customerId: number;
  customerName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  receivedAmount?: number;
  balance: number;
  status: number;
  dueDate?: string;
  remark?: string;
}

const ReceivablePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Receivable[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await warehouseApi.get('/finance/receivable/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch receivables:', error);
      message.error('获取应收账款失败');
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '未结清', color: 'orange' },
      2: { text: '部分收款', color: 'blue' },
      3: { text: '已结清', color: 'green' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '应收金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已收金额', dataIndex: 'receivedAmount', key: 'receivedAmount', width: 120, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '待收金额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>应收账款</h2>
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
    </div>
  );
};

export default ReceivablePage;