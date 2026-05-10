import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { warehouseApi } from '../../api';

interface AccountTransaction {
  id: number;
  accountId: number;
  accountName?: string;
  transType: string;
  transAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  orderType?: string;
  orderId?: number;
  orderNo?: string;
  remark?: string;
  createTime?: string;
}

interface Account {
  id: number;
  accountName: string;
}

const TransactionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AccountTransaction[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountList, setAccountList] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, accountId]);

  const fetchAccounts = async () => {
    try {
      const res = await warehouseApi.get('/finance/account/page', {
        params: { page: 1, pageSize: 100 },
      });
      if (res.data.code === 200) {
        setAccountList(res.data.data?.records || []);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pagination.current,
        pageSize: pagination.size,
      };
      if (accountId) {
        params.accountId = accountId;
      }
      const res = await warehouseApi.get('/finance/account-trans/page', { params });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      message.error('获取交易记录失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '账户', dataIndex: 'accountName', key: 'accountName', width: 120 },
    { title: '交易类型', dataIndex: 'transType', key: 'transType', width: 100, render: (v: string) => {
      const map: Record<string, string> = { 'IN': '收款', 'OUT': '付款', 'ADJUST': '调整', 'TRANSFER': '转账' };
      return map[v] || v;
    }},
    { title: '交易金额', dataIndex: 'transAmount', key: 'transAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '变动前余额', dataIndex: 'balanceBefore', key: 'balanceBefore', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '变动后余额', dataIndex: 'balanceAfter', key: 'balanceAfter', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '单据类型', dataIndex: 'orderType', key: 'orderType', width: 100 },
    { title: '单据号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    { title: '交易时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>交易记录</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          placeholder="选择账户"
          allowClear
          style={{ width: 200 }}
          onChange={(v) => setAccountId(v || null)}
        >
          {accountList.map((a) => (
            <Select.Option key={a.id} value={a.id}>{a.accountName}</Select.Option>
          ))}
        </Select>
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>查询</Button>
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
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default TransactionPage;