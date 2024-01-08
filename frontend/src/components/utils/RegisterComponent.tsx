import React, { useEffect, useState } from 'react'
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { getAllRoles, registerUser} from '../../services/AuthServices';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function RegisterComponent() {

  const navigate = useNavigate();
   
  const [newUser, setNewUser] = useState<User>({
    name: "",
    username: "",
    email: "",
    password: "",
    roles: [2]
  })

  const [isPassword, setIsPassword] = useState(true);
  const inputType = (isPassword) ? "password" : "text"

  const [errMsg, setErrMsg] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);


  useEffect(()=>{
     async function fetchRoles(){
       try{
         const resp = await getAllRoles();
         setRoles(resp.data);
       }catch(e){
        console.log(e);
       }
     }
     fetchRoles()
  },[])


  function changeHandler(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> ){
     setNewUser((old)=>{
        if(e.target.name === "role"){
          return {...old, [e.target.name]: [parseInt(e.target.value)]};
        }
       return {...old, [e.target.name]: e.target.value};
     })
 }


 async function submitHandler(e: React.FormEvent){
      e.preventDefault();
      setErrMsg("");
      try{
         //Register user
         await registerUser(newUser);
         navigate("/todos")
      }
      catch(e){
        console.log(e);
        if(axios.isAxiosError(e)){
            //Duplicates
            if(e.response?.status === 400){
               setErrMsg(e.response.data.message);
               setNewUser({
                name: "",
                username: "",
                email: "",
                password: "",
                roles: [2]
              })
            }
        }
      }   
 }


 return (  
    <div className="container mt-3">
         <div className="row">
           <div className="card col-md-6 offset-md-3 py-3 mt-3 border border-black">
               <h2 className="text-center">Registration Form</h2>
               <div className="card-body">
                 <form onSubmit={submitHandler}>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="name"><b>Name</b></label>
                          <input className="form-control border border-black" placeholder="Enter name" 
                            maxLength={255} name="name" id="name"type="text" required  onChange={changeHandler} value={newUser.name}/>
                      </div>
                       <div className="form-group mb-3">
                          <label className="form-label" htmlFor="username"><b>Username</b></label>
                          <input className="form-control border border-black" placeholder="Enter username" 
                            maxLength={255} name="username" id="username" type="text" required  onChange={changeHandler} value={newUser.username}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="roles"><b>Role</b></label>
                          <select name="roles" id="roles" className="form-control border border-black" onChange={changeHandler} value={newUser.roles![0]}>
                               {roles.map( (role) => {
                                 return  <option key={role.id} value={role.id}>{role.name}</option>
                               })}
                          </select>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="email"><b>Email</b></label>
                          <input className="form-control border border-black" placeholder="Enter email" 
                            maxLength={255} name="email" id="email" type="email" required  onChange={changeHandler} value={newUser.email}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="password"><b>Password</b></label>
                          <input className="form-control inline border border-black mb-2" placeholder="Enter password" 
                            maxLength={255} name="password" id="password" type={inputType} required  onChange={changeHandler} value={newUser.password}/>
                           <a onClick={()=>{setIsPassword((old)=>!old)}} className="mt-2"> {(isPassword) ? "Show" : "Hide"} password</a>
                      </div>
                      <div className="text-danger mb-3">{errMsg}</div>
                      <button className="btn btn-warning fw-bold">Register</button>
                      <div className='mt-2 text-center'>
                          Already Registered? <a href='/login' className=' text-black'><b>Login instead</b></a>
                      </div>
                    </form>
               </div>
           </div>
         </div>
      </div>
  );
}

export default RegisterComponent;