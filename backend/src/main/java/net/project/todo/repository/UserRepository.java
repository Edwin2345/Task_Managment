package net.project.todo.repository;

import net.project.todo.entity.Role;
import net.project.todo.entity.User;
import net.project.todo.projection.UserSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value="SELECT u.id, u.username FROM users AS u INNER JOIN users_roles AS ur ON u.id = ur.user_id INNER JOIN roles AS r ON ur.role_id = r.id WHERE r.name = 'ROLE_USER'",
            nativeQuery=true)
    List<UserSummary> findAllRegularUsers();

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);
}
