import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function Todos() {
  const queryClient = useQueryClient();
  const modalRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  // Toggle modal visibility
  const toggleNewTodoModal = () => {
    if (!modalRef.current) return;
    if (modalRef.current.open) {
      modalRef.current.close();
    } else {
      modalRef.current.showModal();
    }
  };

  // Submit new todo (placeholder handler)
  const onSubmit = async (data) => {
    console.log("Todo submitted:", data);
    // You'll later use mutation here to send data to Supabase
    reset(); // reset form fields
    toggleNewTodoModal(); // close modal
  };

  // New Todo Button
  const NewTodoButton = () => (
    <button className="btn btn-primary" onClick={toggleNewTodoModal}>
      New Todo
    </button>
  );

  // Todo Modal
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
    <>
      <div className="p-4">
        <NewTodoButton />
        <TodoModal />
        {/* Todo list will go here later */}
      </div>
    </>
  );
}
