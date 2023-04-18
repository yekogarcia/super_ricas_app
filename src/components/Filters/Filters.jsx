import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import moment from "moment";

import "./Filters.scss";

const { RangePicker } = DatePicker;
const { Search } = Input;


const CreateFilter = ({ label, name, type, func, options }) => {
  switch (type) {
    case "range_date":
      return (
        <Form.Item
          key={name}
          name={name}
          // rules={[{ required: required }]}
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
        >
          <RangePicker onChange={func} />
        </Form.Item>
      );
    case "select":
      return (
        <Form.Item
          key={name}
          name={name}
          // rules={[{ required: required }]}
          style={{
            display: "inline-block",
            width: "calc(20% - 8px)",
            margin: "4px 4px",
          }}
        >
          <Select
            showSearch
            placeholder={label}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={options}
          />
        </Form.Item>
      );
    default:
      return (
        <Form.Item
          key={name}
          name={name}
          // rules={[{ required: required }]}
          style={{
            display: "inline-block",
            width: "calc(15% - 8px)",
            margin: "4px 4px",
          }}
        >
          <Input placeholder={label} />
        </Form.Item>);
  }
}

export const Filters = ({ onSearch, form, loading, filters }) => {
  const getFilters = () => {
    const filters = form.getFieldsValue();


    let filtros = {};
    for (const key in filters) {
      if (Array.isArray(filters[key])) {
        filtros.fecha_inicio = typeof filters[key] !== 'undefined' ? moment(filters[key][0]["_d"]).format("YYYY-MM-DD") : '';
        filtros.fecha_fin = typeof filters[key] !== 'undefined' ? moment(filters[key][1]["_d"]).format("YYYY-MM-DD") : '';
      }
      filtros[key] = filters[key];
    }

    // filtros = {
    //   buscar: filters.buscar,
    //   fecha_inicio: typeof filters.fechas !== 'undefined' ? moment(filters.fechas[0]["_d"]).format("YYYY-MM-DD") : '',
    //   fecha_fin: typeof filters.fechas !== 'undefined' ? moment(filters.fechas[1]["_d"]).format("YYYY-MM-DD") : ''
    // }
    console.log(filtros)
    onSearch(filtros);
  }

  return (
    <div className="filters">
      {filters.length > 0 ? (
        <Form
          form={form}
          layout="inline"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          {
            filters.map((res) => (
              <CreateFilter {...res} key={res.name} />
            ))
          }
          <Form.Item>
            <Button type="primary" onClick={getFilters} >Buscar</Button>
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
