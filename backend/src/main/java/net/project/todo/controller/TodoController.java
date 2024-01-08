package net.project.todo.controller;

import lombok.AllArgsConstructor;
import net.project.todo.dto.TodoDto;
import net.project.todo.projection.TodoSummary;
import net.project.todo.service.TodoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/todos")
@AllArgsConstructor
public class TodoController {

    TodoService todoService;


    //Create Todo
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TodoDto> createTodo(@RequestBody TodoDto newTodo){
        TodoDto savedTodo = todoService.createTodo(newTodo);
        return new ResponseEntity<TodoDto>(savedTodo, HttpStatus.CREATED);
    }


    //Get All Todo Summaries
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<List<TodoSummary>> getAllTodos(){
        List<TodoSummary> allTodos = todoService.getAllTodoSummarys();
        return ResponseEntity.ok(allTodos);
    }

    //Get All Todos By username
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    public ResponseEntity<List<TodoDto>> getAllTodosByUser( @RequestParam String u){
        List<TodoDto> foundTodosForUser = todoService.getAllTodosForUser( u );
        return ResponseEntity.ok(foundTodosForUser);
    }


    //Get Todo By Id
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<TodoDto> getTodoById(@PathVariable("id") Long id){
        TodoDto foundTodo =  todoService.getTodoById(id);
        return ResponseEntity.ok(foundTodo);
    }


    //Update Todo By id
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> updateTodoById(@RequestBody TodoDto updatedTodo, @PathVariable("id") Long id){
        TodoDto updatedTodoDto = todoService.updateTodoById(updatedTodo, id);
        return ResponseEntity.ok( updatedTodoDto );
    }


    //Delete Todo By id
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodoById(@PathVariable("id") Long id){
       todoService.deleteTodoById(id);
        return ResponseEntity.ok("Todo with id "+id+" was deleted");
    }


    //Set todo as complete by id
    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TodoDto>  setTodoAsComplete(@PathVariable("id") Long id){
        TodoDto updatedTodo = todoService.setTodoAsComplete(id);
        return ResponseEntity.ok(updatedTodo );
    }

    //Set todo as incomplete by id
    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{id}/incomplete")
    public ResponseEntity<TodoDto>  setTodoAsIncomplete(@PathVariable("id") Long id){
        TodoDto updatedTodo = todoService.setTodoAsIncomplete(id);
        return ResponseEntity.ok(updatedTodo );
    }


}
