import { renderTasks, addTaskToProject } from './tasks.js';
import { openModal, closeModal, switchSection, hideAllSectionsExcept } from './ui.js';
import { saveProjects, loadProjects } from './storage.js';

export function initializeProjects() {
    console.log("Initializing projects");
    renderProjects();
    setupProjectListeners();
}

function renderProjects() {
    console.log("Rendering projects");
    const projects = loadProjects();
    console.log("Loaded projects:", projects);
    const projectsSection = document.getElementById('projects-section');
    if (!projectsSection) {
        console.error("La section des projets n'existe pas");
        return;
    }

    projectsSection.innerHTML = `
        <h2>Projets</h2>
        <ul id="projects-list"></ul>
        <button id="add-project" class="main-button">Ajouter un projet</button>
    `;

    const projectsList = document.getElementById('projects-list');
    projects.forEach((project, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${project.name}</span>
            <button class="view-project" data-index="${index}">Voir</button>
            <button class="delete-project" data-index="${index}">Supprimer</button>
        `;
        projectsList.appendChild(li);
    });

    setupProjectListeners();
}

function setupProjectListeners() {
    console.log("Setting up project listeners");
    const addProjectButton = document.getElementById('add-project');
    if (addProjectButton) {
        addProjectButton.addEventListener('click', openAddProjectModal);
    }

    const projectsList = document.getElementById('projects-list');
    if (projectsList) {
        projectsList.addEventListener('click', handleProjectClick);
    }
}

function openAddProjectModal() {
    console.log("Opening add project modal");
    openModal('add-project', {
        title: 'Ajouter un projet',
        fields: [{ name: 'projectName', placeholder: 'Nom du projet' }],
        onSave: (data) => {
            const projectName = data.projectName.trim();
            if (projectName === '') {
                alert("Le nom du projet ne peut pas être vide.");
                return;
            }
            if (isProjectNameUnique(projectName)) {
                addProject(data);
                closeModal();
                renderProjects();
            } else {
                alert("Un projet avec ce nom existe déjà. Veuillez choisir un nom unique.");
            }
        },
        onCancel: closeModal
    });
}

function isProjectNameUnique(name) {
    const projects = loadProjects();
    return !projects.some(project => project.name.toLowerCase() === name.toLowerCase());
}

function addProject(data) {
    console.log("Adding project:", data);
    const projects = loadProjects();
    projects.push({ id: Date.now(), name: data.projectName.trim(), tasks: [] });
    saveProjects(projects);
}

function handleProjectClick(event) {
    if (event.target.classList.contains('view-project')) {
        const projectIndex = parseInt(event.target.dataset.index);
        console.log("Viewing project at index:", projectIndex);
        viewProject(projectIndex);
    } else if (event.target.classList.contains('delete-project')) {
        const projectIndex = parseInt(event.target.dataset.index);
        console.log("Deleting project at index:", projectIndex);
        deleteProject(projectIndex);
    }
}

function deleteProject(index) {
    const projects = loadProjects();
    projects.splice(index, 1);
    saveProjects(projects);
    renderProjects();
}

export function viewProject(projectIndex) {
    console.log("Viewing project:", projectIndex);
    const projects = loadProjects();
    const project = projects[projectIndex];
    if (!project) {
        console.error('Projet non trouvé');
        return;
    }

    let projectDetailSection = document.getElementById('project-detail');
    if (!projectDetailSection) {
        projectDetailSection = document.createElement('div');
        projectDetailSection.id = 'project-detail';
        projectDetailSection.classList.add('section');
        document.getElementById('app').appendChild(projectDetailSection);
    }
    
    projectDetailSection.innerHTML = `
        <h2>${project.name}</h2>
        <div class="task-lists">
            <div class="task-list">
                <h3>À faire</h3>
                <ul id="todo-tasks"></ul>
            </div>
            <div class="task-list">
                <h3>En cours</h3>
                <ul id="in-progress-tasks"></ul>
            </div>
            <div class="task-list">
                <h3>Terminé</h3>
                <ul id="completed-tasks"></ul>
            </div>
        </div>
        <button id="add-task">Ajouter une tâche</button>
        <button id="back-to-projects">Retour aux projets</button>
    `;
    
    hideAllSectionsExcept('project-detail');
    
    document.getElementById('add-task').addEventListener('click', () => addTaskToProject(projectIndex));
    document.getElementById('back-to-projects').addEventListener('click', switchToProjects);
    
    renderTasks(project);
}

export function switchToProjects() {
    console.log("Switching to projects view");
    let projectsSection = document.getElementById('projects-section');
    if (!projectsSection) {
        projectsSection = document.createElement('div');
        projectsSection.id = 'projects-section';
        projectsSection.classList.add('section');
        document.getElementById('app').appendChild(projectsSection);
    }

    hideAllSectionsExcept('projects');
    renderProjects();
}

// Autres fonctions liées aux projets...
