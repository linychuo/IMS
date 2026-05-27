import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tag,
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { customerApi, salesApi } from '../../api';

interface Customer {
  id?: number;
  code: string;
  name: string;
  type?: number;
  contact?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  level?: number;
  creditLimit?: number;
  receivableAmount?: number;
  settlePeriod?: number;
  bankName?: string;
  bankAccount?: string;
  taxNo?: string;
  status: number;
  remark?: string;
}

interface SalesOrder {
  id: string;
  orderNo: string;
  orderDate: string;
  totalAmount: number;
  netAmount: number;
  status: number;
}

interface PageResult {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: Customer[];
}

const CustomerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [salesHistoryLoading, setSalesHistoryLoading] = useState(false);
  const [salesHistory, setSalesHistory] = useState<SalesOrder[]>([]);
  const [salesTotal, setSalesTotal] = useState({ orderCount: 0, totalAmount: 0 });

  useEffect(() => {
    fetchCustomers();
  }, [pagination.current, pagination.size, keyword]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        current: pagination.current,
        size: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await customerApi.get('/customer/page', { params });
      if (res.data.code === 200) {
        const pageResult: PageResult = res.data.data;
        setData(pageResult.records);
        setPagination((prev) => ({ ...prev, total: pageResult.total }));
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingCustomer(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = async (record: Customer) => {
    setViewCustomer(record);
    setDetailModalVisible(true);
    fetchSalesHistory(record.id!);
  };

  const fetchSalesHistory = async (customerId: number) => {
    setSalesHistoryLoading(true);
    try {
      const res = await salesApi.get('/order/page', {
        params: { current: 1, size: 100, customerId },
      });
      if (res.data?.code === 200) {
        const records = res.data.data?.records || [];
        setSalesHistory(records);
        const totalAmount = records.reduce((sum: number, item: SalesOrder) => sum + (item.netAmount || 0), 0);
        setSalesTotal({ orderCount: records.length, totalAmount });
      } else {
        setSalesHistory(res.data?.data?.records || []);
      }
    } catch (error) {
      console.error('Failed to fetch sales history:', error);
    } finally {
      setSalesHistoryLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await customerApi.delete(`/customer/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchCustomers();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCustomer?.id) {
        const res = await customerApi.put('/customer', { ...values, id: editingCustomer.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchCustomers();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await customerApi.post('/customer', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchCustomers();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const handleTableChange = (current: number, size: number) => {
    setPagination({ current, size, total: pagination.total });
  };

  const columns = [
    {
      title: '客户编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: number) => (type === 1 ? '个人' : '企业'),
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 130,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: number) => {
        const map: Record<number, string> = { 1: 'VIP', 2: '普通', 3: '潜在' };
        return map[level] || '-';
      },
    },
    {
      title: '信用额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 120,
      render: (value: number) => value ? `¥${value.toFixed(2)}` : '-',
    },
    {
      title: '应收账款',
      dataIndex: 'receivableAmount',
      key: 'receivableAmount',
      width: 120,
      render: (value: number) => value ? `¥${value.toFixed(2)}` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (status === 0 ? '启用' : '停用'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Customer) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此客户？"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>客户管理</h2>
        <Space>
          <Input.Search
            placeholder="搜索客户名称"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增客户
          </Button>
        </Space>
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
          onChange: handleTableChange,
        }}
        scroll={{ x: 1500 }}
      />

      <Modal
        title={editingCustomer ? '编辑客户' : '新增客户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="code"
              label="客户编码"
              rules={[{ required: true, message: '请输入客户编码' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入客户编码" />
            </Form.Item>
            <Form.Item
              name="name"
              label="客户名称"
              rules={[{ required: true, message: '请输入客户名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入客户名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="type" label="客户类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>个人</Select.Option>
                <Select.Option value={2}>企业</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="level" label="客户等级" initialValue={2} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>VIP</Select.Option>
                <Select.Option value={2}>普通</Select.Option>
                <Select.Option value={3}>潜在</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={0} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={0}>启用</Select.Option>
                <Select.Option value={1}>停用</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="contact" label="联系人" style={{ flex: 1 }}>
              <Input placeholder="请输入联系人" />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" style={{ flex: 1 }}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item name="mobile" label="手机号" style={{ flex: 1 }}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Space>
          <Form.Item name="email" label="电子邮箱">
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input.TextArea rows={2} placeholder="请输入地址" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="creditLimit" label="信用额度" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="settlePeriod" label="结账周期(天)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户银行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户银行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
            </Form.Item>
            <Form.Item name="taxNo" label="税号" style={{ flex: 1 }}>
              <Input placeholder="请输入税号" />
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 客户详情弹窗 */}
      <Modal
        title={`客户详情 - ${viewCustomer?.name || ''}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>]}
        width={800}
      >
        <Tabs
          items={[
            {
              key: 'info',
              label: '基本信息',
              children: (
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="客户编码">{viewCustomer?.code}</Descriptions.Item>
                  <Descriptions.Item label="客户名称">{viewCustomer?.name}</Descriptions.Item>
                  <Descriptions.Item label="客户类型">{viewCustomer?.type === 1 ? '个人' : '企业'}</Descriptions.Item>
                  <Descriptions.Item label="客户等级">
                    <Tag color={viewCustomer?.level === 1 ? 'gold' : viewCustomer?.level === 2 ? 'blue' : 'default'}>
                      {viewCustomer?.level === 1 ? 'VIP' : viewCustomer?.level === 2 ? '普通' : '潜在'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="联系人">{viewCustomer?.contact || '-'}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{viewCustomer?.phone || '-'}</Descriptions.Item>
                  <Descriptions.Item label="手机号">{viewCustomer?.mobile || '-'}</Descriptions.Item>
                  <Descriptions.Item label="电子邮箱">{viewCustomer?.email || '-'}</Descriptions.Item>
                  <Descriptions.Item label="地址" span={2}>{viewCustomer?.address || '-'}</Descriptions.Item>
                  <Descriptions.Item label="信用额度">¥{viewCustomer?.creditLimit?.toFixed(2) || '0.00'}</Descriptions.Item>
                  <Descriptions.Item label="应收账款">
                    <Tag color={viewCustomer?.receivableAmount && viewCustomer?.receivableAmount > 0 ? 'orange' : 'green'}>
                      ¥{viewCustomer?.receivableAmount?.toFixed(2) || '0.00'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="可用信用">
                    <Tag color={(viewCustomer?.creditLimit || 0) - (viewCustomer?.receivableAmount || 0) > 0 ? 'green' : 'red'}>
                      ¥{((viewCustomer?.creditLimit || 0) - (viewCustomer?.receivableAmount || 0)).toFixed(2)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="结账周期">{viewCustomer?.settlePeriod ? `${viewCustomer.settlePeriod}天` : '-'}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={viewCustomer?.status === 0 ? 'green' : 'red'}>
                      {viewCustomer?.status === 0 ? '启用' : '停用'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="银行">{viewCustomer?.bankName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="账号">{viewCustomer?.bankAccount || '-'}</Descriptions.Item>
                  <Descriptions.Item label="税号">{viewCustomer?.taxNo || '-'}</Descriptions.Item>
                  <Descriptions.Item label="备注" span={2}>{viewCustomer?.remark || '-'}</Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'sales',
              label: <span><HistoryOutlined /> 销售历史</span>,
              children: (
                <>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="订单数" value={salesTotal.orderCount} prefix={<HistoryOutlined />} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="销售总额" value={salesTotal.totalAmount} precision={2} prefix="¥" />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic
                          title="信用使用率"
                          value={viewCustomer?.creditLimit && viewCustomer.creditLimit > 0
                            ? ((viewCustomer.receivableAmount || 0) / viewCustomer.creditLimit * 100).toFixed(1)
                            : '0.0'}
                          suffix="%"
                          valueStyle={{ color: ((viewCustomer?.receivableAmount || 0) / (viewCustomer?.creditLimit || 1)) > 0.8 ? '#f5222d' : '#52c41a' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Table
                    dataSource={salesHistory}
                    rowKey="id"
                    loading={salesHistoryLoading}
                    pagination={{ pageSize: 5 }}
                    size="small"
                    scroll={{ x: 700 }}
                    columns={[
                      { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
                      { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
                      { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2)}` },
                      { title: '实际金额', dataIndex: 'netAmount', key: 'netAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2)}` },
                      {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: 80,
                        render: (s: number) => {
                          const map: Record<number, { text: string; color: string }> = {
                            0: { text: '待审核', color: 'orange' },
                            1: { text: '已审核', color: 'blue' },
                            2: { text: '部分出库', color: 'cyan' },
                            3: { text: '已完成', color: 'green' },
                            9: { text: '已取消', color: 'red' },
                          };
                          const st = map[s] || { text: '未知', color: 'default' };
                          return <Tag color={st.color}>{st.text}</Tag>;
                        },
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default CustomerPage;