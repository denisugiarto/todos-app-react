import { useEffect, useState } from "react";
import TodoForm, { FormType, TodoFormInputs } from "./components/TodoForm";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

/**
 * @description
 * todos app
 * user can CRUD todos
 * where todos have name, description and completed
 * */

export type Todo = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
};
export type DialogType = {
  type: FormType;
  isOpen: boolean;
  data?: Todo;
};

const defaultTodos: Todo[] = [
  {
    id: "todo1",
    name: "Todo 1",
    description: "Todo 1 description",
    completed: false,
  },
  {
    id: "todo2",
    name: "Todo 2",
    description: "Todo 2 description",
    completed: true,
  },
];

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState<DialogType>({
    type: "create",
    isOpen: false,
    data: undefined,
  });
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("todos")) {
      localStorage.setItem("todos", JSON.stringify(defaultTodos));
    }
    setTodos(JSON.parse(localStorage.getItem("todos") || "[]"));
  }, []);

  function updateState(todos: Todo[]) {
    localStorage.setItem("todos", JSON.stringify([...todos]));
    setTodos([...todos]);
  }
  const deleteHandler = (id: string) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    updateState(filteredTodos);
  };

  const openDialogHandler = (type: "create" | "edit", id?: string) => {
    const todo = todos.find((todo) => todo.id === id);
    setIsDialogOpen({ type, isOpen: true, data: todo });
  };

  const createTodoHandler = (form: TodoFormInputs) => {
    const allTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    const newTodo = {
      ...form,
      id: crypto.randomUUID().slice(-12),
      completed: false,
    };
    updateState([...allTodos, newTodo]);
  };

  const updateTodoHandler = (form: TodoFormInputs) => {
    const allTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    const index = allTodos.findIndex(
      (todo: Todo) => todo.id === isDialogOpen?.data?.id
    );
    allTodos[index] = { ...allTodos[index], ...form };
    updateState([...allTodos]);
  };

  const submitHandler = (type: FormType, form: TodoFormInputs) => {
    if (type === "create") {
      createTodoHandler(form);
    } else {
      updateTodoHandler(form);
    }
    setIsDialogOpen((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen container">
      <h1 className="text-3xl font-bold mt-6">Todos App</h1>
      <Button onClick={() => openDialogHandler("create")} className="my-6">
        New Todo
      </Button>
      <h2>List</h2>
      <div className="grid grid-cols-1 gap-4">
        {todos.length === 0 && <p>No todos, Create a new todo</p>}
        {todos?.map((todo) => (
          <div
            key={todo.name}
            className="p-4 bg-slate-300 rounded flex justify-between"
          >
            <div>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
            </div>
            <div className="flex space-x-3 items-center">
              <Checkbox defaultChecked={todo.completed} />
              <Button onClick={() => openDialogHandler("edit", todo.id)}>
                Edit
              </Button>
              <Button onClick={() => deleteHandler(todo.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      {isDialogOpen.isOpen && (
        <TodoForm
          type={isDialogOpen.type}
          data={isDialogOpen.data}
          isDialogOpen={isDialogOpen.isOpen}
          setIsDialogOpen={setIsDialogOpen}
          submitHandler={(e) => submitHandler(isDialogOpen.type, e)}
        />
      )}
    </div>
  );
}

export default App;
