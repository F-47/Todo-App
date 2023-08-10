"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BsSun, BsMoon } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { z } from "zod";

const modeOptions = [
  { value: "All" },
  { value: "Active" },
  { value: "Completed" },
] as const;

type Mode = (typeof modeOptions)[number]["value"];

const todoSchema = z.object({
  text: z.string().nonempty(),
});

type TodoForm = z.infer<typeof todoSchema>;

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const { register, handleSubmit, reset } = useForm<TodoForm>({
    resolver: zodResolver(todoSchema),
  });
  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [mode, setMode] = useState<Mode>("All");
  const [todos, setTodos] = useState<Todo[]>([]);

  const DragItem = useRef<number | null>(null);
  const DragOverItem = useRef<number | null>(null);
  const handleSortByDrag = () => {
    if (DragItem.current && DragOverItem.current) {
      const dragItemIndex = todos.findIndex(
        (todo) => todo.id === DragItem.current
      );
      const dragOverItemIndex = todos.findIndex(
        (todo) => todo.id === DragOverItem.current
      );
      const newTodos = [...todos];
      newTodos.splice(dragItemIndex, 1);
      newTodos.splice(dragOverItemIndex, 0, todos[dragItemIndex]);
      setTodos(newTodos);
    }
  };

  const handleClick = (id: number) => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleDelete = (id: number) => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.filter((todo) => todo.id !== id);
      return newTodos;
    });
  };

  const handleClearCompleted = () => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.filter((todo) => !todo.completed);
      return newTodos;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const onsubmit = (data: TodoForm) => {
    const todoExists = todos?.some((todo) => {
      return todo?.text?.toLowerCase() === data?.text?.toLowerCase();
    });
    if (todoExists) {
      toast.error("Todo already exists");
    }
    if (!todoExists) {
      const newTodo = { id: Date.now(), text: data.text, completed: false };
      setTodos((prev) => [...prev, newTodo]);
    }
    reset();
  };

  const myTodos = {
    All: todos,
    Active: todos.filter((todo) => !todo.completed),
    Completed: todos.filter((todo) => todo.completed),
  }[mode];

  useEffect(() => {
    const data = localStorage.getItem("todos");
    if (data) {
      setTodos(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const activeTodosLength = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="relative h-screen flex justify-center p-5">
      <div className="content w-[500px] mt-32">
        <div className="text flex justify-between items-center mb-10 text-white">
          <h1 className="text-4xl font-bold tracking-widest ">TODO</h1>
          <div
            className="mode cursor-pointer"
            onClick={() =>
              theme == "dark" ? setTheme("light") : setTheme("dark")
            }
          >
            {currentTheme === "light" ? (
              <BsMoon size={30} />
            ) : (
              <BsSun size={30} />
            )}
          </div>
        </div>
        <form className="mb-10" onSubmit={handleSubmit(onsubmit)}>
          <input
            type="text"
            className="dark:-bg--clr-DarkTheme-VeryDarkDesaturatedBlue w-full p-5 shadow-lg focus:border-none focus:outline-none rounded-md"
            placeholder="Create a new todo..."
            autoComplete="off"
            {...register("text")}
          />
        </form>
        <div className="results shadow-lg bg-white dark:-bg--clr-DarkTheme-VeryDarkDesaturatedBlue">
          {myTodos.map((todo) => {
            return (
              <label
                htmlFor={`todo${todo.id}`}
                draggable="true"
                onDragStart={() => (DragItem.current = todo.id)}
                onDragEnter={() => (DragOverItem.current = todo.id)}
                onDragEnd={handleSortByDrag}
                className="relative cursor-pointer group text capitalize w-full flex items-center gap-5 py-5 px-8 border-b dark:-border--clr-DarkTheme-VeryDarkGrayishBlue focus:border-none focus:outline-none "
                key={todo.id}
              >
                <input
                  type="checkbox"
                  name={todo.text}
                  id={`todo${todo.id}`}
                  value={todo.text}
                  defaultChecked={todo.completed}
                  className="todoCheckBox peer linearGradientCustom"
                  onClick={() => handleClick(todo?.id)}
                />
                <span className="circle group-hover:ring-[#d582ee] peer-checked:linearGradientCustom ring-1 peer-checked:ring-0 -ring--clr-LightTheme-LightGrayishBlue dark:-ring--clr-DarkTheme-DarkGrayishBlue/30" />
                <div className="text -text--clr-LightTheme-VeryDarkGrayishBlue dark:-text--clr-DarkTheme-LightGrayishBlue peer-checked:line-through peer-checked:-text--clr-LightTheme-DarkGrayishBlue dark:peer-checked:-text--clr-LightTheme-DarkGrayishBlue">
                  {todo.text}
                </div>
                <RxCross2
                  className="absolute right-5 top-1/2 -translate-y-1/2 hidden group-hover:block"
                  onClick={() => handleDelete(todo.id)}
                />
              </label>
            );
          })}
          {todos.length > 0 && (
            <div className="w-full flex items-center justify-between text-xs gap-5 p-5 dark:-text--clr-DarkTheme-VeryDarkGrayishBlue">
              <div>{activeTodosLength} items left</div>
              <ul className="hidden md:flex items-center gap-4 ">
                {modeOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`cursor-pointer ${
                      mode === option.value
                        ? "text-blue-500 font-bold"
                        : "hover:font-bold hover:text-black dark:hover:text-white"
                    }`}
                    onClick={() => setMode(option.value)}
                  >
                    {option.value}
                  </li>
                ))}
              </ul>
              <div
                onClick={handleClearCompleted}
                className="hover:text-black dark:hover:text-white cursor-pointer"
              >
                Clear Completed
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center md:hidden mt-8 py-5 px-8 rounded-md shadow-lg bg-white dark:-bg--clr-DarkTheme-VeryDarkDesaturatedBlue">
          <ul className="flex justify-center items-center gap-4">
            {modeOptions.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer text-xs ${
                  mode === option.value
                    ? "text-blue-500 font-bold"
                    : "hover:font-bold hover:text-black dark:hover:text-white"
                }`}
                onClick={() => setMode(option.value)}
              >
                {option.value}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center mt-7 text-sm -text--clr-LightTheme-DarkGrayishBlue dark:-text--clr-DarkTheme-VeryDarkGrayishBlue">
          Drag and drop to reorder list
        </div>
      </div>

      <Image
        src={`/images/${
          currentTheme === "light" ? "bg-desktop-light" : "bg-desktop-dark"
        }.jpg`}
        className="w-full h-2/5 object-cover absolute top-0 left-0 -z-10 select-none"
        width={1440}
        height={300}
        alt="TopImage"
      />
      <div
        className={`h-3/5 w-full bg-white dark:bg-[#181824] absolute bottom-0 left-0 -z-10 transition-colors duration-300`}
      />
    </main>
  );
}
