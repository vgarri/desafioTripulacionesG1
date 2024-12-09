import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import List from "./List/List";
import data from "../../../data";

const Edicion = () => {
  const [tasks, setTasks] = useState(
    data.map((task) => ({
      ...task,
      desc: "Descripción predeterminada", 
      isDone: false,
      _id: uuidv4(),
    }))
  );

  const [newTask, setNewTask] = useState({ title: "", desc: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Añadir nueva tarea
  const handleAddTask = () => {
    if (!newTask.title || !newTask.desc) {
      console.log("Faltan datos en los campos"); 
      return;
    }
    console.log("Añadiendo tarea:", newTask); 
    setTasks([...tasks, { ...newTask, isDone: false, _id: uuidv4() }]);
    console.log("Estado de tareas actualizado:", [...tasks, { ...newTask, isDone: false, _id: uuidv4() }]); 
    setNewTask({ title: "", desc: "" });
  };

  // Borrar tarea por ID
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Marcar tarea como completada
  const handleToggleDone = (id) => {
    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, isDone: !task.isDone } : task
      )
    );
  };

  // Editar tarea existente
  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task._id === id);
    setNewTask({ title: taskToEdit.title, desc: taskToEdit.desc });
    setEditMode(true);
    setCurrentEditId(id);
  };

  // Guardar cambios al editar
  const handleSaveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task._id === currentEditId
          ? { ...task, title: newTask.title, desc: newTask.desc }
          : task
      )
    );
    setNewTask({ title: "", desc: "" });
    setEditMode(false);
    setCurrentEditId(null);
  };

  // Borrar todas las tareas
  const handleClearTasks = () => {
    setTasks([]);
  };

  // Restaurar tareas iniciales
  const handleResetTasks = () => {
    setTasks(
      data.map((task) => ({
        ...task,
        desc: "Descripción predeterminada",
        isDone: false,
        _id: uuidv4(),
      }))
    );
  };

  return (
    <div className="edicion">
      <h1>Gestión de Preguntas y Respuestas</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Pregunta"
          value={newTask.title}
          onChange={(e) => {
            console.log("Pregunta ingresada:", e.target.value); 
            setNewTask({ ...newTask, title: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Respuesta"
          value={newTask.desc}
          onChange={(e) => {
            console.log("Respuesta ingresada:", e.target.value); 
            setNewTask({ ...newTask, desc: e.target.value });
          }}
        />
        {editMode ? (
          <button onClick={handleSaveEdit}>Guardar</button>
        ) : (
          <button onClick={handleAddTask}>Añadir</button>
        )}
      </div>
      <div className="controls">
        <button onClick={handleClearTasks}>Clear</button>
        <button onClick={handleResetTasks}>Reset</button>
      </div>
      <List
        tasks={tasks}
        onDelete={handleDeleteTask}
        onToggleDone={handleToggleDone}
        onEdit={handleEditTask}
      />
    </div>
  );
};

export default Edicion;
