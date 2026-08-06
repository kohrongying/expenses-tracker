import React from "react";
import { List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { categories } from "../../constants/ExpenseCategories";
import { formatCentsToString } from "../../helpers/common";

const ItemIcon = (categoryName) => {
  const foundCategory = categories.find(
    (iterator) => iterator.value.toLowerCase() === categoryName.toLowerCase()
  );
  if (foundCategory) {
    return foundCategory.avatarIcon;
  } else {
    const defaultIcon = categories[0].avatarIcon;
    return defaultIcon;
  }
};

const ExpenseItem = ({ dashboard, item, removeItem }) => (
  <List.Item
    actions={
      dashboard
        ? null
        : [
            <DeleteOutlined
              key={`delete-item${item.id}`}
              type="delete"
              onClick={removeItem(item.id)}
            />,
          ]
    }
    style={{
      padding: 10,
      marginBottom: 6,
      borderRadius: 10,
      boxShadow: " 0px 3px 16px 0px rgba(0,0,0,0.16)",
    }}
  >
    <List.Item.Meta
      avatar={ItemIcon(item.category)}
      title={item.desc ?? item.category}
      description={item.date.toDate().toDateString()}
    />
    <div>{`S$ ${formatCentsToString(item.amountInCents)}`}</div>
  </List.Item>
);

export default ExpenseItem;