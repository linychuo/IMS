import React, { useState } from 'react';
import { Checkbox, Button, Space, Modal, Select, Input, Divider, Card } from 'antd';
import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';

interface FieldOption {
  key: string;
  title: string;
}

interface ExportFieldSelectorProps {
  visible: boolean;
  onClose: () => void;
  onExport: (selectedFields: string[]) => void;
  fields: FieldOption[];
  reportType: string;
  templateName?: string;
  onSaveTemplate?: (name: string, fields: string[]) => void;
  savedTemplates?: { id: string; name: string; fields: string[] }[];
  onLoadTemplate?: (templateId: string) => void;
}

const ExportFieldSelector: React.FC<ExportFieldSelectorProps> = ({
  visible,
  onClose,
  onExport,
  fields,
  reportType,
  templateName,
  onSaveTemplate,
  savedTemplates = [],
  onLoadTemplate,
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.key));
  const [saveTemplateVisible, setSaveTemplateVisible] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFields(fields.map(f => f.key));
    } else {
      setSelectedFields([]);
    }
  };

  const handleFieldChange = (key: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, key]);
    } else {
      setSelectedFields(selectedFields.filter(k => k !== key));
    }
  };

  const handleSaveTemplate = () => {
    if (newTemplateName.trim() && onSaveTemplate) {
      onSaveTemplate(newTemplateName.trim(), selectedFields);
      setNewTemplateName('');
      setSaveTemplateVisible(false);
    }
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      return;
    }
    onExport(selectedFields);
    onClose();
  };

  return (
    <Modal
      title="选择导出字段"
      open={visible}
      onOk={handleExport}
      onCancel={onClose}
      width={500}
      okText="导出"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Checkbox
            checked={selectedFields.length === fields.length}
            indeterminate={selectedFields.length > 0 && selectedFields.length < fields.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            全选 / 全不选
          </Checkbox>
          <span style={{ color: '#888' }}>
            已选 {selectedFields.length}/{fields.length} 个字段
          </span>
        </Space>
      </div>

      <Card size="small" style={{ maxHeight: 300, overflow: 'auto', marginBottom: 16 }}>
        <Checkbox.Group
          value={selectedFields}
          onChange={(values) => setSelectedFields(values as string[])}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {fields.map(field => (
              <Checkbox key={field.key} value={field.key} style={{ marginLeft: 8 }}>
                {field.title}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Card>

      {savedTemplates.length > 0 && onLoadTemplate && (
        <div style={{ marginBottom: 16 }}>
          <Divider style={{ margin: '12px 0' }}>保存的模板</Divider>
          <Space>
            <Select
              placeholder="选择模板"
              style={{ width: 200 }}
              onChange={(value) => onLoadTemplate(value)}
              allowClear
            >
              {savedTemplates.map(t => (
                <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
              ))}
            </Select>
          </Space>
        </div>
      )}

      {onSaveTemplate && (
        <div>
          <Button
            icon={<SaveOutlined />}
            onClick={() => setSaveTemplateVisible(true)}
            disabled={selectedFields.length === 0}
          >
            保存为模板
          </Button>
        </div>
      )}

      <Modal
        title="保存导出模板"
        open={saveTemplateVisible}
        onOk={handleSaveTemplate}
        onCancel={() => setSaveTemplateVisible(false)}
        width={400}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="输入模板名称"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
          <div style={{ fontSize: 12, color: '#888' }}>
            将保存 {selectedFields.length} 个字段的导出配置
          </div>
        </Space>
      </Modal>
    </Modal>
  );
};

export default ExportFieldSelector;