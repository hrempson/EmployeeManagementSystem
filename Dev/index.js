const connection = require("./db/connection");
const inquirer = require("inquirer");
const { writeFile } = require("fs");

// add departments, roles, employees
function addDepartment() {
    inquirer.prompt([
        {
        message: "What is the department name?",
        type: "input",
        name: "departmentName"
        }
    ]).then((response) => {

        connection.query(" INSERT INTO department (name) VALUES (?)", response.departmentName, (err, result) => {
            if(err) throw err;
            console.log ("Inserted ID " +result.insertId);
        });

        console.log(response);
    });
}

function addRole() {

    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
            message: "What is the title?",
            type: "input",
            name: "title"
            },
            {
            message: "What is the salary?",
            type: "input",
            name: "salary",
            validate: (value) => {
                return !isNaN(value) ? true : "Please insert a numeric value";
            }
            },
            {
            message: "What department does the employee belong to?",
            type: "list",
            name: "department_id",
            choices: results.map( department => {
                return {
                    name: department.name,
                    value: department.id
                };
            })
        }

    ]).then((response) => {
        console.log(response);
        
        connection.query(" INSERT INTO role SET ?", response, (err, result) => {
            if(err) throw err;
            console.log ("Inserted ID " +result.insertId);
        });
    
});
});
}
function addEmployee() {
    
}

// view departments, roles, employees

function viewDepartment() {

}

function viewRole() {
    
}

function viewEmployee() {
    
}

// update employee roles

function updateEmployeeRoles() {

}

addRole();