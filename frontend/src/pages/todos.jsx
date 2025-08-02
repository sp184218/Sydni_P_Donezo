import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import supabase from "../client"; // Make sure this path is correct

export default function Todos() {
  const queryClient = useQueryClient();
  const modalRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch Todos
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('todos').select('*').order('id', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Mutation for new todos
  const mutation = useMutation({
    mutationFn: async (newTodo) => {
      const { data, error } = await supabase.from('todos').insert([newTodo]);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  // Modal toggler
  const toggleNewTodoModal = () => {
    if (!modalRef.current) return;
    modalRef.current.open ? modalRef.current.close() : modalRef.current.showModal();
  };

  // Form submission
  const onSubmit = async (data) => {
    mutation.mutate(data);
    reset();
    toggleNewTodoModal();
  };

  const NewTodoButton = () => (
    <button className="btn btn-primary" onClick={toggleNewTodoModal}>
      New Todo
    </button>
  );

  const TodoModal = () => (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">New Todo</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Name of Todo</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
              {...register("name", { required: true })}
            />
          </label>
          <label className="form-control w-full mt-4">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
              {...register("description")}
            />
          </label>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Create Todo
            </button>
            <button type="button" className="btn btn-ghost" onClick={toggleNewTodoModal}>
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );

  return (
    <div className="p-4">
      <NewTodoButton />
      <TodoModal />
      <div className="mt-6">
        {isLoading && <p>Loading todos...</p>}
        {isError && <p>Failed to load todos.</p>}
        {todos?.length === 0 && <p>No todos found.</p>}
        {todos?.map((todo) => (
          <div key={todo.id} className="card bg-base-100 shadow-md p-4 my-2">
            <h2 className="font-bold">{todo.name}</h2>
            <p>{todo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
