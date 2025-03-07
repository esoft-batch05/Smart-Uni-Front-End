import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <Card sx={{ width: "100%", margin: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          To-Do List
        </Typography>
        <TextField
          fullWidth
          label="New Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <Button
          onClick={addTask}
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          fullWidth
        >
          Add Task
        </Button>
        {tasks.length > 0 ? (
          <List>
            {tasks.map((t, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeTask(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox
                  checked={t.completed}
                  onChange={() => toggleComplete(index)}
                />
                <ListItemText
                  primary={t.text}
                  sx={{ textDecoration: t.completed ? "line-through" : "none" }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No Tasks</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
