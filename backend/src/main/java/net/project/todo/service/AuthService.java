package net.project.todo.service;

import net.project.todo.dto.*;
import net.project.todo.projection.UserSummary;

import java.util.List;

public interface AuthService {

    List<RoleDto> getAllRoles();

    List<UserSummary> getAllRegularUsers();

    String register(RegisterDto registerDto);

    JwtAuthResponse login(LoginDto loginDto);
}
