import React from "react"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import HeaderComponent from "./components/utils/HeaderComponent"
import FooterComponent from "./components/utils/FooterComponent"
import TodoList from "./components/todos/TodoList"
import AddTodoForm from "./components/todos/AddTodoForm"
import UpdateTodoForm from "./components/todos/UpdateTodoForm"
import RegisterComponent from "./components/utils/RegisterComponent"
import LoginComponent from "./components/utils/LoginComponent"
import { isAdminUser, isUserLoggedIn, isRegUser } from "./services/AuthServices"
import UserTodoList from "./components/todos/UserTodoList"



function App(): JSX.Element {

  type Props = {children?: React.ReactNode};

  function AuthenticatedRoute({children}: Props){
      if(isUserLoggedIn()){
       return children
      }
      return <Navigate to="/login"/>
  }
 
  function AdminRoute({children}: Props){
      if(isUserLoggedIn() && isAdminUser()){
       return children
      }
      return <Navigate to="/login"/>
  }


   function UserRoute({children}: Props){
      if(isUserLoggedIn() && isRegUser()){
       return children
      }
      return <Navigate to="/login"/>
  }
 
  return (
    <>
      <BrowserRouter>
        <HeaderComponent/>
          <Routes>
             <Route path="/" element={(isUserLoggedIn()) ?  <TodoList/> : <LoginComponent/>} />
             <Route path="/register" element={<RegisterComponent/>} />
             <Route path="/login" element={<LoginComponent/>} />
             <Route path="/todos" element={<AuthenticatedRoute><TodoList/></AuthenticatedRoute>} />
             <Route path="/my-todos" element={<UserRoute><UserTodoList/></UserRoute>} /> 
             <Route path="/add-todo" element={<AdminRoute><AddTodoForm/></AdminRoute>} />
             <Route path="/update-todo/:id" element={<AdminRoute><UpdateTodoForm/></AdminRoute>} />
          </Routes>
        <FooterComponent/>
      </BrowserRouter>
    </>
  )
}

export default App
