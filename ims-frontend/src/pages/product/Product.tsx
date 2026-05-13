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
  Tabs,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { productApi } from '../../api';
import { PermissionWrapper } from '../../components/PermissionWrapper';
import type { PageResult } from '../../types';

const { TabPane } = Tabs;

// ============ 分类 ============
interface Category {
  id?: number;
  categoryName: string;
  parentId?: number;
  sort?: number;
  status: number;
  remark?: string;
}

// ============ 商品 ============
interface Product {
  id?: number;
  code: string;
  name: string;
  categoryId?: number;
  categoryName?: string;
  spec?: string;
  unit: string;
  barcode?: string;
  purchasePrice?: number;
  salePrice?: number;
  minSalePrice?: number;
  status: number;
  imageUrl?: string;
  remark?: string;
}

const ProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product');

  // 商品状态
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // 分类状态
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm] = Form.useForm();

  useEffect(() => {
    if (activeTab === 'product') {
      fetchProducts();
    } else {
      fetchCategories();
    }
  }, [activeTab, pagination.current, pagination.size, keyword]);

  // ============ 商品操作 ============
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        current: pagination.current,
        size: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await productApi.get('/product/page', { params });
      if (res.data.code === 200) {
        const pageResult: PageResult<Product> = res.data.data;
        setData(pageResult.records);
        setPagination((prev) => ({ ...prev, total: pageResult.total }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditProduct = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await productApi.delete(`/product/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchProducts();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('删除失败');
    }
  };

  const handleProductModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct?.id) {
        const res = await productApi.put('/product', { ...values, id: editingProduct.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchProducts();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await productApi.post('/product', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchProducts();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  // ============ 分类操作 ============
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await productApi.get('/category/list');
      if (res.data.code === 200) {
        setCategoryData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('获取分类列表失败');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (record: Category) => {
    setEditingCategory(record);
    categoryForm.setFieldsValue(record);
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await productApi.delete(`/category/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchCategories();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      message.error('删除失败');
    }
  };

  const handleCategoryModalOk = async () => {
    try {
      const values = await categoryForm.validateFields();
      if (editingCategory?.id) {
        const res = await productApi.put('/category', { ...values, id: editingCategory.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setCategoryModalVisible(false);
          fetchCategories();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await productApi.post('/category', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setCategoryModalVisible(false);
          fetchCategories();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  // ============ 表格列定义 ============
  const productColumns = [
    { title: '商品编码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 100 },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '采购价格', dataIndex: 'purchasePrice', key: 'purchasePrice', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '销售价格', dataIndex: 'salePrice', key: 'salePrice', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '最低售价', dataIndex: 'minSalePrice', key: 'minSalePrice', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: number) => <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <PermissionWrapper code="product:product:update">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProduct(record)}>编辑</Button>
          </PermissionWrapper>
          <PermissionWrapper code="product:product:delete">
            <Popconfirm title="确定删除此商品？" onConfirm={() => record.id && handleDeleteProduct(record.id)}>
              <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </PermissionWrapper>
        </Space>
      ),
    },
  ];

  const categoryColumns = [
    { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName', width: 200 },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: number) => <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Category) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCategory(record)}>编辑</Button>
          <Popconfirm title="确定删除此分类？" onConfirm={() => record.id && handleDeleteCategory(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>商品管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="商品列表" key="product">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="搜索商品名称"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <PermissionWrapper code="product:product:create">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>新增商品</Button>
            </PermissionWrapper>
          </div>
          <Table
            columns={productColumns}
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
        </TabPane>

        <TabPane tab="商品分类" key="category">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PermissionWrapper code="product:category:create">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>新增分类</Button>
            </PermissionWrapper>
          </div>
          <Table
            columns={categoryColumns}
            dataSource={categoryData}
            rowKey="id"
            loading={categoryLoading}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </TabPane>
      </Tabs>

      {/* 商品弹窗 */}
      <Modal
        title={editingProduct ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleProductModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="code" label="商品编码" rules={[{ required: true, message: '请输入商品编码' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入商品编码" />
            </Form.Item>
            <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入商品名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="spec" label="规格" style={{ flex: 1 }}>
              <Input placeholder="请输入规格" />
            </Form.Item>
            <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请输入单位' }]} style={{ flex: 1 }}>
              <Input placeholder="如：个、箱、件" />
            </Form.Item>
          </Space>
          <Form.Item name="barcode" label="条形码">
            <Input placeholder="请输入条形码" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="purchasePrice" label="采购价格" rules={[{ required: true, message: '请输入采购价格' }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="salePrice" label="销售价格" rules={[{ required: true, message: '请输入销售价格' }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="minSalePrice" label="最低售价" rules={[{ required: true, message: '请输入最低售价' }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="状态" initialValue={1} rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分类弹窗 */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={categoryModalVisible}
        onOk={handleCategoryModalOk}
        onCancel={() => setCategoryModalVisible(false)}
        width={500}
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item name="categoryName" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="sort" label="排序" initialValue={0} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;