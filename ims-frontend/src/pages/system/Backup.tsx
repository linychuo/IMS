import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Progress,
  Descriptions,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { systemApi } from '../../api';
import type { PageResult } from '../../types';

interface BackupRecord {
  id?: number;
  backupName: string;
  backupType: string;
  filePath: string;
  fileSize: number;
  status: string;
  progress: number;
  errorMessage?: string;
  startTime?: string;
  endTime?: string;
  createTime?: string;
  remark?: string;
}

const BackupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BackupRecord[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BackupRecord | null>(null);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [backupType, setBackupType] = useState<string>('FULL');
  const [backupName, setBackupName] = useState('');
  const [backupLoading, setBackupLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    // 定时刷新运行中的备份状态
    const interval = setInterval(() => {
      const hasRunning = data.some(d => d.status === 'RUNNING' || d.status === 'PENDING');
      if (hasRunning) {
        fetchData(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pagination.current, pagination.size, keyword]);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res: any = await systemApi.get('/backup/page', {
        params: {
          current: pagination.current,
          size: pagination.size,
          keyword,
        },
      });
      if (res.data.code === 200) {
        const pageResult: PageResult<BackupRecord> = res.data.data;
        setData(pageResult.records || []);
        setPagination(prev => ({ ...prev, total: pageResult.total || 0 }));
      }
    } catch (e) {
      message.error('获取备份记录失败');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const endpoint = backupType === 'FULL' ? '/backup/full' : '/backup/incremental';
      const res: any = await systemApi.post(endpoint, { backupName });
      if (res.data.code === 200) {
        message.success('备份任务已启动');
        setBackupModalVisible(false);
        setBackupName('');
        fetchData();
      } else {
        message.error(res.data.message || '启动备份失败');
      }
    } catch (e) {
      message.error('启动备份失败');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async (record: BackupRecord) => {
    try {
      const res: any = await systemApi.post(`/backup/restore/${record.id}`);
      if (res.data.code === 200) {
        message.success('恢复成功');
      } else {
        message.error(res.data.message || '恢复失败');
      }
    } catch (e) {
      message.error('恢复失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await systemApi.delete(`/backup/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (e) {
      message.error('删除失败');
    }
  };

  const showDetail = (record: BackupRecord) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  };

  const statusColor: Record<string, string> = {
    SUCCESS: 'success',
    FAILED: 'error',
    RUNNING: 'processing',
    PENDING: 'warning',
  };

  const columns = [
    {
      title: '备份名称',
      dataIndex: 'backupName',
      key: 'backupName',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'backupType',
      key: 'backupType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'FULL' ? 'blue' : 'green'}>
          {type === 'FULL' ? '全量' : '增量'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: BackupRecord) => (
        <Space direction="vertical" size={0}>
          <Tag color={statusColor[status] || 'default'}>
            {status === 'SUCCESS' ? '成功' :
             status === 'FAILED' ? '失败' :
             status === 'RUNNING' ? '运行中' : '等待'}
          </Tag>
          {(status === 'RUNNING' || status === 'PENDING') && (
            <Progress percent={record.progress || 0} size="small" showInfo={false} />
          )}
        </Space>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 170,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 170,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: BackupRecord) => (
        <Space>
          <Button type="link" size="small" onClick={() => showDetail(record)}>
            详情
          </Button>
          {record.status === 'SUCCESS' && (
            <Button type="link" size="small" onClick={() => handleRestore(record)}>
              恢复
            </Button>
          )}
          <Popconfirm title="确定删除此备份？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Input.Search
            placeholder="搜索备份名称"
            allowClear
            onSearch={(val) => {
              setKeyword(val);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            style={{ width: 240 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchData()}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => setBackupModalVisible(true)}
          >
            创建备份
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.size,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (current, size) => {
              setPagination({ current, size, total: pagination.total });
            },
          }}
        />
      </Space>

      {/* 创建备份弹窗 */}
      <Modal
        title="创建备份"
        open={backupModalVisible}
        onOk={handleBackup}
        onCancel={() => setBackupModalVisible(false)}
        okText="确定"
        cancelText="取消"
        confirmLoading={backupLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <Button
              type={backupType === 'FULL' ? 'primary' : 'default'}
              onClick={() => setBackupType('FULL')}
            >
              全量备份
            </Button>
            <Button
              type={backupType === 'INCREMENTAL' ? 'primary' : 'default'}
              onClick={() => setBackupType('INCREMENTAL')}
            >
              增量备份
            </Button>
          </Space>
          <Input
            placeholder="备份名称（可选）"
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
          />
          <div style={{ color: '#999', fontSize: 12 }}>
            {backupType === 'FULL'
              ? '全量备份会备份整个数据库，文件较大但恢复简单'
              : '增量备份只备份自上次备份以来的变更，文件较小'}
          </div>
        </Space>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="备份详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          selectedRecord?.status === 'SUCCESS' && (
            <Button key="restore" type="primary" onClick={() => {
              setDetailVisible(false);
              handleRestore(selectedRecord);
            }}>
              恢复此备份
            </Button>
          ),
        ]}
      >
        {selectedRecord && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="备份名称">{selectedRecord.backupName}</Descriptions.Item>
            <Descriptions.Item label="备份类型">
              {selectedRecord.backupType === 'FULL' ? '全量备份' : '增量备份'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusColor[selectedRecord.status]}>
                {selectedRecord.status === 'SUCCESS' ? '成功' :
                 selectedRecord.status === 'FAILED' ? '失败' :
                 selectedRecord.status === 'RUNNING' ? '运行中' : '等待'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="文件大小">{formatFileSize(selectedRecord.fileSize)}</Descriptions.Item>
            <Descriptions.Item label="文件路径">{selectedRecord.filePath || '-'}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{selectedRecord.startTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{selectedRecord.endTime || '-'}</Descriptions.Item>
            {selectedRecord.errorMessage && (
              <Descriptions.Item label="错误信息">
                <span style={{ color: 'red' }}>{selectedRecord.errorMessage}</span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="备注">{selectedRecord.remark || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BackupPage;
