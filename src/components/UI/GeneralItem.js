import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar, Icon } from "antd";

const GeneralItem = ({ item, removeItem }) => (
  <List.Item
    actions={[
      <Icon key="delete" type="delete" onClick={removeItem(item.id)} />
    ]}
  >
    <List.Item.Meta
      avatar={<Avatar size="large" icon="dollar" />}
      title={item.source}
      style={{ alignItems: "center" }}
    />

    <div>{`S$ ${formatNumber(item.amount)}`}</div>

  </List.Item>
);

GeneralItem.propTypes = {
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default GeneralItem;