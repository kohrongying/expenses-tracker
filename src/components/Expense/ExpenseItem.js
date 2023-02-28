import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { categories } from "../../constants/ExpenseCategories";

const ItemIcon = (categoryName) => {
  const foundCategory = categories.find(iterator => iterator.value.toLowerCase() === categoryName.toLowerCase())
  if (foundCategory) {
    return foundCategory.avatarIcon
  } else {
    const defaultIcon = categories[0].avatarIcon
    return defaultIcon
  }
}

const Expense = ({ dashboard, item, removeItem }) => (
  <List.Item
    actions={dashboard ? null : [
      <DeleteOutlined key={`delete-item${item.id}`} type="delete" onClick={removeItem(item.id)} />
    ]}
    style={{ padding: 10, marginBottom: 6, borderRadius: 10, boxShadow: " 0px 3px 16px 0px rgba(0,0,0,0.16)" }}
  >
    <List.Item.Meta
      avatar={ItemIcon(item.category)}
      title={item.remarks ? item.remarks : item.category}
      description={(new Date(item.date)).toDateString()}
    />
    <div>
      {`S$ ${formatNumber(item.amount)}`}
    </div>
  </List.Item>
);

Expense.propTypes = {
  dashboard: PropTypes.bool,
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func,
};

export default Expense;