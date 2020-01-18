var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "12345678",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all company departments",
                "View all company roles",
                "View all Employees by Department",
                "Add employee",
                "Remove employee",
                "Update employee role",
                "Update employee manager"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "View all company departments":
                    viewDepartments();
                    break;

                case "View all company roles":
                    viewRoles();
                    break;

                case "View all Employees by Department":
                    viewEmployeeByDepartment();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Remove employee":
                    removeEmployee();
                    break;

                case "Update employee role":
                    updateRole();
                    break;

                case "Update employee manager":
                    updateManager();
                    break;
            }
        });
}

function viewEmployees() {
    var select = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id From role INNER JOIN department ON (department.id = role.department_id) INNER JOIN employee ON (employee.role_id = role.id)"
    connection.query(select, function (err, res) {

        console.table(res);


        start();
    });

}

function viewDepartments() {

    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewRoles() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addEmployee() {
    var select = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, role_id From role INNER JOIN department ON (department.id = role.department_id) INNER JOIN employee ON (employee.role_id = role.id)"
    connection.query(select, function (err, results) {
        if (err) throw err;
        // prompt for info about the item being put up for auction
        inquirer
            .prompt([
                {
                    name: "first",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "last",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push({ value: results[i].role_title, name: results[i].role_id });
                        }
                        return choiceArray;
                    },
                    message: "What is the employee's role?"
                },
                {
                    name: "manager",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        // var name = results.first_name.concat(" ", results.last_name)
                        for (var i = 0; i < results.length; i++) {

                            choiceArray.push(results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Who is the employee's manager?",

                }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.role,
                        manager_id: answer.manager
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Employee was added successfully!");
                        // re-prompt the user for if they want to bid or post
                        start();
                    }
                );
            });
    }
    )
};

function removeEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;

        // prompt for info about the item being put up for auction
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to remove?"
                }
            ])
            .then(function (answer) {

            })
    })
}

function updateRole() {

}

function updateManager() {

}

function viewEmployeeByDepartment() {
    var select = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, department_id From role INNER JOIN department ON (department.id = role.department_id) INNER JOIN employee ON (employee.role_id = role.id) WHERE department.id = 1"
    connection.query(select, function (err, results) {
        if (err) throw err;

        console.log("success")

        inquirer
            .prompt([
                {
                name: "department",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].department_id);
                    }
                    return choiceArray;
                },
                message: "Which department would you like to see?"
                
            }
            
        ]).then(function (answer) {
                var select = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, department_id From role INNER JOIN department ON (department.id = role.department_id) INNER JOIN employee ON (employee.role_id = role.id) WHERE department.id = 1"
                // when finished prompting, insert a new item into the db with that info
                connection.query(select, function (err, results) {
                    console.table(results);
                })

            })
        console.table(results);
        start();
    });

}

