import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
} from "@mui/material";
import { TaskStatus } from "@/types/task";

interface CreateTaskFormProps {
  newTask: {
    title: string;
    description: string;
    status: TaskStatus;
  };
  errors: {
    title?: string;
    description?: string;
    status?: string;
  };
  loading: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export default function CreateTaskForm({
  newTask,
  errors,
  loading,
  onChange,
  onSubmit,
}: CreateTaskFormProps) {
  return (
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
            onChange={(e) => onChange("title", e.target.value)}
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
            onChange={(e) => onChange("description", e.target.value)}
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
              onChange={(e) => onChange("status", e.target.value as string)}
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
          onClick={onSubmit}
          sx={{ height: 56 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
