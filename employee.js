var mysql = require("mysql");
var inquirer = require("inquirer");

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
                "View all employees by department",
                "View all employees by manager",
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

                case "View all employees by department":
                    viewByDepartment();
                    break;

                case "View all employees by manager":
                    viewByManager();
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

    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log(res);
        start();
    });
}

function viewByDepartment() {

    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log(res);
        start();
    });
}

function viewByManager() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.log(res);
        start();
    });
}

function addEmployee() {
    connection.query("SELECT * FROM employee", function(err, results) {
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
          choices: ["Sale Lead", "Salesperson","Engineer", "Lawyer","Software Engineer","Accountant", "Lead Engineer"],
          message: "What is the employee's role?"
        },
        {
          name: "manager",
          type: "list",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "Who is the employee's manager?",
        
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO auctions SET ?",
          {
            first_name: answer.first,
            last_name: answer.last,
            role_id: answer.role,
            manager_id: answer.manager
          },
          function(err) {
            if (err) throw err;
            console.log("Employee was added successfully!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      });
    }
    )};

    function removeEmployee(){
        connection.query("SELECT * FROM employee", function(err, results) {
            if (err) throw err;
        // prompt for info about the item being put up for auction
        inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].item_name);
              }
              return choiceArray;
            },
            message: "Which employee would you like to remove?"
          }
        ])
        .then(function(answer) {
            
        })
    })
    }