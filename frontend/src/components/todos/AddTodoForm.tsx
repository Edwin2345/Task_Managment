import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "../../models/Todo";
import { createTodo } from "../../services/TodoServices";
import { User } from "../../models/User";
import { getAllRegularUsers } from "../../services/AuthServices";

function AddTodoForm() {

    const navigate = useNavigate();


    const [ newTodo, setNewTodo] = useState<Todo>({
         title: "",
        description: "",
        assignedToId: 0,
        startDate: "",
        endDate: "",
        completed: false
    });

    const [regUsers,  setRegUsers] = useState<User[]>([]);


    async function fetchAllUsers() {
        try{
           const resp = await getAllRegularUsers()
           if(resp.data.length == 0){return;}
           setRegUsers(resp.data);
           setNewTodo( (old) => {
             return {...old, assignedToId: parseInt(resp.data[0].id)}
           })
        }
        catch(e){
          console.log(e);
        }
    }

    useEffect(()=>{
     fetchAllUsers();
    },[])


    function changeHandler(e: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLSelectElement>){
       setNewTodo((old)=>{
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
          console.log(newTodo);
          await createTodo(newTodo);
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
               <h2 className="text-center">Add Task</h2>
               <div className="card-body">
                 <form onSubmit={submitHandler}>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="title"><b>Title</b></label>
                          <input className="form-control border border-black" placeholder="Enter task title" 
                            maxLength={255} name="title" id="title"type="text" required  onChange={changeHandler} value={newTodo.title}/>
                      </div>
                       <div className="form-group mb-3">
                          <label className="form-label" htmlFor="description"><b>Description</b></label>
                          <input className="form-control border border-black" placeholder="Enter task desc" 
                            maxLength={255} name="description" id="description" type="text" required  onChange={changeHandler} value={newTodo.description}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="assignedToId"><b>Assigned User</b></label>
                          <select name="assignedToId" id="assignedToId" className="form-control border border-black"  required onChange={changeHandler}  value={newTodo.assignedToId}>
                              {regUsers.map((user)=>{
                                 return <option key={user.id} value={user.id}>{user.username}</option>
                               })}
                          </select>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="startDate"><b>Start Date</b></label>
                          <input className="form-control border border-black" 
                            maxLength={255} name="startDate" id="startDate" type="date" required  onChange={changeHandler} value={newTodo.startDate}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="endDate"><b>End Date</b></label>
                          <input className="form-control border border-black" 
                            maxLength={255} name="endDate" id="endDate" type="date" required min={newTodo.startDate} onChange={changeHandler} value={newTodo.endDate}/>
                      </div>
                      <div className="form-group mb-4">
                          <label className="form-label" htmlFor="completed"><b>Completed</b></label>
                          <select name="completed" id="completed" className="form-control border border-black" onChange={changeHandler}>
                               <option value={0}>NO</option>
                                <option value={1}>YES</option>
                          </select>
                      </div>
                      <button className="btn btn-success">Create</button>
                    </form>
               </div>
           </div>
         </div>
      </div>
    )
}

export default AddTodoForm;