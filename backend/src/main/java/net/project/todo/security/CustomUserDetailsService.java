package net.project.todo.security;

import lombok.AllArgsConstructor;
import net.project.todo.entity.User;
import net.project.todo.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;


    //Function to find userDetails based on username or password
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
       //Get user
        User foundUser = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow( () -> new UsernameNotFoundException("user not found by user or email"));


       //Get There roles
        Set<GrantedAuthority> authorities = foundUser.getRoles().stream()
                .map((roles) -> new SimpleGrantedAuthority(roles.getName()))
                .collect(Collectors.toSet());

       //Return details
        return new org.springframework.security.core.userdetails.User(
                usernameOrEmail,
                foundUser.getPassword(),
                authorities
        );
    }
}
