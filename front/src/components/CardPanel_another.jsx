import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import axios from 'axios';
import { red } from '@material-ui/core/colors';
import '../style/Round.css';
import '../style/CardPanel.css';


const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(20),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(30), //到左边的间距
    width: '100%',
    position: 'relative',
  },
  gridContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    // 根据需要调整间距
    spacing: 4,
  },
  card: {
    width: 500,
    maxHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    marginRight: theme.spacing(10)
  },
  cardContent: {
    flexGrow: 1,
  },
  h2: {
    color: red[500],
  },
  addCardButton: {
    position: 'fixed',
    left: '400px',
  },
  cardInput: {
    marginRight: theme.spacing(2),
    width: '300px',
  },
  fixedButtonContainer: {
    position: 'fixed',
    top: '15%',
    left: '400px',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  editButton: {
    margin: theme.spacing(1),
    width: 200,
  },
  dateInput: {
    margin: theme.spacing(1),
  },
  taskInput: {
    width: '50%',
    marginTop: theme.spacing(1),
  },
  taskList: {
    maxHeight: 150,
    overflow: 'auto',
  },
  dialogContent: {
    // 设置内容区域的大小
    width: '800px',
    height: '600px',
    // 设置内容区域的布局方式
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  loadButton: {
    position: 'fixed',
    zIndex:9999,
    margin: theme.spacing(1),
    width: 200,
    height: 50, // 假设按钮高度为50，如果没有设置高度，请添加高度属性
    position: 'fixed',
    top: theme.spacing(30),
    left: theme.spacing(55),
    transform: 'translate(-50%, -50%)', // 向左和向上移动50%自身宽度和高度来居中
    zIndex: 2000,
  },

  dimmedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 900,
  },
  cardStatus: {
    position: 'relative',
    width: theme.spacing(10),
    margin: theme.spacing(-2),
    top: theme.spacing(2.5),
    left: theme.spacing(2.5),
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#3f51b5',
    padding: '4px 8px',
    borderRadius: '4px',
    zIndex: 1,
  },
}));

