const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

function checkExistId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    res.status(400).json({ error: 'Id not exist' });
  }
  return next();
}

function checkNumberOfRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Number of requests is: ${numberOfRequests}`);

  return next();
}

server.use(checkNumberOfRequests);

//Creating a new project
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

//Add a new task in project
server.post('/projects/:id/tasks', checkExistId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

//Updating an existent project
server.put('/projects/:id', checkExistId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Deleting an existent project
server.delete('/projects/:id', checkExistId, (req, res) => {
  const id = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//listing all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//

server.listen(3000);
