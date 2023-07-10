CREATE DATABASE IF NOT EXISTS tmsdb;

USE tmsdb;

CREATE TABLE accounts (
	username varchar(50) PRIMARY KEY,
    password varchar(100),
    email varchar(100),
    active varchar (20)
);

CREATE TABLE accounts_usergroups (
	username varchar(50),
    userGroupName varchar(50),
    PRIMARY KEY (username, userGroupName)
);

CREATE TABLE user_group (
    userGroupName varchar(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS applications (
  app_acronym VARCHAR(255) PRIMARY KEY,
  app_description TEXT,
  app_Rnumber VARCHAR(50),
  app_startdate DATE,
  app_enddate DATE,
  app_permit_open VARCHAR(50),
  app_permit_todo VARCHAR(50),
  app_permit_doing VARCHAR(50),
  app_permit_done VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS plans (
  plan_mvp_name VARCHAR(255) PRIMARY KEY,
  plan_startdate DATE,
  plan_enddate DATE,
  plan_app_acronym VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tasks (
  task_id VARCHAR(255) PRIMARY KEY,
  task_name VARCHAR(255),
  task_description TEXT,
  task_notes TEXT,
  task_plan VARCHAR(255),
  task_app_acronym VARCHAR(255),
  task_state VARCHAR(50),
  task_creator VARCHAR(50),
  task_owner VARCHAR(50),
  task_createdate DATE,
  FOREIGN KEY (task_plan) references plans(plan_mvp_name),
  FOREIGN KEY (task_app_acronym) references applications(app_acronym)
);

SELECT * FROM accounts;