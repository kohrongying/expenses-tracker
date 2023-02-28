import React from "react";
import Colors from "./Colors";
import { RestTwoTone, CarTwoTone, PlayCircleTwoTone, ShoppingTwoTone, ShopTwoTone, RestOutlined, ShopOutlined, CarOutlined, PlayCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export const categories = [
    {
      value: "Food",
      label: "Food",
      color: Colors.pink,
      icon: <RestTwoTone twoToneColor={Colors.pink} style={{ fontSize: 18 }} />,
      avatarIcon: <Avatar size="large" icon={<RestOutlined />} style={{ backgroundColor: Colors.pink }} />,
    },
    {
      value: "Groceries",
      label: "Groceries",
      color: Colors.purple,
      icon: <ShopTwoTone twoToneColor={Colors.purple} style={{ fontSize: 18 }} />,
      avatarIcon: <Avatar size="large" icon={<ShopOutlined />} style={{ backgroundColor: Colors.purple }} />,
    },
    {
      value: "Transport",
      label: "Transport",
      color: Colors.green,
      icon: <CarTwoTone twoToneColor={Colors.green} style={{ fontSize: 18 }} />,
      avatarIcon: <Avatar size="large" icon={<CarOutlined />} style={{ backgroundColor: Colors.green }} />,
    },
    {
      value: "Movie",
      label: "Movie",
      color: Colors.blue,
      icon: <PlayCircleTwoTone twoToneColor={Colors.blue} style={{ fontSize: 18 }}/>,
      avatarIcon: <Avatar size="large" icon={<PlayCircleOutlined />} style={{ backgroundColor: Colors.blue }}  />,
    },
    {
      value: "Other",
      label: "Other",
      color: Colors.yellow,
      icon: <ShoppingTwoTone twoToneColor={Colors.yellow} style={{ fontSize: 18 }}/>,
      avatarIcon: <Avatar size="large" icon={<ShoppingOutlined />} style={{ backgroundColor: Colors.yellow }} />,
    }
];