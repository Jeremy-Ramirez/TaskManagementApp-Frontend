"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";

import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "@/lib/api";

import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  isDone: boolean;
}

export default function Home() {
  //const { user } = useAuthenticator();
  //console.log(user);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setnewTask] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField
          fullWidth
          label="New Task"
          value={newTask}
          onChange={(e) => setnewTask(e.target.value)}
        />
        <Button variant="contained" disabled={loading}>
          Add
        </Button>
      </div>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <>
                {!task.isDone && (
                  <IconButton edge="end" color="success">
                    <CheckCircleIcon />
                  </IconButton>
                )}
                <IconButton edge="end" color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={task.title}
              sx={{ textDecoration: task.isDone ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
