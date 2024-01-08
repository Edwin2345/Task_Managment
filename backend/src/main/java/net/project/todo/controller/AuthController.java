package net.project.todo.controller;


import lombok.AllArgsConstructor;
import lombok.Getter;
import net.project.todo.dto.JwtAuthResponse;
import net.project.todo.dto.LoginDto;
import net.project.todo.dto.RegisterDto;
import net.project.todo.dto.RoleDto;
import net.project.todo.projection.UserSummary;
import net.project.todo.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthService authService;


    //Get Roles (to desplay on register form(
   @GetMapping("/roles")
   public ResponseEntity<List<RoleDto>> getAllRoles(){
       List<RoleDto> foundRoles = authService.getAllRoles();
       return ResponseEntity.ok(foundRoles);
   }


   //Get All Employees
    @GetMapping("/users")
    public ResponseEntity<List<UserSummary>> getAllRegularUsers(){
       List<UserSummary> foundUsers= authService.getAllRegularUsers();
       return ResponseEntity.ok(foundUsers);
    }


    //Register Rest Api
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto){
        String resp = authService.register(registerDto);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }


    //Login Api
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto){
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);
        return  new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
    }


}
