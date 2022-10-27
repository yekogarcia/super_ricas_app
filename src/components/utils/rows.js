export const countDuplicatesItemsArray = (value, array) => {
  let count = 0;
  array.forEach((arrayValue) => {
    if (arrayValue == value) {
      count++;
    }
  });
  return count;
};

export const removeArrayDuplicates = (array) => {
  return Array.from(new Set(array));
};

export const removeItemArray = (array, item) => {
  const index = array.indexOf(item);
  console.log(index);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

export const removeRow = (data, id) => {
  const array = data.filter((item) => item.id !== id);
  console.log(array);
  return array;
};

export const updateRow = (data, item, id) => {
  const datNew = [...data];
  const index = data.findIndex((dat) => dat.id == id);
  if (index > -1) {
    const items = datNew[index];
    datNew.splice(index, 1, { ...items, ...item });
  }
  return datNew;
};

export const addRow = (data, dt) => {
  const datNew = [...data];
  const index = data.findIndex((b) => b.id === dt.id);
  if (index > -1) {
    const item = datNew[index];
    datNew.splice(index, 1, { ...item, ...dt });
  } else {
    console.log("prueba");
    datNew.push(dt);
  }
  return datNew;
};
