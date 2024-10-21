import { openModal, closeModal, switchSection, hideAllSectionsExcept } from './ui.js';
import { saveProjects, loadProjects } from './storage.js';
import { toggleTimer } from './timer.js';

let projects = [];

export function initializeTasks() {
    // Cette fonction peut rester vide si elle n'est pas nécessaire
}

export function renderTasks(project) {
    const todoList = document.getElementById('todo-tasks');
    const inProgressList = document.getElementById('in-progress-tasks');
    const completedList = document.getElementById('completed-tasks');
    
    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    completedList.innerHTML = '';
    
    project.tasks.forEach((task, taskIndex) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span title="${task.name}">${task.name}</span>
            <div class="button-container">
                <button class="start-pomodoro" data-task-index="${taskIndex}">Démarrer</button>
                ${task.status !== 'completed' ? `<button class="complete-task" data-task-index="${taskIndex}">Terminer</button>` : ''}
            </div>
            <button class="delete-task" data-task-index="${taskIndex}">Supprimer</button>
        `;
        
        if (task.status === 'todo') {
            todoList.appendChild(li);
        } else if (task.status === 'in-progress') {
            inProgressList.appendChild(li);
        } else if (task.status === 'completed') {
            completedList.appendChild(li);
        }
        
        li.querySelector('.start-pomodoro').addEventListener('click', (e) => {
            e.stopPropagation();
            const taskIndex = e.target.dataset.taskIndex;
            startPomodoroForTask(project, taskIndex);
        });

        const completeButton = li.querySelector('.complete-task');
        if (completeButton) {
            completeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskIndex = e.target.dataset.taskIndex;
                completeTask(project, taskIndex);
            });
        }

        li.querySelector('.delete-task').addEventListener('click', (e) => {
            e.stopPropagation();
            const taskIndex = e.target.dataset.taskIndex;
            deleteTask(project, taskIndex);
        });

        li.addEventListener('click', () => {
            showTaskDetails(task);
        });
    });
}

function showTaskDetails(task) {
    openModal('task-details', {
        title: 'Détails de la tâche',
        fields: [
            { name: 'taskName', value: task.name, readonly: true },
            { name: 'taskStatus', value: task.status, readonly: true }
        ],
        onSave: () => {
            closeModal();
        },
        onCancel: closeModal
    });
}

function completeTask(project, taskIndex) {
    const projects = loadProjects();
    const updatedProject = projects.find(p => p.id === project.id);
    if (updatedProject && updatedProject.tasks[taskIndex]) {
        updatedProject.tasks[taskIndex].status = 'completed';
        saveProjects(projects);
        renderTasks(updatedProject);
    } else {
        console.error('Tâche non trouvée');
    }
}

function deleteTask(project, taskIndex) {
    const projects = loadProjects();
    const updatedProject = projects.find(p => p.id === project.id);
    if (updatedProject) {
        updatedProject.tasks.splice(taskIndex, 1);
        saveProjects(projects);
        renderTasks(updatedProject);
    } else {
        console.error('Projet non trouvé');
    }
}

export function addTaskToProject(projectIndex) {
    openModal('add-task', {
        title: 'Ajouter une tâche',
        fields: [{ name: 'taskName', placeholder: 'Nom de la tâche' }],
        onSave: async (data) => {
            const projects = loadProjects();
            if (projects[projectIndex]) {
                projects[projectIndex].tasks = projects[projectIndex].tasks || [];
                projects[projectIndex].tasks.push({
                    name: data.taskName,
                    status: 'todo'
                });
                saveProjects(projects);
                await closeModal();
                renderTasks(projects[projectIndex]);
            } else {
                console.error('Projet non trouvé');
                await closeModal();
            }
        },
        onCancel: closeModal
    });
}

function startPomodoroForTask(project, taskIndex) {
    openModal('start-pomodoro', {
        title: 'Démarrer un Pomodoro',
        fields: [{ name: 'duration', type: 'number', placeholder: 'Durée (en minutes)', value: '25' }],
        onSave: async (data) => {
            const duration = parseInt(data.duration);
            if (duration > 0) {
                const projects = loadProjects();
                const updatedProject = projects.find(p => p.id === project.id);
                if (updatedProject && updatedProject.tasks[taskIndex]) {
                    updatedProject.tasks[taskIndex].status = 'in-progress';
                    saveProjects(projects);
                    
                    await closeModal();
                    
                    switchSection('timer');
                    hideAllSectionsExcept('timer');
                    
                    const timerModule = await import('./timer.js');
                    timerModule.setTimerDuration(duration * 60, updatedProject.tasks[taskIndex].name);
                    timerModule.toggleTimer();
                } else {
                    console.error('Tâche non trouvée');
                    await closeModal();
                }
            } else {
                console.error('Durée invalide');
                await closeModal();
            }
        },
        onCancel: closeModal
    });
}

export { startPomodoroForTask, completeTask };

// Autres fonctions liées aux tâches...
