import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Todo } from "../../models/Todo";
import {  getTodoById, updateTodoById } from "../../services/TodoServices";
import { User } from "../../models/User";
import { getAllRegularUsers } from "../../services/AuthServices";

function UpdateTodoForm() {
   
    const {id} = useParams();
    const recievedId =  parseInt(id!);
    const navigate = useNavigate();

    const [regUsers,  setRegUsers] = useState<User[]>([])


    const [ updatedTodo, setUpdatedTodo] = useState<Todo>({
        title: "",
        description: "",
        assignedToId: 0,
        startDate: "",
        endDate: "",
        completed: false
    });

    
 
    async function fetchTodoAndUsersById() {
        try{
           //set default input forms
           const resp = await getTodoById(recievedId);
           // eslint-disable-next-line @typescript-eslint/no-unused-vars
           const {id, ...todoInfo} = resp!.data
           setUpdatedTodo(todoInfo);

           //get list of assignable suers
           const resp2 = await getAllRegularUsers()
           setRegUsers(resp2.data);
        }
        catch(e){
          console.log(e);
        }
    }

    useEffect(()=>{
     fetchTodoAndUsersById();
    },[])



    function changeHandler(e: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLSelectElement>){
       setUpdatedTodo((old)=>{
        if(e.target.name === "completed"){
           const isCompleted  =  ( parseInt(e.target.value) === 1);
           return {...old, [e.target.name]: isCompleted}
         }
         if(e.target.name === "assignedToId"){
             return {...old, [e.target.name]: parseInt(e.target.value)}
         }
         return {...old, [e.target.name]: e.target.value}
       })
    }


    async function submitHandler(e: React.FormEvent){
      e.preventDefault();
      try{
          console.log(updatedTodo);
          await updateTodoById(updatedTodo, recievedId);
          navigate("/todos")
      }
      catch(e){
       console.log(e);
      }
      
    }

    
return(
<div className="container">
         <div className="row">
           <div className="card col-md-6 offset-md-3 py-3 mt-3 border border-black">
               <h2 className="text-center">Update Task</h2>
               <div className="card-body">
                 <form onSubmit={submitHandler}>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="title"><b>Title</b></label>
                          <input className="form-control border border-black" placeholder="Enter task title" 
                            maxLength={255} name="title" id="title"type="text" required  onChange={changeHandler} value={updatedTodo.title}/>
                      </div>
                       <div className="form-group mb-3">
                          <label className="form-label" htmlFor="description"><b>Description</b></label>
                          <input className="form-control border border-black" placeholder="Enter task desc" 
                            maxLength={255} name="description" id="description" type="text" required  onChange={changeHandler} value={updatedTodo.description}/>
                      </div> 
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="startDate"><b>Start Date</b></label>
                          <input className="form-control border border-black" 
                            maxLength={255} name="startDate" id="startDate" type="date" required  onChange={changeHandler} value={updatedTodo.startDate}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="endDate"><b>End Date</b></label>
                          <input className="form-control border border-black" 
                            maxLength={255} name="endDate" id="endDate" type="date" required min={updatedTodo.startDate} onChange={changeHandler} value={updatedTodo.endDate}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="assignedToId"><b>Assigned User</b></label>
                          <select name="assignedToId" id="assignedToId" className="form-control border border-black" onChange={changeHandler}  value={updatedTodo.assignedToId}>
                              {regUsers.map((user)=>{
                                 return <option key={user.id} value={user.id}>{user.username}</option>
                               })}
                          </select>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="completed"><b>Completed</b></label>
                          <select name="completed" id="completed" className="form-control border border-black" onChange={changeHandler} 
                           value={(updatedTodo.completed) ? 1 : 0}>
                               <option value={0}>NO</option>
                               <option value={1}>YES</option>
                          </select>
                      </div>
                      <button className="btn btn-primary">Update</button>
                    </form>
               </div>
           </div>
         </div>
      </div>
    )
}

export default UpdateTodoForm;