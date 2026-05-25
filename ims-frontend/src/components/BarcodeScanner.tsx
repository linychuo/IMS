import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Input, Space, message } from 'antd';
import { CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ visible, onClose, onScan }) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = 'barcode-scanner';

  useEffect(() => {
    if (visible && !scanning) {
      // Modal opened, will start scanning in useEffect below
    }
    return () => {
      stopScanning();
    };
  }, [visible]);

  useEffect(() => {
    if (visible && !scanning) {
      startScanning();
    } else if (!visible) {
      stopScanning();
    }
  }, [visible]);

  const startScanning = async () => {
    if (scanning) return;

    try {
      setScanning(true);
      const html5Qrcode = new Html5Qrcode(scannerId);
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // QR code scan failure - ignore and continue
        }
      );
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setScanning(false);
      message.error('无法访问摄像头，请检查权限设置');
    }
  };

  const stopScanning = async () => {
    if (html5QrcodeRef.current && scanning) {
      try {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current = null;
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      }
    }
    setScanning(false);
  };

  const handleScanSuccess = (barcode: string) => {
    stopScanning();
    onScan(barcode);
    setManualBarcode('');
    onClose();
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      handleScanSuccess(manualBarcode.trim());
    }
  };

  const handleClose = () => {
    stopScanning();
    setManualBarcode('');
    onClose();
  };

  return (
    <Modal
      title="扫码入库"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={400}
      destroyOnClose
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {!scanning ? (
          <Button
            type="primary"
            icon={<CameraOutlined />}
            onClick={startScanning}
            size="large"
          >
            启动摄像头
          </Button>
        ) : (
          <div
            id={scannerId}
            style={{ width: '100%', minHeight: '200px', background: '#000' }}
          />
        )}
      </div>

      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 16 }}>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 12 }}>或手动输入条码</p>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="请输入商品条码"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onPressEnter={handleManualSubmit}
          />
          <Button type="primary" onClick={handleManualSubmit}>
            确定
          </Button>
        </Space.Compact>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button icon={<DeleteOutlined />} onClick={handleClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
};

export default BarcodeScanner;