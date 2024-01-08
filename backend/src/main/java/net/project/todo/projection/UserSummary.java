package net.project.todo.projection;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserSummary {

    Long getid();

    String getusername();

}
