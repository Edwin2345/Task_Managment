package net.project.todo.service.impl;

import lombok.AllArgsConstructor;
import net.project.todo.dto.*;
import net.project.todo.entity.Role;
import net.project.todo.entity.User;
import net.project.todo.exception.ResourceNotFoundException;
import net.project.todo.exception.TodoApiException;
import net.project.todo.mapper.RoleMapper;
import net.project.todo.projection.UserSummary;
import net.project.todo.repository.RoleRepository;
import net.project.todo.repository.UserRepository;
import net.project.todo.security.JwtTokenProvider;
import net.project.todo.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private AuthenticationManager authenticationManager;

    @Override
    public List<RoleDto> getAllRoles() {
       List<Role> foundRoles =  roleRepository.findAll();
       return foundRoles.stream().map( (emp) -> RoleMapper.mapToRoleDto(emp))
               .collect(Collectors.toList());
    }


    @Override
    public List<UserSummary> getAllRegularUsers() {
        return userRepository.findAllRegularUsers();
    }

    @Override
    public String register(RegisterDto registerDto) {
        // check if username exists alreay
        if(userRepository.existsByUsername(registerDto.getUsername())){
            throw new TodoApiException(HttpStatus.BAD_REQUEST, "Username already exits");
        }

        //check if email already exists
        if(userRepository.existsByEmail(registerDto.getEmail())){
            throw new TodoApiException(HttpStatus.BAD_REQUEST, "Email already exits");
        }

        //Set Creditinals
        User newUser  = new User();
        newUser.setName(registerDto.getName());
        newUser.setUsername(registerDto.getUsername());
        newUser.setEmail(registerDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        //Set Roles
        Set<Role> roles = new HashSet<>();
        registerDto.getRoles().stream().forEach( (role_id) -> {
            Role foundRole =  roleRepository.findById(role_id)
                    .orElseThrow(()-> new ResourceNotFoundException("role not found"));
            roles.add( foundRole );
        });
        newUser.setRoles( roles );


        userRepository.save(newUser);
        return "User Registered Successfully";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);


        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();

        //Get token
        String token = jwtTokenProvider.generateToken(authentication);
        jwtAuthResponse.setAccessToken(token);

        //Get role
        Optional<User>  userOptional =  userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail());

        if(userOptional.isPresent()){
            User loggedInUser = userOptional.get();
            Optional<Role> roleOptional = loggedInUser.getRoles().stream().findFirst();

            if(roleOptional.isPresent()){
                jwtAuthResponse.setRole(roleOptional.get().getName());
            }
        }

        
        return jwtAuthResponse;
    }
}
