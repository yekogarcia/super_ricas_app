import { Space, Tag } from "antd";

export const setColumnsList = (cols, data) => {
  let columns = [];
  // console.log(data);
  const handleModalImage = (record) => {
    // console.log(record);
  };

  cols.forEach(({ type, label, name, filter, width, visible= true }) => {
    if (!width) {
      width = "wp-150";
    }
    if (!visible) {
      width += " hide";
    }
    

    let col = {
      key: name,
      title: label,
      dataIndex: name,
      className: width,
    };

    if (filter) {
      const f = filter.split(".");
      if (f.includes("order")) {
        // col.sorter = (a, b) => console.log(a[name]);;
        col.sorter = (a, b) => a[name].length - b[name].length;
        // col.sortDirections = ["descend"];
      }

      if (f.includes("search")) {
        col.filterSearch = true;
        col.onFilter = (value, record) => record[name].indexOf(value) === 0;
        col.filters = [];
        data.map((pr) => {
          col.filters.push({
            text: pr[name],
            value: pr[name],
          });
        });
      }
    }

    if (type === "tags") {
      col.render = (_, { academy }) => (
        <>
          {academy.map((pr) => {
            return (
              <Tag color="volcano" key={pr}>
                {pr}
              </Tag>
            );
          })}
        </>
      );
    }
    if (type === "image") {
      col.render = (_, record) => (
        <Space
          className="image-column"
          size="middle"
          onClick={handleModalImage(record)}
        >
          <img
            className="image-column"
            src={process.env.REACT_APP_URL_FILES + record.photo_profile}
            alt="photo prfile"
          />
        </Space>
      );
    }

    // console.log(col);
    columns.push(col);
  });

  return columns;
};
