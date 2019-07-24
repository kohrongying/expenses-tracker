import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import FoodIcon from "@material-ui/icons/Fastfood";
import TransportIcon from "@material-ui/icons/Train";
import MovieIcon from "@material-ui/icons/Movie";
import OtherIcon from "@material-ui/icons/MoreHoriz";
import { pink, blue, purple, amber } from "@material-ui/core/colors";
import { formatNumber } from "../../helpers/common";

const Expense = (props) => {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          {props.item.category === "Food" ? (
            <Avatar style={{ backgroundColor: pink[300] }}>
              <FoodIcon />
            </Avatar>
          ) : (
            props.item.category === "Transport" ? (
              <Avatar style={{ backgroundColor: blue[300] }}>
                <TransportIcon />
              </Avatar>
            ) : (
              props.item.category === "Movie" ? (
                <Avatar style={{ backgroundColor: purple[300] }}>
                  <MovieIcon />
                </Avatar>
              ) : (
                <Avatar style={{ backgroundColor: amber[500] }}>
                  <OtherIcon />
                </Avatar>

              )
            )
          )}

        </ListItemAvatar>
        <ListItemText
          primary={`S$${formatNumber(props.item.amount)}`}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete" onClick={props.removeItem(props.item.id, props.item.amount)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

Expense.propTypes = {
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default Expense;