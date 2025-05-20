import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
    status: 'pending',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
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
          const fetchedTask = response.data.result;
          setTask({
            title: fetchedTask.title,
            description: fetchedTask.description,
            dueDate: new Date(fetchedTask.dueDate).toISOString().split('T')[0],
            priority: fetchedTask.priority,
            status: fetchedTask.status,
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch task');
          if (err.response?.status === 401) navigate('/login');
        }
      };
      fetchTask();
    }
  }, [id, navigate, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const taskData = {
        ...task,
        dueDate: new Date(task.dueDate).toISOString(),
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/tasks/${id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form-container-formatting">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isEditMode ? 'Edit Task' : 'Create Task'}
        </h1>
        {error && (
          <p className="error-message mb-4 text-center font-medium">{error}</p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="form-input w-full"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
              className="form-input w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="form-input w-full"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div> <br />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="form-button flex-1"
            >
              {isEditMode ? 'Update Task' : 'Create Task'}
            </button> &nbsp;
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="form-button gray flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;