import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
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
    marginRight: theme.spacing(10),
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
    marginRight: theme.spacing(3),
    width: '360px',
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
    width: '500px',
    height: '600px',
    // 设置内容区域的布局方式
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
  },
  loadButton: {
    position: 'fixed',
    zIndex: 9999,
    margin: theme.spacing(1),
    width: 200,
    height: 50,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9900,
  },

  dimmedBackground: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9000,
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
  attachmentInput: {
    width: '70%',
    marginTop: theme.spacing(1),
  }
}));

function CardPanel() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [proid, setProid] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameFromQuery = queryParams.get('username');
    if (usernameFromQuery) {
      setUsername(usernameFromQuery);
    }
    const proParams = new URLSearchParams(location.search);
    const proFromQuery = proParams.get('projectId');
    if (proFromQuery) {
      setProid(proFromQuery);
    }
  }, [location.search]);

  // Round组件 
  function Round() {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);
    const wrapperRef = useRef(null);

    const handleTodoClick = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:7001/readAll/todo', { proId: proid, user_id: username, state: "TODO" });
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
        const response = await axios.post('http://127.0.0.1:7001/readAll/doing', { proId: proid, user_id: username, state: "DOING" });
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
        const response = await axios.post('http://127.0.0.1:7001/readAll/done', { proId: proid, user_id: username, state: "DONE" });
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
        const response = await axios.post('http://127.0.0.1:7001/readAll', { proId: proid, user_id: username });
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
  const [cards, setCards] = useState([]);
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
  const [newTaskContent, setNewTaskContent] = useState('');

  const stateOptions = ['TODO', 'DOING', 'DONE']; //状态选择
  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setEditedState(selectedState);
  };
  const readAll = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:7001/readAll', { proId: proid, user_id: username });
      if (response.data.status === 200) {
        setCards(response.data.body.projects);
        alert('读取成功');
        setShowLoadButton(false);
      } else {
        alert('读取失败');
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
        proId: proid,
        user_id: username,
        id: newId,
        state: "TODO",
        title: newCardTitle,
        content: 'New card content',
        date: newCardDate,
        tasks: [{ id: 1, title: 'title', content: 'content' }]
      };
      const newCardForm = {
        proId: proid,
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
        alert('创建成功');
      } else {
        alert('创建失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  // 删除项目
  const handleDeleteCard = (id) => {
    const deleteCardForm = {
      proId: proid,
      project_id: id,
    };
    postDeleteCard(deleteCardForm)
    setCards(cards.filter(card => card.id !== id));
  };

  async function postDeleteCard(deleteCardForm) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/deleteCard", deleteCardForm);
      if (res.data.status === 200) {
        alert('删除成功');
      } else {
        alert('删除失败');
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
        alert('修改成功');
      } else {
        alert('修改失败');
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
            proId: proid,
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
      setDialogOpen(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setDialogOpen(false);
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
        alert('发表成功');
      } else {
        alert('发表失败');
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
        alert('删评成功');
      } else {
        alert('删评失败');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCardClick = (card) => {
    readFileData(card.id);
    setDialogOpen(true);
    handleEditCard(card);
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

  // 附件上传
  const [uploadedFileName, setUploadedFileName] = useState([{ filename: "aFile" }]);

  const handleFileChange = async (event, cardId) => {
    const file = event.target.files[0]; // 获取文件对象
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post("http://127.0.0.1:7001/upload", formData);
      if (res.data.status === 200) {
        const dataForm = {
          files: res.data.body.files,
          information: {
            username: username,
            proId: proid,
            project_id: cardId,
            id: Date.now()
          }
        }
        postFileData(dataForm);
        setUploadedFileName([...uploadedFileName, { filename: file.name }]);
      } else {
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  };

  async function postFileData(fileForm) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/fileData", fileForm);
      if (res.data.status === 200) {
        alert("上传成功");
      } else {
        alert("上传失败");
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  const handleDeleteFile = (cardId, fileName) => {
    const fileIndex = uploadedFileName.findIndex(file => file.filename === fileName);

    if (fileIndex >= 0) {
      postDeleteFileData(cardId, fileName);
      postDeleteFile(fileName);
      const updatedList = uploadedFileName.filter(file => file.filename !== fileName);
      setUploadedFileName(updatedList);
    };
  }

  async function postDeleteFileData(project_id, fileName) {
    const fileForm = {
      proId: proid,
      project_id: project_id,
      fileName: fileName
    }
    try {
      const res = await axios.post("http://127.0.0.1:7001/deleteData", fileForm);
      if (res.data.status === 200) {
      } else {
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  async function postDeleteFile(fileName) {
    try {
      const res = await axios.post("http://127.0.0.1:7001/deleteFile", { filename: fileName });
      if (res.data.status === 200) {
        alert("删除附件成功");
      } else {
        alert("删除附件失败");
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  const handleDownLoad = async (fileName) => {
    try {
      const res = await axios.post("http://127.0.0.1:7001/downLoadFile", { filename: fileName });
      if (res.data.status === 200) {
        alert("文件下载至默认下载目录");
      } else {
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  const readFileData = async (cardId) => {
    const fileForm = {
      proId: proid,
      project_id: cardId,
    }
    try {
      const res = await axios.post("http://127.0.0.1:7001/readData", fileForm);
      if (res.data.status === 200) {
        setUploadedFileName(res.data.body.files);
      } else {
        alert("失败");
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  }

  return (
    <div>
      <div className={classes.cardGrid}>
        <div className={classes.roundContainer}>
          <Round />
        </div>
        <div className={classes.fixedButtonContainer}>
          <TextField
            label="任务名称"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className={classes.cardInput}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.addCardButton}
            onClick={handleAddCard}
            disabled={!newCardTitle.trim()}
          >
            新增任务
          </Button>

        </div>
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card.id} xs={12} sm={6} md={6}>
              <Card className={classes.card}>
                <div className={classes.cardStatus}>
                  {card.state}
                </div>
                <CardActionArea onClick={() => handleCardClick(card)}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.h2}>
                      {card.title}
                    </Typography>
                    <Typography>{card.content}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogContent className={classes.dialogContent}>
                  {editingCard === card.id && (
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
                          multiline
                        />
                      </form>
                      <TextField
                        label="任务名称"
                        value={editedTitle}
                        onChange={(e) => handleChange('title', e)}
                        className={classes.cardInput}
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                      />

                      <TextField
                        label="任务内容"
                        value={editedContent}
                        onChange={(e) => handleChange('content', e)}
                        className={classes.cardInput}
                        margin="normal"
                        multiline
                      />

                      <TextField
                        label="评论"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className={classes.taskInput}
                        multiline
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
                        发表评论
                      </Button>

                      <List className={classes.taskList}>
                        {card.tasks.map(task => (
                          <ListItem key={task.id}>
                            <ListItemText
                              primary={task.title}
                              secondary={`
                          user: ${task.user_id}
                        `}
                            />
                            <Button onClick={() => handleDeleteTask(card.id, task.id)} className={classes.editButton}>删除</Button>
                          </ListItem>
                        ))}
                      </List>

                      <input
                        accept=".pdf,.docx,.jpg,.png,.doc" // 限制文件类型，根据需要调整
                        style={{ display: 'none' }} // 隐藏原生的 file input
                        id="icon-button-file"
                        type="file"
                        onChange={(event) => handleFileChange(event, card.id)}
                      />
                      <label htmlFor="icon-button-file">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          className={classes.uploadButton} // 确保你有一个对应的CSS类
                        >
                          上传附件
                        </Button>
                      </label>

                      <List className={classes.taskList}>
                        {uploadedFileName.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={file.filename}
                            />
                            <Box
                              component="div"
                              display="flex"
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              <Button
                                edge="end"
                                aria-label="enter"
                                onClick={() => handleDownLoad(file.filename)}
                              >
                                下载
                              </Button>
                              <Button
                                edge="end"
                                aria-label="delete"
                                color="secondary"
                                onClick={() => handleDeleteFile(card.id, file.filename)}
                              >
                                删除
                              </Button>
                            </Box>
                          </ListItem>
                        ))}
                      </List>

                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.editButton}
                        onClick={handleSaveCard}
                      >
                        保存任务
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.editButton}
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        删除任务
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.editButton}
                        onClick={handleCancelEdit}
                      >
                        取消
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className={showLoadButton ? classes.dimmedBackground : ''}>
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
    </div>
  );
}

export default CardPanel;