import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    MenuItem
} from '@mui/material';

interface Task {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    completed: boolean;
    categoryColor: string;
}

interface CategoryOption {
    id: string;
    name: string;
    color: string;
}

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [updatedTask, setUpdatedTask] = useState(false);
    const [newTask, setNewTask] = useState({
        id: '',
        title: '',
        description: '',
        categoryId: '',
        completed: false
    });
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [titleError, setTitleError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/categories')
            .then(response => {
                setCategoryOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const getCategoryColor = (categoryId: string): string => {
        const category = categoryOptions.find(option => option.id === categoryId);
        return category ? category.color : '';
    };

    useEffect(() => {
        axios.get('/tasks')
            .then(response => {
                const tasksWithColors: Task[] = response.data.map((task: Task) => ({
                    ...task,
                    categoryColor: getCategoryColor(task.categoryId),
                }));

                const pending = tasksWithColors.filter(task => !task.completed);
                const completed = tasksWithColors.filter(task => task.completed);

                setTasks(tasksWithColors);
                setPendingTasks(pending);
                setCompletedTasks(completed);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, [categoryOptions, updatedTask]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewTask({ id: uuidv4(), title: '', description: '', categoryId: '', completed: false });
        setTitleError(null);
        setCategoryError(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleError(null);
        setCategoryError(null);
        setNewTask({ ...newTask, [event.target.name]: event.target.value });
    };

    const handleCreateTask = () => {
        if (!newTask.title || newTask.title.length > 40) {
            setTitleError('El título es obligatorio y debe tener como máximo 40 caracteres.');
            return;
        }
        if (!newTask.categoryId) {
            setCategoryError('La categoría es obligatoria.');
            return;
        }
        axios.post('/tasks', newTask)
            .then(response => {
                console.log('Respuesta de creación de tarea:', response.data);
                axios.get('/tasks')
                    .then(response => {
                        const tasksWithColors: Task[] = response.data.map((task: Task) => ({
                            ...task,
                            categoryColor: getCategoryColor(task.categoryId),
                        }));

                        const pending = tasksWithColors.filter(task => !task.completed);
                        const completed = tasksWithColors.filter(task => task.completed);

                        setTasks(tasksWithColors);
                        setPendingTasks(pending);
                        setCompletedTasks(completed);
                        setUpdatedTask(!updatedTask);
                    })
                    .catch(error => {
                        console.error('Error fetching tasks:', error);
                    });
                handleDialogClose();
            })
            .catch(error => {
                console.error('Error al crear tarea:', error);
            });
    };

    const handleTaskCheckboxToggle = (taskId: string) => {
        setSelectedTaskIds((prevSelectedTaskIds) => {
            const newSelectedTaskIds = new Set(prevSelectedTaskIds);
            if (newSelectedTaskIds.has(taskId)) {
                newSelectedTaskIds.delete(taskId);
            } else {
                newSelectedTaskIds.add(taskId);
            }
            return newSelectedTaskIds;
        });
    };

    const handleCompleteSelectedTasks = () => {
        selectedTaskIds.forEach((taskId) => {
            handleCompleteTask(taskId);
        });
        setSelectedTaskIds(new Set<string>());
    };

    const handleCompleteTask = (taskId: string) => {
        axios.patch(`/tasks/${taskId}`, { completed: true })
            .then(response => {
                console.log(`Tarea ${taskId} completada con éxito:`, response.data);
                setUpdatedTask(!updatedTask);
            })
            .catch(error => {
                console.error(`Error al completar la tarea ${taskId}:`, error);
            });
    };

    const handleDeleteSelectedTasks = () => {
        selectedTaskIds.forEach((taskId) => {
            handleDeleteTask(taskId);
        });
        setSelectedTaskIds(new Set<string>());
    };

    const handleDeleteTask = (taskId: string) => {
        axios.delete(`/tasks/${taskId}`)
            .then(response => {
                console.log(`Tarea ${taskId} eliminada con éxito:`, response.data);
                setUpdatedTask(!updatedTask);
            })
            .catch(error => {
                console.error(`Error al eliminar la tarea ${taskId}:`, error);
            });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className='container' style={{ position: 'relative' }}>
                <Typography variant="h4" gutterBottom>
                    Lista de tareas
                </Typography>
                {tasks.length === 0 ? (
                    <Typography variant="body1">No hay tareas disponibles.</Typography>
                ) : (
                    <div>
                        <Typography variant="h6" gutterBottom>
                            Pendientes
                        </Typography>
                        <div className="task-list-container">
                            <List className='mt-3'>
                                {pendingTasks.map(task => (
                                    <Box key={task.id} p={2} boxShadow={3} mb={2} bgcolor={`${task.categoryColor}`}>
                                        <ListItem>
                                            <Checkbox
                                                checked={selectedTaskIds.has(task.id)}
                                                onChange={() => handleTaskCheckboxToggle(task.id)}
                                            />
                                            <ListItemText
                                                primary={task.title}
                                                secondary={task.description}
                                            />
                                            <Button
                                                variant="contained"
                                                style={{ backgroundColor: '#c62828', color: 'white' }}
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </ListItem>
                                    </Box>
                                ))}
                            </List>
                        </div>
                        <Typography variant="h6" gutterBottom>
                            Terminadas
                        </Typography>
                        <div className="task-list-container">
                            <List className='mt-3'>
                                {completedTasks.map(task => (
                                    <Box key={task.id} p={2} boxShadow={3} mb={2} bgcolor={`${task.categoryColor}`}>
                                        <ListItem>
                                            <Checkbox
                                                checked={selectedTaskIds.has(task.id)}
                                                onChange={() => handleTaskCheckboxToggle(task.id)}
                                            />
                                            <ListItemText
                                                primary={task.title}
                                                secondary={task.description}
                                            />
                                            <Button
                                                variant="contained"
                                                style={{ backgroundColor: '#c62828', color: 'white' }}
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </ListItem>
                                    </Box>
                                ))}
                            </List>
                        </div>
                    </div>
                )}
                <Button
                    variant="contained"
                    style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                    onClick={handleCompleteSelectedTasks}
                    disabled={selectedTaskIds.size === 0}
                >
                    Completar seleccionadas
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ backgroundColor: '#c62828', color: 'white' }}
                    onClick={handleDeleteSelectedTasks}
                    disabled={selectedTaskIds.size === 0}
                >
                    Eliminar seleccionadas
                </Button>
                <Button
                    className="floating-button"
                    variant="contained"
                    color="primary"
                    style={{ 'borderRadius': '50%', 'width': '2%', 'padding': '20px' }}
                    onClick={handleDialogOpen}
                >
                    <AddIcon />
                </Button>
                <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Nueva Tarea</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Título"
                            name="title"
                            value={newTask.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            inputProps={{ maxLength: 40 }}
                            error={!!titleError}
                            helperText={titleError}
                            variant="standard"
                        />
                        <TextField
                            label="Descripción"
                            name="description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            inputProps={{ maxLength: 100 }}
                            variant="standard"
                        />
                        <TextField
                            label="Categoría"
                            name="categoryId"
                            value={newTask.categoryId}
                            onChange={handleInputChange}
                            select
                            fullWidth
                            margin="normal"
                            required
                            error={!!categoryError}
                            helperText={categoryError}
                            variant="standard"
                        >
                            {categoryOptions.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} variant="outlined">
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateTask} variant="contained">
                            Crear
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default TodoList;
