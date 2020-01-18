USE employeeDB;

INSERT INTO department (id, name)
VALUES (1,"Sales"),(2,"Finance"),(3,"Engineering");

INSERT INTO role (id, title, salary, department_id)
VALUES (1,"Sales Lead", 80000, 1),
(2,"Sales Person", 50000, 1),
(3,"Lead Engineer", 150000, 3),
(4,"Accountant", 90000, 2),
(5,"Software Engineer", 110000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1,"Joe","Doe",1,Null),(2,"Jane","Spencer",2, 1);
