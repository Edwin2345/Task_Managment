package net.project.todo.repository;

import net.project.todo.entity.Todo;
import net.project.todo.projection.TodoSummary;
import net.project.todo.projection.UserSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    @Query(value="SELECT t.id, t.title, t.description, u.username, t.start_date AS startDate, t.end_date AS endDate, t.completed  FROM todos AS t INNER JOIN users AS u WHERE u.id = t.assigned_to_id;",
            nativeQuery=true)
    List<TodoSummary> findAllTodoSummarys();

}
