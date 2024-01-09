package net.project.todo.service.impl;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import net.project.todo.dto.TodoDto;
import net.project.todo.entity.Todo;
import net.project.todo.entity.User;
import net.project.todo.exception.ResourceNotFoundException;
import net.project.todo.mapper.TodoMapper;
import net.project.todo.projection.TodoSummary;
import net.project.todo.repository.TodoRepository;
import net.project.todo.repository.UserRepository;
import net.project.todo.service.TodoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TodoServiceImpl implements TodoService {

    private TodoRepository todoRepository;
    private UserRepository userRepository;

    @Override
    public TodoDto createTodo(TodoDto newTodoDto) {
        // Set all properties except for assignedTo
        Todo newTodo = TodoMapper.mapToTodo(newTodoDto);

        //set assignedTo to found user and update set in found user
        User foundUser = userRepository.findById(newTodoDto.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User with following id not found: "+newTodoDto.getAssignedToId()));

        newTodo.setAssignedTo(foundUser);
        foundUser.getAssignedTodos().add(newTodo);

        Todo savedTodo =  todoRepository.save(newTodo);
        return TodoMapper.mapToTodoDto(savedTodo);
    }

    @Override
    public List<TodoSummary> getAllTodoSummarys() {
        return todoRepository.findAllTodoSummarys();
    }

    @Override
    public List<TodoDto> getAllTodosForUser(String usernameOrEmail) {
        User foundUser = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with following username/email not found: "+usernameOrEmail));

        List<TodoDto> foundTodos =  foundUser.getAssignedTodos().stream().map( (todo) -> TodoMapper.mapToTodoDto(todo) )
                .collect(Collectors.toList());

        Collections.sort( foundTodos, ((o1, o2) -> Math.toIntExact(o1.getId() - o2.getId())));
        
        return foundTodos;
    }

    @Override
    public TodoDto getTodoById(Long id) {
        Todo foundTodo =  todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("A todo with the following id doesn't exist: "+id));
        return TodoMapper.mapToTodoDto( foundTodo );
    }

    @Override
    public TodoDto updateTodoById(TodoDto updatedTodo, Long id) {
        Todo foundTodo =  todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("A todo with the following id doesn't exist: "+id));

        User foundUser = userRepository.findById(updatedTodo.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User with following id not found: "+updatedTodo.getAssignedToId()));

        //Remove old todo from user
        foundUser.getAssignedTodos().remove(foundTodo);

        //Update Found Todo
        foundTodo.setTitle( updatedTodo.getTitle() );
        foundTodo.setDescription( updatedTodo.getDescription() );
        foundTodo.setStartDate( updatedTodo.getStartDate() );
        foundTodo.setEndDate( updatedTodo.getEndDate() );
        foundTodo.setCompleted( updatedTodo.isCompleted() );
        foundTodo.setAssignedTo(foundUser);

        //Save updated todo and Add to User
        foundUser.getAssignedTodos().add(foundTodo);

        Todo savedTodo = todoRepository.save( foundTodo );
        return TodoMapper.mapToTodoDto( savedTodo );
    }

    @Override
    public void deleteTodoById(Long id) {
        Todo foundTodo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("A todo with the following id doesn't exist: "+id));

        //Delete todo from User
        User foundUser = foundTodo.getAssignedTo();
        foundUser.getAssignedTodos().remove(foundTodo);

        //Delete Todo
        todoRepository.deleteById(id);
    }

    @Override
    public TodoDto setTodoAsComplete(Long id) {
        Todo foundTodo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("A todo with the following id doesn't exist: "+id));

        foundTodo.setCompleted(Boolean.TRUE);

        Todo savedTodo = todoRepository.save( foundTodo );
        return TodoMapper.mapToTodoDto(savedTodo);
    }

    @Override
    public TodoDto setTodoAsIncomplete(Long id) {
        Todo foundTodo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("A todo with the following id doesn't exist: "+id));

        foundTodo.setCompleted(Boolean.FALSE);

        Todo savedTodo = todoRepository.save( foundTodo );
        return TodoMapper.mapToTodoDto(savedTodo);
    }


}
