import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import InvestmentIcon from '@material-ui/icons/AccountBalance';
import { teal } from '@material-ui/core/colors';

const InvestmentItem = (props) => {
	return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar style={{backgroundColor: teal[400]}}>
              <InvestmentIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`$${props.item.amount}`}
          secondary={props.item.investment}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete">
            <DeleteIcon 
              onClick={() => props.removeItem(props.item.id)}
            />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>      
    </List>
  )
}

export default InvestmentItem;