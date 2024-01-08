import axios from "axios";
import { Todo } from "../models/Todo";
import { getToken} from "./AuthServices";
import { Navigate } from "react-router-dom";


const RESP_API_BASE_URL = "http://localhost:8080/api/todos";

//Authorize eveyr request
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
});



//Create New todo
export async function createTodo(newTodo: Todo){
  try{
      return await axios.post(RESP_API_BASE_URL, newTodo);
  }
  catch(e){
    console.log(e)
  }   
}




//Get All Todos
export async function getAllTodos(){
    try{
      return await axios.get(RESP_API_BASE_URL);
    }
    catch(e){
      console.log(e)
    }
}


//Get All Assigned Todos
export async function getAllTodosByUser( usernameOrEmail: string){
    try{
      const url = `${RESP_API_BASE_URL}/user?u=${usernameOrEmail}`;
      return await axios.get(url);
    }
    catch(e){
      console.log(e)
    }
}




//Get Todo By Id
export async function getTodoById(id: number){
   try{
      return await axios.get(`${RESP_API_BASE_URL}/${id}`);
    }
    catch(e){
      console.log(e)
    }
}



//Update Todo By Id
export async function updateTodoById(updatedTodo: Todo, id: number){
    try{
      return await axios.put(`${RESP_API_BASE_URL}/${id}`, updatedTodo);
    }
    catch(e){
      console.log(e)
    }
}


//Delete Todo By Id
export async function deleteTodoById(id: number){
    try{
      return await axios.delete(`${RESP_API_BASE_URL}/${id}`);
    }
    catch(e){
      console.log(e)
    }
}



//Complete Todo By Id
export async function completeTodoById(id: number){
    try{
      return await axios.patch(`${RESP_API_BASE_URL}/${id}/complete`);
    }
    catch(e){
      return <Navigate to="/login"/>
    }
}


// Uncomplete Todo By Id
export async function uncompleteTodoById(id: number){
    try{
      return await axios.patch(`${RESP_API_BASE_URL}/${id}/incomplete`);
    }
    catch(e){
      console.log(e)
    }
}

