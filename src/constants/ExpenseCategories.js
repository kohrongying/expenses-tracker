import Colors from "./Colors";
import { RestTwoTone, CarTwoTone, PlayCircleTwoTone, ShoppingTwoTone, ShopTwoTone, RestOutlined, ShopOutlined, CarOutlined, PlayCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export const categories = [
    {
      value: "Food",
      label: "Food",
      icon: <RestTwoTone twoToneColor={Colors.pink} style={{ fontSize: 18 }} />,
      avatarIcon: <Avatar size="large" icon={<RestOutlined />} style={{ backgroundColor: Colors.pink }} />,
    },
    {
      value: "Groceries",
      label: "Groceries",
      icon: <ShopTwoTone twoToneColor={Colors.purple} style={{ fontSize: 18 }} />,
      avatarIcon: <Avatar size="large" icon={<ShopOutlined />} style={{ backgroundColor: Colors.purple }} />,
    },
    {
      value: "Transport",
      label: "Transport",
      icon: <CarTwoTone twoToneColor={Colors.green} style={{ fontSize: 18 }} />,
      avatarIcon: <Avatar size="large" icon={<CarOutlined />} style={{ backgroundColor: Colors.green }} />,
    },
    {
      value: "Movie",
      label: "Movie",
      icon: <PlayCircleTwoTone twoToneColor={Colors.blue} style={{ fontSize: 18 }}/>,
      avatarIcon: <Avatar size="large" icon={<PlayCircleOutlined />} style={{ backgroundColor: Colors.blue }}  />,
    },
    {
      value: "Other",
      label: "Other",
      icon: <ShoppingTwoTone twoToneColor={Colors.yellow} style={{ fontSize: 18 }}/>,
      avatarIcon: <Avatar size="large" icon={<ShoppingOutlined />} style={{ backgroundColor: Colors.yellow }} />,
    }
];