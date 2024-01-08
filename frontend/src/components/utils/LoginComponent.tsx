import React, { useState } from 'react'
import { Login } from '../../models/Login';
import { loginUser } from '../../services/AuthServices';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';


function LoginComponent() {

  const navigate = useNavigate();

  const [login, setLogin] = useState<Login>({
    usernameOrEmail: "",
    password: ""
  })

  const [isPassword, setIsPassword] = useState(true);
  const inputType = (isPassword) ? "password" : "text";

  const [errMsg, setErrMsg] = useState<string>("");


  function changeHandler(e: React.ChangeEvent<HTMLInputElement>){
     setLogin((old)=>{
       return {...old, [e.target.name]: e.target.value};
     })
  }

  
  async function submitHandler(e: React.FormEvent){
     e.preventDefault();
     setErrMsg("");
     try{
       await loginUser(login);
       navigate("/todos");
     }
     catch(e){
        if(axios.isAxiosError(e)){
            //Invalid user or password
            if(e.response?.status === 401){
              setErrMsg("username/email or password is incorrect");
              setLogin({usernameOrEmail: "",password: ""});
            }
        }
     }
  }



    return (   <div className="container mt-5 d-flex flex-column">
         <div className="row mt-5">
           <div className="card col-md-6 offset-md-3 py-3 mt-5 border border-black">
               <h2 className="text-center">Login Form</h2>
               <div className="card-body">
                 <form onSubmit={submitHandler}>
                       <div className="form-group mb-3">
                          <label className="form-label" htmlFor="usernameOrEmail"><b>Username Or Email</b></label>
                          <input className="form-control border border-black" placeholder="Enter username or email" 
                            maxLength={255} name="usernameOrEmail" id="usernameOrEmail" type="text" required  onChange={changeHandler} value={login.usernameOrEmail}/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="form-label" htmlFor="password"><b>Password</b></label>
                          <input className="form-control inline border border-black mb-2" placeholder="Enter password" 
                            maxLength={255} name="password" id="password" type={inputType} required  onChange={changeHandler} value={login.password}/>
                           <a onClick={()=>{setIsPassword((old)=>!old)}} className="mt-2 mb-4">{(isPassword) ? "Show" : "Hide"} password</a>
                      </div>
                      <div className="text-danger mb-3">{errMsg}</div>
                      <button className="btn btn-success fw-bold mt-3">Login</button>
                      <div className='mt-2 text-center'>
                        No Account? <a href='/register' className=' text-black'><b>Register instead</b></a>
                      </div>
                    </form>
               </div>
           </div>
         </div>
      </div>
    );
}

export default LoginComponent;