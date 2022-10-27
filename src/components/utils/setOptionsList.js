import {
    AlignLeftOutlined
  } from '@ant-design/icons';
  import { Popconfirm, Popover } from "antd";
  import { useState } from 'react';
  
  
  export const OptionsLists = (handleDelete, handleUpdate) => {
    const dat = [
      {
        title: "Eliminar",
        dataIndex: "delete",
        width: "70px",
        render: (_, record) => (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ),
      },
      {
        title: "Editar",
        dataIndex: "edit",
        width: "70px",
        render: (_, record) => (
          // data.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            // okText="Si" cancelText={falce}
            // onConfirm={() => handleUpdate(record.key)}
            onConfirm={() => handleUpdate(record)}
          >
            <a>Editar</a>
          </Popconfirm>
        ),
        // ) : null,
      },
    ];
    return dat;
  };
  
  
  export const setOptionsBlock = (contextMenu) => {
  
    const dat = [
      {
        title: "Options",
        dataIndex: "options",
        className: "wp-50",
        render: (_, record) => (
          <Popover
            title=""
            content={() => contextMenu({ ...record })}
            placement="right"
            // open={true}
          >
            <a><AlignLeftOutlined /></a>
          </Popover>
        )
      }
    ];
    return dat;
  };
  
  export const addColumn = ({type, title, name, width, data}) => {
  
    const dat = [
      {
        title: "Options",
        dataIndex: "options",
        className: "wp-100",
        render: (_, record) => (
         <a>Ver Foto</a>
        )
      }
    ];
    return dat;
  };
  