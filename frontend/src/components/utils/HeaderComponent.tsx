import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { getLoggedInUser, isAdminUser, isRegUser, isUserLoggedIn, logoutUser } from '../../services/AuthServices';
import { useNavigate } from 'react-router-dom';


function HeaderComponent() {

    const isLoggedin  =  isUserLoggedIn();
    const isAdmin  = isAdminUser();
    const isUser = isRegUser();
    const navigate = useNavigate();
    let usernameOrEmail;

    if(isLoggedin){
       usernameOrEmail = getLoggedInUser();
    }

    function logoutHandler(){
      logoutUser();
      navigate("/login");
    }


    return (  
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className='mb-5'>
      <Container>
        <Navbar.Brand href="/" className="fs-3">Task Managment System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Logged In */}
            {
               (isLoggedin) && (
                <>             
                 <Nav.Link href="/todos" className="fs-5">All Tasks</Nav.Link>
                  {isAdmin && (
                   <Nav.Link href="/add-todo" className="fs-5">Add Task</Nav.Link> 
                  )} 
                  {isUser && (
                   <Nav.Link href="/my-todos" className="fs-5">My Tasks</Nav.Link> 
                  )}  
                <NavDropdown title={`${usernameOrEmail} (${isAdmin ? "admin" : "user"})`} id="collapsible-nav-dropdown"  className="fs-5 fw-bold text-primary">
                  <NavDropdown.Item href="/" onClick={logoutHandler} className="fs-5">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                  
                </>
               )
            }
            {/* Not Logged In */}
            {
              (!isLoggedin) && (
               <>
                <Nav.Link href="/login"  className="fs-5">Login</Nav.Link>
                <Nav.Link href="/register"  className="fs-5">Register</Nav.Link>
               </>
              )  
            }
         </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}




export default HeaderComponent;