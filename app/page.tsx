"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "@/lib/api";
import { Task, TaskStatus } from "@/types/task";
import { validateTask } from "@/lib/validation";
import CreateTaskForm from "@/app/components/CreateTaskForm";
import EditTaskDialog from "@/app/components/EditTaskDialog";
import TaskTable from "@/app/components/TaskTable";

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

  const [editErrors, setEditErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});

  // Edit State
  const [editOpen, setEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Loading State for Mark as Done
  const [markingDoneId, setMarkingDoneId] = useState<string | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({ open: true, message, severity });
  };

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
    setMarkingDoneId(id);
    try {
      const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_DONE_URL;
      if (lambdaUrl) {
        await axios.post(lambdaUrl, { taskId: id, userId: user?.userId });
      } else {
        await api.patch(`/tasks/${id}/done`);
      }
      loadTasks();
      showNotification("Task marked as done successfully", "success");
    } catch (error) {
      console.error("Error marking as done", error);
      showNotification("Failed to mark as done", "error");
    } finally {
      setMarkingDoneId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
      showNotification("Task deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting task", error);
      showNotification("Failed to delete task", "error");
    }
  };

  const handleCreate = async () => {
    setErrors({}); // Clear previous errors
    const { isValid, errors: validationErrors } = validateTask(newTask);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post("/tasks", newTask);
      setNewTask({ title: "", description: "", status: TaskStatus.PENDING });
      loadTasks();
      showNotification("Task created successfully", "success");
    } catch (error) {
      console.error("Error creating task", error);
      showNotification("Error creating task", "error");
    }
  };

  // Edit Handlers
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditingTask(null);
  };

  const handleUpdate = async () => {
    if (!editingTask) return;

    setEditErrors({}); // Clear previous errors

    try {
      // Create a payload with only the fields we want to update.
      const { title, description, status } = editingTask;
      const payload = { title, description, status };

      const { isValid, errors: validationErrors } = validateTask(payload);

      if (!isValid) {
        setEditErrors(validationErrors);
        return;
      }

      await api.put(`/tasks/${editingTask._id}`, payload);
      handleCloseEdit();
      loadTasks();
      showNotification("Task updated successfully", "success");
    } catch (error) {
      console.error("Error updating task", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server response:", error.response.data);
        showNotification(
          `Failed to update task: ${
            error.response.data.message || error.message
          }`,
          "error"
        );
      } else {
        showNotification("Failed to update task", "error");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>

      <CreateTaskForm
        newTask={newTask}
        errors={errors}
        loading={loading}
        onChange={(field, value) => setNewTask({ ...newTask, [field]: value })}
        onSubmit={handleCreate}
      />

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      <TaskTable
        tasks={tasks}
        markingDoneId={markingDoneId}
        onEdit={handleEditClick}
        onMarkAsDone={handleMarkAsDone}
        onDelete={handleDelete}
      />

      <EditTaskDialog
        open={editOpen}
        task={editingTask}
        errors={editErrors}
        onClose={handleCloseEdit}
        onSave={handleUpdate}
        onChange={(field, value) =>
          setEditingTask((prev) => (prev ? { ...prev, [field]: value } : null))
        }
      />

      {/* Global Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
