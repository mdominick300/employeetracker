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
                "View departments",
                "View roles",
                "Add employee",
                "Add Role",
                "Add Department",
                // "Remove employee",
                "Update employee role"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "View departments":
                    viewDepartments();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                // case "Remove employee":
                //     removeEmployee();
                //     break;

                case "Update employee role":
                    updateRole();
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
    var select = "SELECT * From role"
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
                            choiceArray.push({ name: results[i].title, value: results[i].id });
                        }
                        return choiceArray;
                    },
                    message: "What is the employee's role?"
                },
                // {
                //     name: "manager",
                //     type: "list",
                //     choices: function () {
                //         var choiceArray = [];
                //         // var name = results.first_name.concat(" ", results.last_name)
                //         for (var i = 0; i < results.length; i++) {

                //             choiceArray.push({ name: results[i].last_name, value: results[i].manager_id});
                //         }
                //         return choiceArray;
                //     },
                //     message: "Who is the employee's manager?",

                // }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.role,
                        // manager_id: answer.manager
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
                            choiceArray.push(results[i].employee_id);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to remove?"
                }
            ])
            .then(function (answer) {
                connection.query("DELETE FROM employee WHERE choiceArray = employee_id", function (err, results) {

                })
            })
    })
}


function updateManager() {

}

function viewEmployeeByDepartment() {
    var select = "SELECT * FROM department"
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
                            choiceArray.push(results[i].id);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to see?"

                }

            ]).then(function (answer) {
                var select2 = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, department_id From role INNER JOIN department ON (department.id = role.department_id) INNER JOIN employee ON (employee.role_id = role.id) WHERE {highest_bid: answer.bid}"
                // when finished prompting, insert a new item into the db with that info
                connection.query(select2, function (err, results) {

                })
                console.table(results);
                start();
            })

    });

}

function addRole() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is this roles salary?"
                },
                {
                    name: "department",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push({ name: results[i].name, value: results[i].id });
                        }
                        return choiceArray;
                    },
                    message: "What department is this role in?"
                }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department

                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Role was added successfully!");
                        // re-prompt the user for if they want to bid or post
                        start();
                    }
                );
            });
    });
}

function addDepartment() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "name",
                    type: "input",
                    message: "What is the department name?"
                },

            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        name: answer.name,


                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Department was added successfully!");
                        // re-prompt the user for if they want to bid or post
                        start();
                    }
                );
            });
    });
}

function updateRole() {
    var names = [];
    var role = [];
    connection.query("SELECT * FROM employee", function (err, results) {

        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            names.push(results[i].last_name)
        }

        connection.query("SELECT * FROM role", function (err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                role.push({name: results[i].title, value: results[i].id})
            }
        })

       

        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    choices: names,
                    message: "What employee do you want to update?"
                },
                {
                    name: "role",
                    type: "list",
                    choices: role,
                    message: "What do you want the new role to be?"
                }

            ])

            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "UPDATE employee SET ? WHERE ?",[
                    {
                        role_id: answer.role,

                    },
                    {
                        last_name: answer.name
                    }],
                    function (err) {
                        if (err) throw err;
                        console.log("Role was been updated successfully!");
                        // re-prompt the user for if they want to bid or post
                        start();
                    }
                );
            });

    })
}
