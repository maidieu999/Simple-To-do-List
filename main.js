const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listsContainer = $('[data-project-lists]');
const projectsCountContainer = $('[data-projects-count]');
const newProjectForm = $('[data-new-project-form]');
const newProjectInput = $('[data-project-input]');
const newProjectButton = $('[data-project-btn]');
const tasksContainer = $('[data-tasks-container]');
const projectTitleElement = $('[data-task-title]');
const projectCountElement = $('[data-task-count]');
const taskTemplate = $('#task-template');
const tasksListContainer = $('[data-tasks-list-container]');
const deleteProjectButton = $('[data-delete-project-button]')
const clearCompletedTaskButton = $('[data-delete-task-button]');
const newTaskForm = $('[data-new-task-form]');
const newTaskInput = $('[data-new-task-input]');

const LOCAL_STORAGE_PROJECT_LIST_KEY = 'project.lists';
const LOCAL_STORAGE_SELECTED_PROJECT_ID = 'project.seletedId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_LIST_KEY)) || [];
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID);


function renderList() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.classList.add('project__list');
        listElement.dataset.listId = list.id;
        listElement.innerText = list.projectName;
        if(list.id === selectedProjectId) listElement.classList.add('project__list--active');
        listsContainer.appendChild(listElement);
    });
}
function renderProjectCount() {
    const projectsCount = lists.length;
    projectsCountContainer.innerText = `(${projectsCount})`;
}
function renderTasks(selectedProject) {
    selectedProject.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkBox = taskElement.querySelector('input[type="checkbox"]');
        checkBox.id = task.id;
        checkBox.checked = task.completed;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.taskName);
        tasksListContainer.appendChild(taskElement);
    })
}
function renderTasksCount(selectedProject) {
    const incompletedTasksCount = selectedProject.tasks.filter(task => !task.completed).length;
    const taskString = (incompletedTasksCount <= 1) ? 'task' : 'tasks';
    projectCountElement.innerText = `${incompletedTasksCount} ${taskString} remaining`;
}
function clearContainer(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function render() {
    clearContainer(listsContainer)
    renderList()
    renderProjectCount();
    const selectedProject = lists.find(list => list.id === selectedProjectId);

    if(selectedProjectId === null) {
        tasksContainer.style.display = 'none';
    }
    else {
        tasksContainer.style.display = '';
        projectTitleElement.innerText = selectedProject.projectName;
        renderTasksCount(selectedProject);
        clearContainer(tasksListContainer);
        renderTasks(selectedProject);
        renderTasksCount(selectedProject)
    }
}
function saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID, selectedProjectId);
}
function saveAndRender() {
    saveToLocalStorage();
    render();
}

function createProject(projectName) {
    return {
        id: Date.now().toString(),
        projectName: projectName,
        tasks: []
    }
}
function createTask(taskName) {
    return {
        id: Date.now().toString(),
        taskName: taskName,
        completed: false,
    }
}



newProjectForm.addEventListener('submit', function(e) {
    e.preventDefault(); //ngan chan load lai trang khi submit
    
    const projectName = newProjectInput.value;
    if(projectName == null || projectName == "") return;
    else {
        const newProject = createProject(projectName);
         
        lists.push(newProject);
        saveAndRender();
        newProjectInput.value = null;
    }
})
newTaskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if(taskName == null || taskName == '') return;
    else {
        const newTask = createTask(taskName);
        const selectedProject = lists.find(list => list.id == selectedProjectId);
        selectedProject.tasks.push(newTask);
        saveAndRender();
        newTaskInput.value = null;
    }
    

})

listsContainer.addEventListener('click', function(e) {
    if(e.target.closest('li')) {
        selectedProjectId = e.target.dataset.listId;
        saveAndRender();
        
    }
})

deleteProjectButton.addEventListener('click', function() {
    lists = lists.filter(function(list) {
        if(list.id !== selectedProjectId) return list.id;
    })
    selectedProjectId = null;
    saveAndRender();
})
clearCompletedTaskButton.addEventListener('click', function(e) {
    const selectedProject = lists.find(list => list.id === selectedProjectId);
    selectedProject.tasks = selectedProject.tasks.filter(task => !task.completed);
    saveAndRender();
})

tasksContainer.addEventListener('click', function(e) {
    if(e.target.tagName.toLowerCase() === 'input') {
        
        const selectedProject = lists.find(list => list.id === selectedProjectId);
        const selectedTask = selectedProject.tasks.find(task => task.id === e.target.id);
        console.log(selectedTask)
        selectedTask.completed = e.target.checked;
        saveAndRender();
        renderTasksCount(selectedProject)
    }
})
render();





