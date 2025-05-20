import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './register.jsx';
import Login from './login.jsx';
import TaskList from './taskList.jsx';
import TaskForm from './taskForm.jsx';
import TaskDetails from './taskDetails.jsx';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
}

export default App;