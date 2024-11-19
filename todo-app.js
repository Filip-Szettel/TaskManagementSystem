// todo-app.js
class TodoApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.API_URL = '/api/todos';

        this.shadowRoot.innerHTML = `
            <style>
                /* Reset some default styles */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
        
                :host {
                    font-family: "Open Sans", sans-serif;
                    line-height: 1.6;
                    background-color: #f8f9fa;
                    padding: 20px;
                    display: block;
                }
        
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
        
                /* App Title */
                .app-title {
                    text-align: center;
                    color: #0d6efd;
                    margin-bottom: 20px;
                    position: relative;
                }
        
                .app-title::before {
                    content: '✔';
                    position: absolute;
                    left: -30px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 24px;
                    color: white;
                    background-color: #0d6efd;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
        
                /* Add Todo Section */
                .add-todo-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
        
                .add-todo-input {
                    flex: 1 1 200px;
                    padding: 10px;
                    font-size: 1.2rem;
                    border: 2px solid #ced4da;
                    border-radius: 4px;
                    transition: border-color 0.3s;
                }
        
                .add-todo-input:focus {
                    border-color: #0d6efd;
                    outline: none;
                }
        
                .due-date-section, .priority-section {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
        
                .due-date-label {
                    font-size: 0.9rem;
                    color: #6c757d;
                    display: none;
                }
        
                .due-date-input, .priority-select {
                    padding: 8px;
                    font-size: 1rem;
                    border: 2px solid #ced4da;
                    border-radius: 4px;
                    transition: border-color 0.3s;
                }
        
                .due-date-input:focus, .priority-select:focus {
                    border-color: #0d6efd;
                    outline: none;
                }
        
                .add-button {
                    padding: 10px 20px;
                    font-size: 1.1rem;
                    color: #ffffff;
                    background-color: #0d6efd;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
        
                .add-button:hover {
                    background-color: #0b5ed7;
                }
        
                /* Separator */
                .separator {
                    border-bottom: 1px solid #dee2e6;
                    margin: 20px 0;
                }
        
                /* View Options */
                .view-options {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    gap: 20px;
                    margin-bottom: 20px;
                }
        
                .view-options label {
                    margin-right: 5px;
                    font-size: 0.9rem;
                    color: #6c757d;
                }
        
                .view-options select {
                    padding: 5px;
                    font-size: 1rem;
                    border: 2px solid #ced4da;
                    border-radius: 4px;
                    transition: border-color 0.3s;
                }
        
                .view-options select:focus {
                    border-color: #0d6efd;
                    outline: none;
                }
        
                /* Todo List */
                .todo-list {
                    list-style: none;
                }
        
                .todo-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: #f1f1f1;
                    padding: 10px 15px;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    transition: background-color 0.3s;
                    position: relative;
                }
        
                .todo-item.completed .todo-text {
                    text-decoration: line-through;
                    color: #6c757d;
                }
        
                .todo-item:hover {
                    background-color: #e2e6ea;
                }
        
                .todo-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
        
                .todo-actions button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    color: #0d6efd;
                    transition: color 0.3s;
                }
        
                .todo-actions button:hover {
                    color: #0b5ed7;
                }
        
                .delete-button {
                    color: #dc3545;
                }
        
                .delete-button:hover {
                    color: #bb2d3b;
                }
        
                .edit-button {
                    color: #ffc107;
                }
        
                .edit-button:hover {
                    color: #e0a800;
                }
        
                .clear-due-date-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    color: #dc3545;
                    transition: color 0.3s;
                    margin-left: 5px;
                }
        
                .clear-due-date-button:hover {
                    color: #bb2d3b;
                }
        
                .priority-label {
                    font-size: 0.9rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #ffffff;
                    margin-left: 10px;
                    text-transform: uppercase;
                    font-weight: bold;
                }
        
                .priority-high {
                    background-color: #dc3545;
                }
        
                .priority-medium {
                    background-color: #ffc107;
                    color: #212529;
                }
        
                .priority-low {
                    background-color: #198754;
                }
        
                .edit-form {
                    display: none;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 10px;
                }
        
                .edit-form input, .edit-form select {
                    padding: 8px;
                    font-size: 1rem;
                    border: 2px solid #ced4da;
                    border-radius: 4px;
                    transition: border-color 0.3s;
                }
        
                .edit-form input:focus, .edit-form select:focus {
                    border-color: #0d6efd;
                    outline: none;
                }
        
                .edit-form-buttons {
                    display: flex;
                    gap: 10px;
                }
        
                .save-button {
                    padding: 5px 10px;
                    font-size: 0.9rem;
                    color: #ffffff;
                    background-color: #28a745;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
        
                .save-button:hover {
                    background-color: #218838;
                }
        
                .cancel-button {
                    padding: 5px 10px;
                    font-size: 0.9rem;
                    color: #ffffff;
                    background-color: #6c757d;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
        
                .cancel-button:hover {
                    background-color: #5a6268;
                }
        
                /* Created Date */
                .created-date {
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-top: 5px;
                }
        
                /* Responsive Design */
                @media (max-width: 600px) {
                    .add-todo-wrapper {
                        flex-direction: column;
                        align-items: stretch;
                    }
        
                    .view-options {
                        flex-direction: column;
                        align-items: flex-end;
                    }
        
                    .todo-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }
        
                    .todo-actions {
                        margin-top: 10px;
                    }
                }
            </style>

            <div class="container">
                <!-- App Title -->
                <h1 class="app-title">Task Management System</h1>

                <!-- Add Todo Section -->
                <div class="add-todo-wrapper">
                    <input type="text" id="new-todo-input" class="add-todo-input" placeholder="Add new...">
                    <div class="due-date-section">
                        <label for="due-date-input" class="due-date-label">Due date not set</label>
                        <input type="date" id="due-date-input" class="due-date-input">
                        <button id="clear-due-date-button" title="Clear Due Date" style="display: none;">✖️</button>
                    </div>
                    <div class="priority-section">
                        <label for="priority-select">Priority:</label>
                        <select id="priority-select" class="priority-select">
                            <option value="low" selected>Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <button id="add-todo-button" class="add-button">Add</button>
                </div>

                <!-- Separator -->
                <div class="separator"></div>

                <!-- View Options -->
                <div class="view-options">
                    <div class="filter-option">
                        <label for="filter-todos">Filter:</label>
                        <select id="filter-todos">
                            <option value="all" selected>All</option>
                            <option value="completed">Completed</option>
                            <option value="active">Active</option>
                            <option value="has-due-date">Has Due Date</option>
                            <option value="high-priority">High Priority</option>
                            <option value="medium-priority">Medium Priority</option>
                            <option value="low-priority">Low Priority</option>
                        </select>
                    </div>
                    <div class="sort-option">
                        <label for="sort-todos">Sort:</label>
                        <select id="sort-todos">
                            <option value="added-date-asc" selected>Added Date (Asc)</option>
                            <option value="added-date-desc">Added Date (Desc)</option>
                            <option value="due-date-asc">Due Date (Asc)</option>
                            <option value="due-date-desc">Due Date (Desc)</option>
                            <option value="priority-asc">Priority (Low to High)</option>
                            <option value="priority-desc">Priority (High to Low)</option>
                        </select>
                    </div>
                </div>

                <!-- Todo List -->
                <ul class="todo-list" id="todo-list">
                    <!-- Todo items will be dynamically inserted here -->
                </ul>
            </div>
        `;

        // Bind methods
        this.formatDate = this.formatDate.bind(this);
        this.getPriorityLabel = this.getPriorityLabel.bind(this);
        this.fetchTodos = this.fetchTodos.bind(this);
        this.renderTodos = this.renderTodos.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.clearDueDate = this.clearDueDate.bind(this);
        this.handleTodoActions = this.handleTodoActions.bind(this);
        this.handleCompletionToggle = this.handleCompletionToggle.bind(this);
        this.handleFilterSort = this.handleFilterSort.bind(this);
    }

    connectedCallback() {
        // Initialize elements
        this.newTodoInput = this.shadowRoot.getElementById('new-todo-input');
        this.addTodoButton = this.shadowRoot.getElementById('add-todo-button');
        this.todoList = this.shadowRoot.getElementById('todo-list');
        this.filterTodos = this.shadowRoot.getElementById('filter-todos');
        this.sortTodos = this.shadowRoot.getElementById('sort-todos');
        this.dueDateInput = this.shadowRoot.getElementById('due-date-input');
        this.dueDateLabel = this.shadowRoot.querySelector('.due-date-label');
        this.clearDueDateButton = this.shadowRoot.getElementById('clear-due-date-button');
        this.prioritySelect = this.shadowRoot.getElementById('priority-select');

        // Event listeners
        this.addTodoButton.addEventListener('click', this.addTodo);
        this.clearDueDateButton.addEventListener('click', this.clearDueDate);
        this.dueDateInput.addEventListener('change', () => {
            if (this.dueDateInput.value) {
                const formattedDate = this.formatDate(new Date(this.dueDateInput.value));
                this.dueDateLabel.textContent = formattedDate;
                this.dueDateLabel.style.display = 'inline';
                this.clearDueDateButton.style.display = 'inline';
            } else {
                this.dueDateLabel.textContent = 'Due date not set';
                this.dueDateLabel.style.display = 'none';
                this.clearDueDateButton.style.display = 'none';
            }
        });
        this.todoList.addEventListener('click', this.handleTodoActions);
        this.todoList.addEventListener('change', this.handleCompletionToggle);
        this.filterTodos.addEventListener('change', this.handleFilterSort);
        this.sortTodos.addEventListener('change', this.handleFilterSort);

        // Initial render
        this.renderTodos();
    }

    // Format Date to DD/MM/YYYY
    formatDate(date) {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Get Priority Label HTML
    getPriorityLabel(priority) {
        let className = '';
        let text = '';
        if (priority === 'high') {
            className = 'priority-high';
            text = 'High';
        } else if (priority === 'medium') {
            className = 'priority-medium';
            text = 'Medium';
        } else {
            className = 'priority-low';
            text = 'Low';
        }
        return `<span class="priority-label ${className}">${text}</span>`;
    }

    // Fetch Todos from API
    async fetchTodos() {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            alert('Error fetching todos.');
            return [];
        }
    }

    // Render Todos
    async renderTodos() {
        const todos = await this.fetchTodos();

        // Apply Filters
        let filteredTodos = [...todos];
        const filterValue = this.filterTodos.value;

        if (filterValue === 'completed') {
            filteredTodos = filteredTodos.filter(todo => todo.completed);
        } else if (filterValue === 'active') {
            filteredTodos = filteredTodos.filter(todo => !todo.completed);
        } else if (filterValue === 'has-due-date') {
            filteredTodos = filteredTodos.filter(todo => todo.dueDate);
        } else if (filterValue === 'high-priority') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === 'high');
        } else if (filterValue === 'medium-priority') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === 'medium');
        } else if (filterValue === 'low-priority') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === 'low');
        }

        // Apply Sorting
        const sortValue = this.sortTodos.value;
        if (sortValue === 'added-date-asc') {
            filteredTodos.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        } else if (sortValue === 'added-date-desc') {
            filteredTodos.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        } else if (sortValue === 'due-date-asc') {
            filteredTodos.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                const dateA = new Date(a.dueDate.split('/').reverse().join('-'));
                const dateB = new Date(b.dueDate.split('/').reverse().join('-'));
                return dateA - dateB;
            });
        } else if (sortValue === 'due-date-desc') {
            filteredTodos.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                const dateA = new Date(a.dueDate.split('/').reverse().join('-'));
                const dateB = new Date(b.dueDate.split('/').reverse().join('-'));
                return dateB - dateA;
            });
        } else if (sortValue === 'priority-asc') {
            const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
            filteredTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortValue === 'priority-desc') {
            const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
            filteredTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        }

        // Clear current list
        this.todoList.innerHTML = '';

        // Create Todo Elements
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }
            li.setAttribute('data-id', todo.id);

            li.innerHTML = `
                <div class="view-mode" style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} class="complete-checkbox" title="Mark as ${todo.completed ? 'active' : 'completed'}">
                    <span class="todo-text">${todo.text}</span>
                    ${this.getPriorityLabel(todo.priority)}
                </div>
                <div class="view-mode" style="display: flex; align-items: center; gap: 10px;">
                    ${todo.dueDate ? `
                        <span class="due-date" title="Due Date: ${todo.dueDate}">${todo.dueDate}</span>
                        <button class="clear-due-date-button" title="Clear Due Date">✖️</button>
                    ` : ''}
                    <button class="edit-button" title="Edit Todo">✏️</button>
                    <button class="delete-button" title="Delete Todo">🗑️</button>
                </div>
                <div class="edit-form">
                    <input type="text" class="edit-text-input" value="${todo.text}" placeholder="Edit todo...">
                    <div class="edit-details">
                        <input type="date" class="edit-due-date-input" value="${todo.dueDate ? new Date(todo.dueDate.split('/').reverse().join('-')).toISOString().split('T')[0] : ''}">
                        <select class="edit-priority-select">
                            <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="edit-form-buttons">
                        <button class="save-button">Save</button>
                        <button class="cancel-button">Cancel</button>
                    </div>
                </div>
                <div class="created-date">Created on: ${this.formatDate(new Date(todo.createdDate))}</div>
            `;

            // Append to list
            this.todoList.appendChild(li);
        });
    }

    // Add Todo
    async addTodo() {
        const text = this.newTodoInput.value.trim();
        const dueDate = this.dueDateInput.value ? this.formatDate(new Date(this.dueDateInput.value)) : null;
        const priority = this.prioritySelect.value;

        if (text === '') {
            alert('Please enter a todo.');
            return;
        }

        const newTodo = {
            text,
            dueDate,
            priority
        };

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const addedTodo = await response.json();
            console.log('Added Todo:', addedTodo);

            // Reset input fields
            this.newTodoInput.value = '';
            this.dueDateInput.value = '';
            this.prioritySelect.value = 'low';
            this.dueDateLabel.style.display = 'none';
            this.clearDueDateButton.style.display = 'none';

            // Refresh the todo list
            this.renderTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Error adding todo.');
        }
    }

    // Clear Due Date (Global)
    clearDueDate() {
        this.dueDateInput.value = '';
        this.dueDateLabel.textContent = 'Due date not set';
        this.dueDateLabel.style.display = 'none';
        this.clearDueDateButton.style.display = 'none';
    }

    // Handle Todo Actions (Edit, Delete, Clear Due Date) using Event Delegation
    async handleTodoActions(e) {
        const target = e.target;
        const todoItem = target.closest('.todo-item');
        if (!todoItem) return;
        const todoId = parseInt(todoItem.getAttribute('data-id'), 10);
        console.log('Handling action for Todo ID:', todoId);

        if (target.classList.contains('delete-button')) {
            // Delete Todo
            if (confirm('Are you sure you want to delete this todo?')) {
                try {
                    const response = await fetch(`${this.API_URL}/${todoId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete todo');
                    }

                    console.log('Deleted Todo ID:', todoId);

                    // Refresh the todo list
                    this.renderTodos();
                } catch (error) {
                    console.error('Error deleting todo:', error);
                    alert('Error deleting todo.');
                }
            }
        } else if (target.classList.contains('edit-button')) {
            // Enter Edit Mode
            const viewModeDivs = todoItem.querySelectorAll('.view-mode');
            const editFormDiv = todoItem.querySelector('.edit-form');

            viewModeDivs.forEach(div => div.style.display = 'none');
            editFormDiv.style.display = 'flex';
        } else if (target.classList.contains('save-button')) {
            // Save Edited Todo
            const editTextInput = todoItem.querySelector('.edit-text-input');
            const editDueDateInput = todoItem.querySelector('.edit-due-date-input');
            const editPrioritySelect = todoItem.querySelector('.edit-priority-select');
            const updatedText = editTextInput.value.trim();
            const updatedDueDate = editDueDateInput.value ? this.formatDate(new Date(editDueDateInput.value)) : null;
            const updatedPriority = editPrioritySelect.value;

            if (updatedText === '') {
                alert('Todo cannot be empty.');
                return;
            }

            const updatedTodo = {
                text: updatedText,
                dueDate: updatedDueDate,
                priority: updatedPriority
            };

            try {
                const response = await fetch(`${this.API_URL}/${todoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedTodo)
                });

                if (!response.ok) {
                    throw new Error('Failed to update todo');
                }

                const updatedData = await response.json();
                console.log('Updated Todo:', updatedData);

                // Exit Edit Mode and refresh the todo list
                const viewModeDivs = todoItem.querySelectorAll('.view-mode');
                const editFormDiv = todoItem.querySelector('.edit-form');

                viewModeDivs.forEach(div => div.style.display = 'flex');
                editFormDiv.style.display = 'none';

                this.renderTodos();
            } catch (error) {
                console.error('Error updating todo:', error);
                alert('Error updating todo.');
            }
        } else if (target.classList.contains('cancel-button')) {
            // Exit Edit Mode without saving
            const viewModeDivs = todoItem.querySelectorAll('.view-mode');
            const editFormDiv = todoItem.querySelector('.edit-form');

            viewModeDivs.forEach(div => div.style.display = 'flex');
            editFormDiv.style.display = 'none';
        } else if (target.classList.contains('clear-due-date-button')) {
            // Clear Due Date for Specific Todo
            try {
                const response = await fetch(`${this.API_URL}/${todoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ dueDate: null })
                });

                if (!response.ok) {
                    throw new Error('Failed to clear due date');
                }

                console.log('Cleared Due Date for Todo ID:', todoId);

                // Refresh the todo list
                this.renderTodos();
            } catch (error) {
                console.error('Error clearing due date:', error);
                alert('Error clearing due date.');
            }
        }
    }

    // Handle Completion Toggle
    async handleCompletionToggle(e) {
        if (e.target.classList.contains('complete-checkbox')) {
            const todoItem = e.target.closest('.todo-item');
            const todoId = parseInt(todoItem.getAttribute('data-id'), 10);
            const completed = e.target.checked;
            console.log(`Toggling completion for Todo ID: ${todoId} to ${completed}`);

            try {
                const response = await fetch(`${this.API_URL}/${todoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed })
                });

                if (!response.ok) {
                    throw new Error('Failed to update completion status');
                }

                const updatedTodo = await response.json();
                console.log('Updated Todo Completion:', updatedTodo);

                // Refresh the todo list
                this.renderTodos();
            } catch (error) {
                console.error('Error updating completion status:', error);
                alert('Error updating completion status.');
            }
        }
    }

    // Handle Filtering and Sorting
    handleFilterSort() {
        this.renderTodos();
    }
}

// Define the new element
customElements.define('todo-app', TodoApp);
