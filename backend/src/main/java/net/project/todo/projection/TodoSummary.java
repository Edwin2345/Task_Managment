package net.project.todo.projection;

public interface TodoSummary {
    Long getid();

    String gettitle();

    String getdescription();

    String getusername();

    String getstartDate();

    String getendDate();

    boolean getcompleted();

}
