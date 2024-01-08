package net.project.todo.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( nullable = false)
    private String title;

    @Column( nullable = false)
    private String description;

    @Column( name="start_date", nullable = false)
    private String startDate;

    @Column( name="end_date", nullable = false)
    private String endDate;

    @Column( nullable = false)
    private boolean completed;

    @ManyToOne()
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

}
