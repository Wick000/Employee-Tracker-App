\c postgres

DROP DATABASE IF EXISTS emtracker;
CREATE DATABASE emtracker;

\c emtracker;

CREATE TABLE departments (
    id: SERIAL PRIMARY KEY,
    name: VARCHAR(30) UNIQUE NOT NULL   /*to hold department name*/
);

CREATE TABLE role (
    id: SERIAL PRIMARY KEY,
    title: VARCHAR(30) UNIQUE NOT NULL,
    salary: DECIMAL NOT NULL,
    department_id: INTEGER NOT NULL
);

CREATE TABLE employee(
    id: SERIAL PRIMARY KEY,
    first_name: VARCHAR(30) NOT NULL,
    last_name: VARCHAR(30) NOT NULL,
    role_id: INTEGER NOT NULL,
    manager_id: INTEGER
);