import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import supabase from "../client";
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
    }
  });

  // 🟢 Fetch todos
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Log the fetched todos to console for debugging
  console.log("Fetched todos:", todos);

  // 🔁 Modal toggle
  const toggleNewTodoModal = () => {
    if (!modalRef.current) return;
    modalRef.current.open ? modalRef.current.close() : modalRef.current.showModal();
  };

  // 📝 Form submission
  const onSubmit = async (data) => {
    createNewTodo(data);
    reset();
    toggleNewTodoModal();
  };

  // ✅ Todo list UI
  const TodoItemList = () => {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading todos.</p>;
    if (!todos || todos.length === 0) return <p>No todos found.</p>;

    return (
      <>
        {todos.map(todo => (
          <div key={todo.id} className="card my-2 p-4 bg-base-100 shadow-md">
            <h4 className="text-xl font-semibold">{todo.title}</h4>
            <p>{todo.description}</p>
          </div>
        ))}
      </>
    );
  };

  // ✅ Modal UI
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
            <button type="submit" className="btn btn-primary">Create</button>
            <button type="button" onClick={toggleNewTodoModal} className="btn">Cancel</button>
          </div>
        </form>
      </div>
    </dialog>
  );

  // ✅ Button UI
  const NewTodoButton = () => (
    <button className="btn btn-primary mb-4" onClick={toggleNewTodoModal}>
      New Todo
    </button>
  );

  // ✅ Final layout with header
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <NewTodoButton />
      <TodoItemList />
      <TodoModal />
    </main>
  );
}
