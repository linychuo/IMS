import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
} from 'antd';
import { SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { inventoryApi } from '../../api';

interface BatchRecord {
  batchNo: string;
  productName: string;
  productCode: string;
  warehouseName: string;
  locationName?: string;
  quantity: number;
  frozenQuantity: number;
  cost: number;
  lastInDate?: string;
  lastOutDate?: string;
  createTime?: string;
}

const BatchPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BatchRecord[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [batchRecordList, setBatchRecordList] = useState<any[]>([]);
  const [recordModalVisible, setRecordModalVisible] = useState(false);

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
      const res = await inventoryApi.get('/inventory/page', { params });
      if (res.data.code === 200) {
        // 按批次号分组
        const records = res.data.data?.records || [];
        const batchMap = new Map<string, BatchRecord>();
        records.forEach((item: any) => {
          const batchNo = item.batchNo || '无批次';
          if (!batchMap.has(batchNo)) {
            batchMap.set(batchNo, {
              batchNo,
              productName: item.productName,
              productCode: item.productCode,
              warehouseName: item.warehouseName,
              locationName: item.locationName,
              quantity: 0,
              frozenQuantity: 0,
              cost: item.cost || 0,
              lastInDate: item.createTime,
            });
          }
          const batch = batchMap.get(batchNo)!;
          batch.quantity += item.quantity || 0;
          batch.frozenQuantity += item.frozenQuantity || 0;
        });
        setData(Array.from(batchMap.values()));
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取批次列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleViewBatchRecords = async (batchNo: string) => {
    if (!batchNo || batchNo === '无批次') {
      message.info('该商品没有批次信息');
      return;
    }
    setSelectedBatch(batchNo);
    try {
      const res = await inventoryApi.get(`/inventory/record/batch/${batchNo}`);
      if (res.data.code === 200) {
        setBatchRecordList(res.data.data || []);
        setRecordModalVisible(true);
      }
    } catch (error) {
      message.error('获取批次变动记录失败');
    }
  };

  const columns = [
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 150, render: (v: string) => v === '无批次' ? <Tag>无批次</Tag> : v },
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '当前库存', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '冻结库存', dataIndex: 'frozenQuantity', key: 'frozenQuantity', width: 100, render: (v: number) => v > 0 ? <Tag color="orange">{v}</Tag> : v },
    { title: '单价', dataIndex: 'cost', key: 'cost', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '批次创建时间', dataIndex: 'lastInDate', key: 'lastInDate', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: BatchRecord) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleViewBatchRecords(record.batchNo)}
        >
          批次追溯
        </Button>
      ),
    },
  ];

  const recordColumns = [
    { title: '变动类型', dataIndex: 'changeType', key: 'changeType', width: 100, render: (v: string) => {
      const map: Record<string, { text: string; color: string }> = {
        'IN': { text: '入库', color: 'green' },
        'OUT': { text: '出库', color: 'red' },
        'TRANSFER_IN': { text: '调拨入库', color: 'blue' },
        'TRANSFER_OUT': { text: '调拨出库', color: 'orange' },
        'CHECK': { text: '盘点调整', color: 'purple' },
      };
      const s = map[v] || { text: v, color: 'default' };
      return <Tag color={s.color}>{s.text}</Tag>;
    }},
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '变动数量', dataIndex: 'changeQuantity', key: 'changeQuantity', width: 100, render: (v: number, r: any) => `${r.changeType === 'OUT' || r.changeType === 'TRANSFER_OUT' ? '-' : '+'}${v}` },
    { title: '变动前库存', dataIndex: 'beforeQuantity', key: 'beforeQuantity', width: 100 },
    { title: '变动后库存', dataIndex: 'afterQuantity', key: 'afterQuantity', width: 100 },
    { title: '关联单据', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>批次管理</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="批次总数" value={data.length} prefix={<UnorderedListOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="有批次商品" value={data.filter(d => d.batchNo !== '无批次').length} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="无批次商品" value={data.filter(d => d.batchNo === '无批次').length} valueStyle={{ color: '#fa8c16' }} /></Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索批次号/商品名称"
          allowClear
          onSearch={handleSearch}
          style={{ width: 250 }}
          prefix={<SearchOutlined />}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="batchNo"
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

      <Modal
        title={`批次变动记录 - ${selectedBatch || ''}`}
        open={recordModalVisible}
        onCancel={() => setRecordModalVisible(false)}
        footer={[<Button key="close" onClick={() => setRecordModalVisible(false)}>关闭</Button>]}
        width={900}
      >
        <Table
          columns={recordColumns}
          dataSource={batchRecordList}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Modal>
    </div>
  );
};

export default BatchPage;