function CardPanel() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const location = useLocation();

  useEffect(() => {
    // 从URL的search参数中解析用户名
    const queryParams = new URLSearchParams(location.search);
    const usernameFromQuery = queryParams.get('username');
    if (usernameFromQuery) {
      setUsername(usernameFromQuery);
    }
  }, [location.search]);

  // Round组件 
  function Round() {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);
    const wrapperRef = useRef(null);

    const handleTodoClick = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:7001/readAll/todo', { user_id: username, state: "TODO" });
        if (response.data.status === 200) {
          setCards(response.data.body.projects);
          setShowLoadButton(false);
        } else {
        }
      } catch (error) {
        alert('请求失败: ' + error.message);
      }
      console.log('TODO button clicked');
    };

    const handleDoingClick = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:7001/readAll/doing', { user_id: username, state: "DOING" });
        if (response.data.status === 200) {
          setCards(response.data.body.projects);
          setShowLoadButton(false);
        } else {
        }
      } catch (error) {
        alert('请求失败: ' + error.message);
      }
      console.log('TODO button clicked');
    };
    const handleDoneClick = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:7001/readAll/done', { user_id: username, state: "DONE" });
        if (response.data.status === 200) {
          setCards(response.data.body.projects);
          setShowLoadButton(false);
        } else {
        }
      } catch (error) {
        alert('请求失败: ' + error.message);
      }
      console.log('TODO button clicked');
    };

    const readAll = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:7001/readAll', { user_id: username });
        if (response.data.status === 200) {
          setCards(response.data.body.projects);
          setShowLoadButton(false);
        } else {
        }
      } catch (error) {
        alert('请求失败: ' + error.message);
      }
    };


    useEffect(() => {
      const button = buttonRef.current;
      const wrapper = wrapperRef.current;

      if (!button || !wrapper) return;

      const handler = () => {
        if (!isOpen) {
          button.textContent = "Close";
          wrapper.classList.add('opened-nav');
        } else {
          button.textContent = "Menu";
          wrapper.classList.remove('opened-nav');
        }
        setIsOpen(!isOpen);
      };
      button.addEventListener('click', handler);

      return () => {
        button.removeEventListener('click', handler);
      };
    }, [isOpen]);

    return (
      <div className="csstransforms container">
        <div className="component">
          {/*Start Nav Structure*/}
          <button className="cn-button" id="cn-button" ref={buttonRef}>Menu</button>
          <div className="cn-wrapper" id="cn-wrapper" ref={wrapperRef}>
            <ul>
              <li>
                <a href="#" onClick={handleTodoClick}>
                  <span>TODO</span>
                  <svg className="caticon" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="35px" height="70px"
                    viewBox="0 0 512 512" enableBackground="new 0 0 50 50" xmlSpace="preserve">
                    <path fill="white" id="shop-3-icon" d="M79.792,217.25v235h352.75v-235H79.792z M397.542,381.75h-282.75v-129.5h282.75V381.75z M220.62,59.75
                                      l-17.798,85.332h-0.081v17.34c0,18.314-14.847,33.161-33.161,33.161s-33.16-14.847-33.16-33.161v-17.34l50.841-85.332H220.62z
                                      M168.232,59.75l-51.91,85.332v17.34c0,18.314-14.847,33.161-33.161,33.161S50,180.736,50,162.422v-17.34l83.666-85.332H168.232z
                                      M462,145.082v17.34c0,18.314-14.847,33.161-33.161,33.161s-33.161-14.847-33.161-33.161v-17.34l-51.91-85.332h34.566L462,145.082z
                                      M289.08,145.082h0.081v17.34c0,18.314-14.847,33.161-33.161,33.161s-33.161-14.847-33.161-33.161v-17.34h0.081l16.729-85.332
                                      h32.703L289.08,145.082z M324.739,59.75l50.841,85.332v17.34c0,18.314-14.846,33.161-33.16,33.161s-33.161-14.847-33.161-33.161
                                      v-17.34h-0.081L291.38,59.75H324.739z" />
                  </svg>
                </a>
              </li>
              <li><a href="#" onClick={handleDoingClick}><span>DOING</span></a></li>
              <li><a href="#" onClick={handleDoneClick}><span>DONE</span></a></li>
              <li><a href="#" onClick={readAll}><span>ALL</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  const [cards, setCards] = useState([
    {
      user_id: username,
      id: 1,
      state: 'TODO',
      title: 'Project 1',
      content: 'New Card Content',
      date: '2024-08-01',
      tasks: [
        { user_id: username, id: 1, project_id: 1, title: 'Task 1', description: 'Task content', date: '2024-08-02' },
      ],
    },
  ]);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDate, setNewCardDate] = useState('2024-07-29'); // 新卡片的日期
  const [editingCard, setEditingCard] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedDate, setEditedDate] = useState(''); // 正在编辑的卡片的日期
  const [editedState, setEditedState] = useState('');

  const [showLoadButton, setShowLoadButton] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newTaskTitle, setNewTaskTitle] = useState(''); //新任务标题

  const [newTaskChangeTitle, setNewChangeTaskTitle] = useState(''); //修改任务标题
  const [newTaskContent,setNewTaskContent] = useState('');

  const stateOptions = ['TODO', 'DOING', 'DONE']; //状态选择
  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setEditedState(selectedState);
  };
  const readAll = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:7001/readAll', { user_id: username });
      if (response.data.status === 200) {
        setCards(response.data.body.projects);
        alert('读取项目成功');
        setShowLoadButton(false);
      } else {
        alert('读取项目失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  };


  // 新建项目
  const handleAddCard = (e) => {
    let newId = 1;
    if (newCardTitle.trim() !== '') {
      newId = Math.floor(Date.now() / 1000);
      const newCard = {
        user_id: username,
        id: newId,
        state: "TODO",
        title: newCardTitle,
        content: 'New card content',
        date: newCardDate,
        tasks: [{ id: 1, title: 'title', content: 'content' }]
      };
      const newCardForm = {
        user_id: username,
        project_id: newId,
        project_state: "TODO",
        project_name: newCardTitle,
        project_ddl: newCardDate,
        project_content: 'New Card content',
      }
      postAddCard(newCardForm);
      setCards([...cards, newCard]);
      setNewCardTitle('');
      setNewCardDate('2024-07-29'); // 重置日期
    }
  };

  async function postAddCard(newCardForm) {
    try {
      const res = await axios.post('http://127.0.0.1:7001/addCard', newCardForm);
      if (res.data.status === 200) {
        alert('创建项目成功');
      } else {
        alert('创建项目失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  // 删除项目
  const handleDeleteCard = (id) => {
    const deleteCardForm = {
      project_id: id,
    };
    postDeleteCard(deleteCardForm)
    setCards(cards.filter(card => card.id !== id));
  };

  async function postDeleteCard(deleteCardForm) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/deleteCard", deleteCardForm);
      if (res.data.status === 200) {
        alert('删除项目成功');
      } else {
        alert('删除项目失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  // 编辑项目
  const handleEditCard = (card) => {
    setEditingCard(card.id);
    setEditedTitle(card.title);
    setEditedContent(card.content);
    setEditedDate(card.date);
    setEditedState(card.state);
  };

  async function postEditedCard(editedCard) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/editCard", editedCard);
      if (res.data.status === 200) {
        alert('修改项目成功');
      } else {
        alert('修改项目失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  const handleSaveCard = () => {
    if (editedTitle.trim() !== '') {
      setCards(cards.map((card) => {
        if (card.id === editingCard) {
          const editedCard = {
            user_id: username,
            project_id: card.id,
            project_state: editedState,
            project_name: card.title,
            project_ddl: card.date,
            project_content: card.content,
          }
          postEditedCard(editedCard);
          return { ...card, state: editedState, title: editedTitle, content: editedContent, date: editedDate };
        }
        return card;
      }));

      setEditingCard(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
  };

  const handleChange = (type, event) => {
    const value = event.target.value;
    if (type === 'title') {
      setEditedTitle(value);
    } else if (type === 'content') {
      setEditedContent(value);
    } else if (type === 'date') {
      setEditedDate(value);
    }
  };

  //新建任务
  const handleAddTask = (cardId) => {
    if (newTaskTitle.trim() !== '') {
      const newTask = {
        user_id: username,
        project_id: cardId,
        id: Math.floor(Date.now() / 100000),
        title: newTaskTitle,
        content: 'New task content',
      };
      setCards(cards.map(card => {
        if (card.id === cardId) {
          return {
            ...card,
            tasks: [...card.tasks, newTask],
          };
        }
        return card;
      }));
      postAddTask(newTask);
      setNewTaskTitle('');
    }
  };

  async function postAddTask(newTask) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/addTask", newTask);
      if (res.data.status === 200) {
        alert('新建任务成功');
      } else {
        alert('新建任务失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  //删除任务
  const handleDeleteTask = (cardId, taskId) => {
    setCards(cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          tasks: card.tasks.filter(task => task.id !== taskId),
        };
      }
      return card;
    }));
    const deleteTaskForm = {
      user_id: username,
      project_id: cardId,
      task_id: taskId,
    }
    postDeleteTask(deleteTaskForm);
  };

  async function postDeleteTask(deleteTaskForm) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/deleteTask", deleteTaskForm);
      if (res.data.status === 200) {
        alert('删除任务成功');
      } else {
        alert('删除任务失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  //编辑任务
  const handleEditTask = () => {
    const updatedTasks = cards.map(card => {
      const editedTaskForm = {
        user_id: username,
        id: selectedTask.id,
        project_id: card.id,
        title: card.title,
        content: card.content
      }
      postEditTask(editedTaskForm);
      return {
        ...card,
        tasks: card.tasks.map(task => task.id === selectedTask.id ? {
          ...task,
          title: newTaskChangeTitle,
          content: newTaskContent,
        } : task),
      };
    });
    setCards(updatedTasks);
    // 关闭对话框
    setDialogOpen(false);
    setSelectedTask(null);
  };

  async function postEditTask(editedTaskForm) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/editTask", editedTaskForm);
      if (res.data.status === 200) {
      } else {
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  return (
    <div className={showLoadButton ? classes.dimmedBackground : ''}>
      <div className={classes.cardGrid}>
        <div className={classes.roundContainer}>
          <Round />
        </div>
        <div className={classes.fixedButtonContainer}>
          <TextField
            label="Card Title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className={classes.cardInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.addCardButton}
            onClick={handleAddCard}
            disabled={!newCardTitle.trim()}
          >
            Add Card
          </Button>
          {showLoadButton && (
            <Button
              variant="contained"
              color="primary"
              className={classes.loadButton}
              onClick={readAll}
            >
              Start Work !
            </Button>
          )}
        </div>
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card.id} xs={12} sm={6} md={6}>
              <Card className={classes.card}>
                <div className={classes.cardStatus}>
                  {card.state}
                </div>
                {editingCard === card.id ? (
                  <div>
                    <label htmlFor="cardStatusSelect">Status:</label>
                    <select
                      id="cardStatusSelect"
                      value={editedState}
                      onChange={handleStateChange}
                      className={classes.selectState}
                    >
                      {stateOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <form className={classes.container} noValidate>
                      <TextField
                        id="date"
                        label="DDL"
                        type="date"
                        value={editedDate}
                        onChange={(e) => handleChange('date', e)}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </form>
                    <TextField
                      label="Project Title"
                      value={editedTitle}
                      onChange={(e) => handleChange('title', e)}
                      className={classes.cardInput}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField
                      label="Project Content"
                      value={editedContent}
                      onChange={(e) => handleChange('content', e)}
                      className={classes.cardInput}
                      margin="normal"
                    />

                    <TextField
                      label="Add Task"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className={classes.taskInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTask(card.id);
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.editButton}
                      onClick={() => handleAddTask(card.id)}
                      disabled={!newTaskTitle.trim()}
                    >
                      Add Task
                    </Button>

                    <List className={classes.taskList}>
                      {card.tasks.map(task => (
                        <ListItem key={task.id} button onClick={() => handleTaskClick(task)}>
                          <ListItemText
                            primary={task.title}
                            secondary={`
                          Content: ${task.content}
                          Date: ${task.date}
                        `}
                          />
                          <Button onClick={() => handleDeleteTask(card.id, task.id)} className={classes.editButton}>Delete</Button>
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.editButton}
                      onClick={handleSaveCard}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.editButton}
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.editButton}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <CardActionArea onClick={() => handleEditCard(card)}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2" className={classes.h2}>
                        {card.title}
                      </Typography>
                      <Typography>{card.content}</Typography>
                    </CardContent>
                  </CardActionArea>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogContent className={classes.dialogContent}>
            {selectedTask && (
              <div>
                <TextField
                  label="Edit Task Title"
                  value={newTaskChangeTitle}
                  onChange={(e) => setNewChangeTaskTitle(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div />
                <TextField
                  label="Edit Task Content"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
                <Button onClick={handleEditTask} className={classes.editButton}>Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CardPanel;