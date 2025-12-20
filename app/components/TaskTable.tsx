import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Task, TaskStatus } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
  markingDoneId: string | null;
  onEdit: (task: Task) => void;
  onMarkAsDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskTable({
  tasks,
  markingDoneId,
  onEdit,
  onMarkAsDone,
  onDelete,
}: TaskTableProps) {
  return (
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
                <IconButton
                  color="primary"
                  onClick={() => onEdit(task)}
                  sx={{ mr: 1 }}
                  title="Edit"
                >
                  <EditIcon />
                </IconButton>
                {task.status !== TaskStatus.DONE &&
                  (markingDoneId === task._id ? (
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                  ) : (
                    <IconButton
                      color="success"
                      onClick={() => onMarkAsDone(task._id)}
                      sx={{ mr: 1 }}
                      title="Mark as Done"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  ))}
                <IconButton
                  color="error"
                  onClick={() => onDelete(task._id)}
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
  );
}
