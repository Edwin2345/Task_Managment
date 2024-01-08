package net.project.todo.mapper;

import net.project.todo.dto.TodoDto;
import net.project.todo.entity.Todo;

public class TodoMapper {

    public static TodoDto mapToTodoDto(Todo todo){
        return new TodoDto(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getAssignedTo().getId(),
                todo.getStartDate(),
                todo.getEndDate(),
                todo.isCompleted()
        );
    }

    public static Todo mapToTodo(TodoDto todoDto){
       Todo todo = new Todo();

       //Set All properties except for Assigned User (will find in services)
       todo.setId( todoDto.getId() );
       todo.setTitle( todoDto.getTitle() );
       todo.setDescription( todoDto.getDescription() );
       todo.setStartDate( todoDto.getStartDate() );
       todo.setEndDate( todoDto.getEndDate() );
       todo.setCompleted( todoDto.isCompleted()) ;

       return todo;
    }
}
