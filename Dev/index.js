const connection = require("./db/connection");
const inquirer = require("inquirer");
const { writeFile } = require("fs");
const { listenerCount } = require("process");

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
            nextTask();
        });
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
                return !isNaN(value) ? true : "Please insert a numeric value"
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
        console.table(response);
        
        connection.query(" INSERT INTO role SET ?", response, (err, result) => {
            if(err) throw err;
            console.log ("Inserted ID " + result.insertId);
            nextTask();
        });
    
});
});
}
function addEmployee() {
        getRoles((roles) => {
            getEmployees((employees) => {
                employeeSelections = employees.map(employee => {
                    return {
                        name: employee.first_name + " " + employee.last_name,
                        value: employee.id
                        };
                    });


                employees.unshift( { name: "none", value: null } );
        inquirer.prompt([
            {
            message: "What is the employees first name?",
            type: "input",
            name: "first_name"
            },
            {
            message: "What is the employees last name?",
            type: "input",
            name: "last_ name"
            },
            {
            message: "What is the employees role?",
            type: "list",
            name: "role_id",
            choices: roles.map( role => {
                return {
                    name: role.title,
                    value: role.id
                };
            })
            },
            {
            message: "Who is the employee's manager: ",
            type: "list",
            name: "manager_id",
            choices: employeeSelections
            }
        ]).then((response) => {
            connection.query(" INSERT INTO employee SET ?", response, (err, result) => {
                if(err) throw err;
                console.table ("Inserted ID " +  result.insertId);
                nextTask();
            });
        });
    });
});
}

// view departments, roles, employees

function getRoles(cb) {
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        cb(results);
    });
}

function getEmployees(cb) {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        cb(results);
});
} 
function viewDepartment() {
    connection.query("Select * FROM department", (err, results) => {
        if(err) throw err
        console.table(results);
        nextTask();
    });
}

function viewRole() {
    getRoles((roles) => {
        console.table(roles);
        nextTask();
});
}

function viewEmployee() {
    getEmployees((employees) => {
        console.table(employees);
        nextTask();
    });
}

// update employee roles

function updateEmployeeRoles() {
    getRoles((roles) => {
        employeeSelections = employees.map(employee => {
            return{
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        inquirer.prompt([
            {
                message: "What is the name of the employee you'd like to update? ",
                type: "list",
                choices: employeeSelections
            },
            {
                message: "What is the employee's new role: ",
                type: "list",
                name: "role_id",
                choices: roles.map(role => {
                    return {
                        name: role.title,
                        value: role.id
                    };
                })
            },
            {
                message: "What is the employee's new department: ",
                type: "list",
                name: "department_id",
                choices: roles.map(departmentName => {
                    return {
                        name: departmentName.title,
                        value: departmentName.id
                    }})
            },
            {
                message: "Who is the employee's new manager: ",
                type: "list",
                name: "manager_id",
                choices: employeeSelections
            }
        ]).then((response) => {
            console.log(response);
            connection.query(`UPDATE employee SET role_id = ${response.role_id} WHERE id = ${response.name}`, (err, result) => {
                if (err) throw err;
                console.log("updated ID: " + result.insertId);
                nextTask();
            })
        })
    })

}
function nextTask() {
    inquirer.prompt ([
        {
            message: "What would you like to do?",
            type: "list",
            name: "selectOptions",
            choices: optionList
        }
    ]).then ((response) => {
        let i = response.selectOptions
        if( i == 0) {addDepartment()}
        else if ( i == 1) {addEmployee()}
        else if (i == 2) {viewDepartment}
        else if (i == 3) {viewRole}
        else if (i == 4) {viewEmployee()}
        else if (i == 5) {updateEmployeeRoles()}
    })
}

const optionList = [
    {
        name: "Add department",
        value: 0 
    },
    {
        name: "Add a role",
        value: 1
    },
    {   
        name: "Add employee",
        value: 2
    },
    {
        name: "View departments",
        value: 3
    },
    {
        name: "View roles",
        value: 4
    },
    {
        name: "View employees",
        value: 5
    },
    {
        name: "Update an employee's role",
        value: 6
    },
]
nextTask();
// addRole();
// addDepartment();
// addEmployee();
// viewEmployee();