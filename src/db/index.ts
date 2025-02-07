import inquirer from 'inquirer';
import { pool } from './connection.js';

async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add an employee',
                'Update an employee role',
                'View all roles',
                'Add a role',
                'View all departments',
                'Add a department',
                'Exit'
            ]
        }
    ]);

    switch (answers.action) {
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'View all departments':
            await viewDepartments();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Exit':
            console.log('Goodbye!');
            await pool.end(); 
            process.exit(0);
    }

    mainMenu(); 
}



async function viewEmployees() {
    const result = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
               departments.name AS department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN departments ON role.department_id = departments.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `);
    console.table(result.rows);
}

// Function to Add an Employee
async function addEmployee() {
    const roles = await pool.query('SELECT id, title FROM role');
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');

    const answers = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: "Enter the employee's first name:" },
        { type: 'input', name: 'last_name', message: "Enter the employee's last name:" },
        {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's role:",
            choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager (or choose 'None'):",
            choices: [{ name: 'None', value: null }, ...employees.rows.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))]
        }
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    
    console.log('Employee added successfully.');
}

// Function to Update an Employee's Role
async function updateEmployeeRole() {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const roles = await pool.query('SELECT id, title FROM role');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select an employee to update:',
            choices: employees.rows.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))
        },
        {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's new role:",
            choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
        }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', 
        [answers.role_id, answers.employee_id]);

    console.log('Employee role updated successfully.');
}

// Function to View Roles
async function viewRoles() {
    const result = await pool.query(`
        SELECT role.id, role.title, role.salary, departments.name AS department 
        FROM role 
        JOIN departments ON role.department_id = departments.id
    `);
    console.table(result.rows);
}

// Function to Add a Role
async function addRole() {
    const departments = await pool.query('SELECT id, name FROM departments');

    const answers = await inquirer.prompt([
        { type: 'input', name: 'title', message: "Enter the role title:" },
        { type: 'input', name: 'salary', message: "Enter the role's salary:" },
        {
            type: 'list',
            name: 'department_id',
            message: "Select the department for this role:",
            choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
        [answers.title, answers.salary, answers.department_id]);

    console.log('Role added successfully.');
}

// Function to View Departments
async function viewDepartments() {
    const result = await pool.query('SELECT * FROM departments');
    console.table(result.rows);
}

// Function to Add a Department
async function addDepartment() {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'name', message: "Enter the department name:" }
    ]);

    await pool.query('INSERT INTO departments (name) VALUES ($1)', [answers.name]);
    
    console.log('Department added successfully.');
}

// Start the CLI
mainMenu();