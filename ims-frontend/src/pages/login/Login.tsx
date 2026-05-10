import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { systemApi } from '../../api';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await systemApi.post('/auth/login', values);
      if (res.data.code === 200) {
        const data = res.data.data;
        setAuth({
          token: data.token,
          userId: data.userId,
          username: data.username,
          realName: data.realName,
          menus: data.menus || [],
          permissions: data.permissions || [],
        });
        message.success('登录成功');
        navigate('/dashboard');
      } else {
        message.error(res.data.message || '登录失败');
      }
    } catch (error) {
      message.error('登录失败，请检查用户名密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>进销存系统</h2>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;