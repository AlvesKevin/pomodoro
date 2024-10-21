import { switchToProjects } from './projects.js';

const sections = {
    timer: document.getElementById('timer-section'),
    projects: document.getElementById('projects-section')
};

const navButtons = {
    timer: document.getElementById('nav-timer'),
    projects: document.getElementById('nav-projects')
};

export function initializeUI() {
    setupNavigation();
}

function setupNavigation() {
    Object.keys(navButtons).forEach(section => {
        navButtons[section].addEventListener('click', () => {
            if (section === 'projects') {
                switchToProjects();
            } else {
                switchSection(section);
            }
        });
    });
}

export function switchSection(section) {
    console.log("Switching to section:", section);
    hideAllSectionsExcept(section);
    Object.keys(navButtons).forEach(key => {
        if (navButtons[key]) {
            navButtons[key].classList.toggle('active', key === section);
        }
    });
}

export function openModal(modalType, { title, fields, onSave, onCancel }) {
    const modal = createModal(modalType, title, fields, onSave, onCancel);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

export function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function createModal(modalType, title, fields, onSave, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    content.innerHTML = `
        <h2>${title}</h2>
        ${fields.map(field => `
            <div class="modal-field">
                <label for="${field.name}">${field.name}:</label>
                <input type="${field.type || 'text'}" 
                       name="${field.name}" 
                       value="${field.value || ''}" 
                       ${field.readonly ? 'readonly' : ''}
                       ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                />
            </div>
        `).join('')}
        <div class="modal-buttons">
            <button id="save-${modalType}">Enregistrer</button>
            <button id="cancel-${modalType}">Annuler</button>
        </div>
    `;
    
    modal.appendChild(content);
    
    const saveButton = content.querySelector(`#save-${modalType}`);
    const cancelButton = content.querySelector(`#cancel-${modalType}`);
    
    saveButton.addEventListener('click', () => {
        const data = {};
        fields.forEach(field => {
            data[field.name] = content.querySelector(`[name="${field.name}"]`).value;
        });
        modal.remove();
        onSave(data);
    });
    
    cancelButton.addEventListener('click', () => {
        modal.remove();
        onCancel();
    });
    
    return modal;
}

export function hideAllSectionsExcept(activeSection) {
    console.log("Hiding all sections except:", activeSection);
    Object.keys(sections).forEach(key => {
        if (sections[key]) {
            if (key === activeSection) {
                console.log("Activating section:", key);
                sections[key].classList.add('active');
                sections[key].style.display = key === 'timer' ? 'flex' : 'block';
            } else {
                console.log("Deactivating section:", key);
                sections[key].classList.remove('active');
                sections[key].style.display = 'none';
            }
        }
    });
    
    // Gérer la section de détail du projet séparément
    const projectDetailSection = document.getElementById('project-detail');
    if (projectDetailSection) {
        if (activeSection === 'project-detail') {
            console.log("Activating project detail section");
            projectDetailSection.classList.add('active');
            projectDetailSection.style.display = 'block';
        } else {
            console.log("Deactivating project detail section");
            projectDetailSection.classList.remove('active');
            projectDetailSection.style.display = 'none';
        }
    }
}

// Autres fonctions liées à l'interface utilisateur...
