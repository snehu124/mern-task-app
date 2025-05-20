import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './register.jsx';
import Login from './login.jsx';
import TaskList from './taskList.jsx';
import TaskForm from './taskForm.jsx';
import TaskDetails from './taskDetails.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<TaskForm />} />
        <Route path="/tasks/edit/:id" element={<TaskForm />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

// Call createRoot only once
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);