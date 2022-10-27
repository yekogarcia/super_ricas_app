import { Button, Form, Input, Space } from "antd";
import { useState } from "react";
const { Search } = Input;

export const Filters = ({ onSearch, loading, filters }) => {
  const [form] = Form.useForm();

  return (
    <div>
      {filters.length > 0 ? (
        <Form
          form={form}
          layout="inline"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item label="" name="search">
            <Search
              placeholder="Buscar..."
              enterButton="Buscar"
              // size="large"
              onSearch={onSearch}
              loading={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary">buscar</Button>
          </Form.Item>
        </Form>
      ) : (
        <Space>
          <Search
            placeholder="Buscar..."
            enterButton="Buscar"
            // size="large"
            allowClear
            onSearch={onSearch}
            loading={loading}
          />
        </Space>
      )}
    </div>
  );
};
