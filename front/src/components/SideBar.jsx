import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Drawer from '@material-ui/core/Drawer';

// 自定义样式
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
    marginTop: 66, // 调整这里来匹配你的AppBar高度
  },
  drawerPaper: {
    width: 240,
    top: 66, // 与marginTop保持一致
  },
  mainContent: {
    marginLeft: 240, // 与侧边栏宽度一致，以留出空间
    width: `calc(100% - 240px)`, // 减去侧边栏的宽度
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  list: {
    width: '100%',
  },
  // 其他样式...
}));

function Sidebar() {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div>
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}

export default Sidebar;