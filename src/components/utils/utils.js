export const formatMoney = (number) => {
  return new Intl.NumberFormat("ES-MX", {
    style: "currency",
    currency: "MXN",
  }).format(number);
};

export const unformatMoney = (number) => {
  const val = number.replace(".00", "");
  // console.log(number.replace(/\D/, ""));
  return parseFloat(val.replace(/[^\w\s]/gi, ""));
};

export const formatArrayMoney = (array, columns) => {
  const cols = columns.filter(({ format }) => format === "money");
  cols.forEach((col) => {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      array[i][col.name] = formatMoney(element[col.name]);
    }
  });
  return array;
};

export const unformatArrayMoney = (array, columns) => {
  const newArray = [];
  const cols = columns.filter(({ format }) => format === "money");
  for (let i = 0; i < array.length; i++) {
    let values = Object.assign({}, array[i]);
    cols.forEach((col) => {
      const element = array[i];
      if (typeof element[col.name] !== 'undefined') {
        // array[i][col.name] = unformatMoney(element[col.name]);
        values[col.name] = unformatMoney(element[col.name]);
      }
    });
    newArray.push(values);
  }
  return newArray;
};
