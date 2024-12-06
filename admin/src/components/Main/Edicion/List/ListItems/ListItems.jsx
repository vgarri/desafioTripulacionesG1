import React from "react";

const ListItems = ({ task, onDelete, onToggleDone, onEdit }) => {
  return (
    <li className={`task-item ${task.isDone ? "completed" : ""}`}>
      <h3>{task.title}</h3>
      <p>{task.desc}</p>
      <div className="actions">
        <button onClick={() => onToggleDone(task._id)}>
          {task.isDone ? "Deshacer" : "Tachar"}
        </button>
        <button onClick={() => onEdit(task._id)}>Editar</button>
        <button onClick={() => onDelete(task._id)}>Borrar</button>
      </div>
    </li>
  );
};

export default ListItems;
