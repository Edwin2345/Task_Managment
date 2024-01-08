import { useEffect, useState } from "react";
import { Todo } from "../../models/Todo";
import { completeTodoById, getAllTodosByUser, uncompleteTodoById} from "../../services/TodoServices";
import { getLoggedInUser } from "../../services/AuthServices";


function UserTodoList() {

    const [ todos, setTodos] =  useState<Todo[]>([])
    const usernameOrEmail = getLoggedInUser();

    async function  fetchAllTodosByUser() {
        try{
          const resp  = await getAllTodosByUser( usernameOrEmail );
          console.log(resp);
          setTodos(resp!.data);
        }
        catch(e){
         console.log(e);
        }
    }

    useEffect(()=>{
      fetchAllTodosByUser();
    },[])


    return ( 
    <div className="d-flex justify-content-center">
      <div style={{width: "80%"}}>
         <h1 className="text-center mb-4 fw-bold">My Tasks</h1>
         <table className="table table-striped table-bordered">
            <thead>
               <tr className="fs-4">
                <th>Task Title</th>
                <th>Task Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-center">Completed</th>
                <th className="text-center">Actions</th> 
               </tr>
             </thead>
             <tbody>
               {todos.map((todo) =>{
                 return (
                  <tr key={todo.id} className="fs-5">
                    <td>{todo.title}</td>
                    <td>{todo.description}</td>
                    <td>{todo.startDate}</td>
                    <td>{todo.endDate}</td>
                    <td className="text-center">{(todo.completed) ? <span className="text-success fw-bold">YES</span> : <span className="text-danger fw-bold">NO</span>}</td>
                    <td className="text-center"> 
                      <>
                       <button className="btn btn-info mx-2 fw-bold" onClick={async()=>{await completeTodoById(todo.id!); await fetchAllTodosByUser();}}>Complete</button>
                       <button className="btn btn-warning mx-2 fw-bold" onClick={async()=>{await uncompleteTodoById(todo.id!);  await fetchAllTodosByUser();}}>Incomplete</button>
                      </>
                    </td>
                  </tr>
                 )
                })}

             </tbody>
         </table>
     </div>
</div>
    );
}

export default UserTodoList;