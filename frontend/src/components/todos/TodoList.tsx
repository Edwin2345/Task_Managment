import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "../../models/Todo";
import { deleteTodoById, getAllTodos} from "../../services/TodoServices";
import { isAdminUser } from "../../services/AuthServices";

function TodoList() {

    const navigate = useNavigate();
    const [ todos, setTodos] =  useState<Todo[]>([])
    const isAdmin = isAdminUser();

    async function  fetchAllTodos() {
        try{
          const resp  = await getAllTodos();
          setTodos(resp?.data);
        }
        catch(e){
         console.log(e);
        }
    }

    useEffect(()=>{
      fetchAllTodos();
    },[])


    return ( 
    <div className="d-flex justify-content-center">
      <div style={{width: "80%"}}>
         <h1 className="text-center mb-4 fw-bold">All Tasks</h1>
         { isAdmin && (
             <button onClick={() => navigate("/add-todo")} className="btn btn-primary mx-2 p-2 fw-bold mb-3">Add Todo</button>
           )
         }
         <table className="table table-striped table-bordered">
            <thead>
               <tr className="fs-4">
                <th>Task Title</th>
                <th>Task Description</th>
                <th>Assigned To</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-center">Completed</th>
                {isAdmin && <th className="text-center">Actions</th> }
               </tr>
             </thead>
             <tbody>
               {todos.map((todo) =>{
                 return (
                  <tr key={todo.id} className="fs-5">
                    <td>{todo.title}</td>
                    <td>{todo.description}</td>
                    <td>{todo.username}</td>
                    <td>{todo.startDate}</td>
                    <td>{todo.endDate}</td>
                    <td className="text-center">{(todo.completed) ? <span className="text-success fw-bold">YES</span> : <span className="text-danger fw-bold">NO</span>}</td>
                     { isAdmin && (
                     <td className="text-center"> 
                      <>
                      <button className="btn btn-success mx-2 fw-bold" onClick={()=>navigate(`/update-todo/${todo.id}`)}>Update</button>
                      <button className="btn btn-danger mx-2 fw-bold" onClick={async()=>{await deleteTodoById(todo.id!); fetchAllTodos();}}>Delete</button>
                      </>
                      </td>
                     )}
                  </tr>
                 )
                })}

             </tbody>
         </table>
     </div>
</div>
    );
}

export default TodoList;