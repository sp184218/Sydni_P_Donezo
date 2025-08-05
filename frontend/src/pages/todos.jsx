import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAxiosClient from "../axios-instance";

export default function Todos() {
  const queryClient = useQueryClient();
  const modalRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  // 🟢 Create new todo mutation
  const { mutate: createNewTodo } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      toast.success("Todo created!");
    },
    onError: () => {
      toast.error("Failed to create todo.");
    },
  });

  // 🟢 Mark as completed mutation
  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
   mutationFn: async ({ id, completed }) => {
  const axiosInstance = await getAxiosClient();
  const { data } = await axiosInstance.put(`http://localhost:8080/todos/${id}/completed`, {
    completed: !completed, // toggle the current state
  });
  return data;
},
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      toast.success("Todo status updated!");
    },
    onError: () => {
      toast.error("Failed to update todo.");
    },
  });

  // 🟢 Delete todo mutation
  const { mutate: deleteTodo } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async (todoId) => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.delete(`http://localhost:8080/todos/${todoId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      toast.success("Todo deleted!");
    },
    onError: () => {
      toast.error("Failed to delete todo.");
    },
  });

  // 🟢 Fetch todos for logged-in user
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.get("http://localhost:8080/todos");
      return data;
    },
  });

  const todos = data?.todos || [];

  const toggleNewTodoModal = () => {
    if (!modalRef.current) return;
    modalRef.current.open ? modalRef.current.close() : modalRef.current.showModal();
  };

  const onSubmit = async (formData) => {
    const newTodo = {
      title: formData.title,
      description: formData.description,
    };
    createNewTodo(newTodo);
    reset();
    toggleNewTodoModal();
  };

  const TodoItemList = () => {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading todos.</p>;
    if (todos.length === 0) return <p>No todos found.</p>;

    return (
      <>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="card my-2 p-4 bg-base-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-90"
          >
            <div>
              <h4 className="text-xl font-semibold">{todo.title}</h4>
              <p>{todo.description}</p>
            </div>

            <div className="flex gap-4 items-center self-end sm:self-auto">
              {/* Toggle completion */}
              <label className="swap swap-rotate cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => markAsCompleted({ id: todo.id, completed: todo.completed })}

                />
                <div className="swap-on">✅</div>
                <div className="swap-off">⬜</div>
              </label>

              {/* Delete button */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this todo?")) {
                    deleteTodo(todo.id);
                  }
                }}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </>
    );
  };

  const TodoModal = () => (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">New Todo</h3>
          <input
            {...register("title", { required: true })}
            placeholder="Title"
            className="input input-bordered w-full my-2"
          />
          <textarea
            {...register("description")}
            placeholder="Description"
            className="textarea textarea-bordered w-full my-2"
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Create
            </button>
            <button type="button" onClick={toggleNewTodoModal} className="btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );

  const NewTodoButton = () => (
    <button className="btn btn-primary mb-4" onClick={toggleNewTodoModal}>
      New Todo
    </button>
  );

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <NewTodoButton />
      <TodoItemList />
      <TodoModal />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </main>
  );
}

