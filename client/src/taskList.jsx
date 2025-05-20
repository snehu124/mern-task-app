import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/tasks?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data.result.tasks);
        setTotalPages(response.data.result.totalPages);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchTasks();
  }, [page, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasks.filter(task => task._id !== id));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map(task => (task._id === id ? response.data.result : task)));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const priorityStyles = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl min-h-screen">
      <div className="form mb-6 max-w-full" style={{ position: 'static', transform: 'none' }}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Task List</h1>
          <div className="flex gap-3">
            <Link to="/tasks/new" className="form-button">
              Create Task
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="form-button red"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {error && <p className="error-message mb-6 text-center font-medium">{error}</p>}
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task._id} className={`task-card ${priorityStyles[task.priority]}`}>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>
              <p className="text-gray-700 mb-1">
                <strong className="text-gray-900">Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-3">
                <strong className="text-gray-900">Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {task.status}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to={`/tasks/${task._id}`} className="action-link text-blue-600 hover:text-blue-800">
                  View
                </Link>
                <Link to={`/tasks/edit/${task._id}`} className="action-link text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
                <button onClick={() => handleDelete(task._id)} className="action-link text-red-600 hover:text-red-800">
                  Delete
                </button>
                <button
                  onClick={() => handleStatusUpdate(task._id, task.status === 'pending' ? 'completed' : 'pending')}
                  className={`action-link ${task.status === 'pending' ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'}`}
                >
                  {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pagination mt-8 flex justify-center gap-3">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="py-2 text-gray-700">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;