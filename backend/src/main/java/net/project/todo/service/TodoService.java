package net.project.todo.service;

import net.project.todo.dto.TodoDto;
import net.project.todo.projection.TodoSummary;

import java.util.List;

public interface TodoService {
    //Create Todo
    TodoDto createTodo(TodoDto newTodoDto);

    //Get All todos summarys for table
    public List<TodoSummary> getAllTodoSummarys();

    //Get All todos by username
    public List<TodoDto> getAllTodosForUser(String usernameOrEmail);

    //Get Todo by id
    TodoDto getTodoById(Long id);

    //Update todo by id
    TodoDto updateTodoById(TodoDto updatedTodo, Long id);

    //Delete todo by id
    void deleteTodoById(Long id);

    //Set todo as complete
    TodoDto setTodoAsComplete(Long id);

    //Set todo as incomplete
    TodoDto setTodoAsIncomplete(Long id);
}
