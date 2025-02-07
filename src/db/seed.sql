
INSERT INTO departments (name) VALUES 
('Engineering'),
('Human Resources'),
('Marketing'),
('Sales'),
('Finance'),
('IT Support');


INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 90000, 1),
('HR Manager', 80000, 2),
('Marketing Specialist', 70000, 3),
('Sales Associate', 60000, 4),
('Financial Analyst', 75000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Alice', 'Johnson', 1, NULL),  
('Bob', 'Smith', 2, NULL),      
('Charlie', 'Brown', 3, 1),     
('David', 'Lee', 4, 1),         
('Eve', 'Clark', 5, 2),         
('Frank', 'Wright', 1, 1),      
('Grace', 'Hall', 2, 2),        
('Hank', 'Adams', 3, 1),        
('Ivy', 'Baker', 4, 2),         
('Jack', 'Davis', 5, 1);        
