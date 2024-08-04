import React, { useState, useEffect } from 'react';
import { TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
// SideBar
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box';

// 自定义样式
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 300,
        flexShrink: 0,
        marginTop: 66,
    },
    drawerPaper: {
        width: 300,
        top: 66,
    },
    mainContent: {
        marginLeft: 240,
        width: `calc(100% - 240px)`,
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    list: {
        width: '100%',
    },
    cardInput: {
        marginRight: theme.spacing(2),
        width: '250px',
    },
    editButton: {
        top: theme.spacing(0),
        margin: theme.spacing(1),
        width: 180,
    },
    memberList: {
        top: theme.spacing(-2),
        height: 250,
        maxHeight: 300,
        overflow: 'auto',
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
        zIndex: 7000,
    },
    dimmedBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 6000,
    },
}));


function AdjustableList() {
    //SideBar
    const [username, setUsername] = useState('');
    const location = useLocation();



    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [memberList, setmemberList] = useState([{ name: username }]);
    const [newMember, setMember] = useState('');

    const [showLoadButton, setShowLoadButton] = useState(true);

    const handleChange = (type, event) => {
        const value = event.target.value;
        if (type === 'title') {
            setEditedTitle(value);
        } else if (type === 'content') {
            setEditedContent(value);
        }
    };
    const handleAddMember = async (member) => {
        if (newMember.trim() !== '') {
            const isExisted = await postMemberCheck({ username: member });
            if (!isExisted) {
                alert("成员不存在！")
                throw new Error(`Member ${member} does not exist.`);
            }
            else {
                setmemberList(memberList => [...memberList, { name: member }]);
                setMember('');
            }
        }
    };

    const handleDeleteMember = (memberName) => {
        const memberIndex = memberList.findIndex(member => member.name === memberName);

        if (memberIndex >= 0) {
            const updatedList = memberList.filter(member => member.name !== memberName);
            setmemberList(updatedList);
        };
    };

    const handleCreateProject = () => {
        const newProject = {
            id: Date.now(),
            title: editedTitle,
            content: editedContent,
            members: memberList,
        };

        setList(list => [...list, newProject]);
        postNewProject(newProject);

        setEditedTitle('');
        setEditedContent('');
        setmemberList([{ name: username }]);
        setMember('');
    };

    async function postNewProject(newProject) {
        const newProjectForm = {
            user_id: "当前用户",
            id: newProject.id,
            title: newProject.title,
            content: newProject.content,
            members: newProject.members,
        };

        for (let i = 0; i < newProject.members.length; i++) {
            try {
                newProjectForm.user_id = newProject.members[i].name;
                const res = await axios.post("http://127.0.0.1:7001/createPro", newProjectForm);
                if (res.data.status === 200) {
                    console.log('Project created successfully.');
                } else {
                    throw new Error('Failed to create project on the server');
                }
            } catch (error) {
                console.error('Error creating project:', error.message);
            }
        }
    }

    async function postMemberCheck(member) {
        try {
            const res = await axios.post("http://127.0.0.1:7001/checkMember", member);
            if (res.data.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Request failed:', error.message);
            throw error;
        }
    }
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const usernameFromQuery = queryParams.get('username');
        if (usernameFromQuery) {
            setUsername(usernameFromQuery);
            setmemberList([{ name: username }]);
        }
    }, [location.search]);

    const readAllPro = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:7001/readAllPro', { user_id: username });
            if (response.data.status === 200) {
                setShowLoadButton(false);
                setList(response.data.body.projects);
                alert("读取成功");
            } else {
                console.log('Failed to fetch projects:', response.data);
            }
        } catch (error) {
            alert('请求失败: ' + error.message);
        }
    };






    const [width, setWidth] = useState(1250);
    const [height, setHeight] = useState(635);
    const [top, setTop] = useState(66);  // 初始顶部位置
    const [left, setLeft] = useState(300); // 初始左侧位置

    const [list, setList] = useState([]);
    const classes = useStyles();
    const navigate = useNavigate();

    const handleDeletePro = async (proid) => {
        try {
            const response = await axios.post('http://127.0.0.1:7001/deletePro', { user_id: username, proId: proid });
            if (response.data.status === 200) {
                setList(currentList => currentList.filter(item => item.id !== proid));
            } else {
                console.log('Failed to fetch projects:', response.data);
            }
        } catch (error) {
            alert('请求失败: ' + error.message);
        }
    };

    return (
        <div>
            <Paper
                style={{
                    width: width,
                    height: height,
                    top: top,
                    left: left,
                    position: 'fixed',
                    padding: 16,
                    overflow: 'auto',
                }}
            >
                <List>
                    {list.map((item, index) => (
                        <ListItem
                            key={index}
                            button
                        >
                            <ListItemText
                                primary={item.title}
                                secondary={item.content}
                            />
                            {Array.isArray(item.members) && item.members.map((member, idx) => (
                                <ListItemIcon key={idx}>
                                    {member.name}
                                </ListItemIcon>
                            ))}
                            <Box
                                component="div"
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="center"
                            >
                                <Button
                                    edge="end"
                                    aria-label="enter"
                                    onClick={() => navigate(`/home?username=${username}&projectId=${item.id}`)}
                                >
                                    进入
                                </Button>
                                <Button
                                    edge="end"
                                    aria-label="delete"
                                    color="secondary"
                                    onClick={() => handleDeletePro(item.id)}
                                >
                                    删除
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <div>

                <Drawer
                    variant="permanent"
                    className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div>
                        <TextField
                            label="项目名称"
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
                            label="项目内容"
                            value={editedContent}
                            onChange={(e) => handleChange('content', e)}
                            className={classes.cardInput}
                            margin="normal"
                            multiline
                        />
                        <TextField
                            label="添加成员"
                            value={newMember}
                            onChange={(e) => setMember(e.target.value)}
                            className={classes.cardInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin='normal'
                            multiline
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.editButton}
                            onClick={() => handleAddMember(newMember)}
                            disabled={!newMember}
                            multiline
                        >
                            添加成员
                        </Button>


                        <List className={classes.memberList}>
                            {memberList.map(member => (
                                <ListItem>
                                    <ListItemText
                                        primary={member.name}
                                    />
                                    <Button onClick={() => handleDeleteMember(member.name)} className={classes.editButton}>Delete</Button>
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.editButton}
                            onClick={() => handleCreateProject()}
                        >
                            创建项目
                        </Button>
                    </div>
                </Drawer>
            </div>
            <div className={showLoadButton ? classes.dimmedBackground : ''}>
                {showLoadButton && (
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.loadButton}
                        onClick={readAllPro}
                    >
                        Start Work !
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AdjustableList;