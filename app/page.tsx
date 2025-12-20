"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";

import { z } from "zod";
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
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "@/lib/api";

import axios from "axios";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  status: z.nativeEnum(TaskStatus, {
    message: "You must select a valid status",
  }),
});

export default function Home() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: TaskStatus.PENDING,
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});

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

  const handleMarkAsDone = async (id: string) => {
    try {
      const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_DONE_URL;
      if (lambdaUrl) {
        await axios.post(lambdaUrl, { taskId: id, userId: user?.userId });
      } else {
        await api.patch(`/tasks/${id}/done`);
      }
      loadTasks();
    } catch (error) {
      console.error("Error marking as done", error);
      alert("Failed to mark as done");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleCreate = async () => {
    setErrors({}); // Clear previous errors
    const result = createTaskSchema.safeParse(newTask);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await api.post("/tasks", newTask);
      setNewTask({ title: "", description: "", status: TaskStatus.PENDING });
      loadTasks();
    } catch (error) {
      console.error("Error creating task", error);
      alert("Error creating task.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              label="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              fullWidth
            />
            {errors.title && (
              <Alert variant="outlined" severity="error">
                {errors.title}
              </Alert>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              label="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              fullWidth
            />
            {errors.description && (
              <Alert variant="outlined" severity="error">
                {errors.description}
              </Alert>
            )}
          </Box>
          <Box
            sx={{
              minWidth: 150,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    status: e.target.value as TaskStatus,
                  })
                }
              >
                <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
              </Select>
            </FormControl>
            {errors.status && (
              <Alert variant="outlined" severity="error">
                {errors.status}
              </Alert>
            )}
          </Box>
          <Button
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleCreate}
            sx={{ height: 56 }}
          >
            Add
          </Button>
        </Box>
      </Box>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {task._id}
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  {task.status === TaskStatus.DONE ? (
                    <span
                      style={{
                        color: "green",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Done
                    </span>
                  ) : task.status === TaskStatus.IN_PROGRESS ? (
                    "In Progress"
                  ) : (
                    "Pending"
                  )}
                </TableCell>
                <TableCell align="right">
                  {task.status !== TaskStatus.DONE && (
                    <IconButton
                      color="success"
                      onClick={() => handleMarkAsDone(task._id)}
                      sx={{ mr: 1 }}
                      title="Mark as Done"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(task._id)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
