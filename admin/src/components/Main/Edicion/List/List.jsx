import React from "react";
import ListItems from "./ListItems/ListItems";

const List = ({ tasks, onDelete, onToggleDone, onEdit }) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <ListItems
          key={task._id}
          task={task}
          onDelete={onDelete}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default List;
