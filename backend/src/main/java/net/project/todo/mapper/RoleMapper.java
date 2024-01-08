package net.project.todo.mapper;

import net.project.todo.dto.RoleDto;
import net.project.todo.entity.Role;

public class RoleMapper {
    public static RoleDto mapToRoleDto(Role role){
        return new RoleDto(
           role.getId(),
           role.getName()
        );
    }
}
