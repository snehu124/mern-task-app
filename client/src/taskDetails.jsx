import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data.result);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task');
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/tasks');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const priorityStyles = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form-container-formatting">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Task Details</h1>
        {error && (
          <p className="error-message mb-4 text-center font-medium">{error}</p>
        )}
        <div className={`task-card ${priorityStyles[task.priority]}`}>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">{task.title}</h2>
          <p className="text-gray-700 mb-2">
            <strong className="text-gray-900">Description:</strong> {task.description}
          </p>
          <p className="text-gray-700 mb-2">
            <strong className="text-gray-900">Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-2">
            <strong className="text-gray-900">Status: </strong>
            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {task.status}
            </span>
          </p>
          <p className="text-gray-700 mb-2">
            <strong className="text-gray-900">Priority: </strong>
            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${priorityStyles[task.priority].includes('high') ? 'bg-red-100 text-red-800' : priorityStyles[task.priority].includes('medium') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {task.priority}
            </span>
          </p>
          <p className="text-gray-700 mb-4">
            <strong className="text-gray-900">Created At:</strong> {new Date(task.createdAt).toLocaleString()}
          </p>
          <div className="edit-delete-buttons">
            <Link to={`/tasks/edit/${task._id}`} className="form-button blue">
              Edit
            </Link>
            <button onClick={handleDelete} className="form-button red forming">
              Delete
            </button>
          </div>

          <div className="back-button-container">
            <button onClick={() => navigate('/tasks')} className="form-button gray">
              Back to Tasks
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetails;