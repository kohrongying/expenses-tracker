import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar, Icon } from "antd";

const IncomeItem = ({ item, removeItem }) => (
  <List.Item
    actions={[
      <Icon key="delete" type="delete" onClick={removeItem(item.id)} />
    ]}
  >
    <List.Item.Meta
      avatar={<Avatar size="large" icon="dollar" />}
      title={`S$ ${formatNumber(item.amount)}`}
      description={item.incomeSource}
    />
  </List.Item>
);

IncomeItem.propTypes = {
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default IncomeItem;