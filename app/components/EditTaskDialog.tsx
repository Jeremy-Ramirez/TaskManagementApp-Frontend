import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
} from "@mui/material";
import { Task, TaskStatus } from "@/types/task";

interface EditTaskDialogProps {
  open: boolean;
  task: Task | null;
  errors: {
    title?: string;
    description?: string;
    status?: string;
  };
  onClose: () => void;
  onSave: () => void;
  onChange: (field: string, value: string) => void;
}

export default function EditTaskDialog({
  open,
  task,
  errors,
  onClose,
  onSave,
  onChange,
}: EditTaskDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={task?.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            fullWidth
          />
          {errors.title && (
            <Alert variant="outlined" severity="error">
              {errors.title}
            </Alert>
          )}
          <TextField
            label="Description"
            value={task?.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          {errors.description && (
            <Alert variant="outlined" severity="error">
              {errors.description}
            </Alert>
          )}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={task?.status || TaskStatus.PENDING}
              label="Status"
              onChange={(e) => onChange("status", e.target.value as string)}
            >
              <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
