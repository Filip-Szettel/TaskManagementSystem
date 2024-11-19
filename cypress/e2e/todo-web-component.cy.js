/// <reference types="cypress" />

describe('TodoApp Web Component', () => {
    beforeEach(() => {
        // Reset the server state before each test to ensure isolation
        cy.request('POST', '/api/todos/reset').then(() => {
            cy.visit('/');
        });
    });

    it('should load the TodoApp component', () => {
        cy.get('todo-app').should('exist');
    });

    it('should add a new todo', () => {
        const todoText = 'Test adding a new todo';
        cy.get('todo-app').shadow().within(() => {
            cy.get('#new-todo-input').type(todoText);
            cy.get('#add-todo-button').click();
            cy.get('.todo-list .todo-item').contains(todoText).should('exist');
        });
    });

    it('should mark a todo as completed', () => {
        const todoText = 'Test marking as completed';
        cy.get('todo-app').shadow().within(() => {
            cy.get('#new-todo-input').type(todoText);
            cy.get('#add-todo-button').click();
            cy.get('.todo-list .todo-item').contains(todoText).parent().within(() => {
                cy.get('.complete-checkbox').check();
            });
            cy.get('.todo-list .todo-item').contains(todoText).parent().should('have.class', 'completed');
        });
    });

    it('should edit an existing todo', () => {
        const originalText = 'Original Todo';
        const updatedText = 'Updated Todo';
        cy.get('todo-app').shadow().within(() => {
            cy.get('#new-todo-input').type(originalText);
            cy.get('#add-todo-button').click();
            cy.get('.todo-list .todo-item').contains(originalText).parent().within(() => {
                cy.get('.edit-button').should('exist').click();
                cy.get('.edit-text-input').clear().type(updatedText);
                cy.get('.save-button').click();
            });
            cy.get('.todo-list .todo-item').contains(updatedText).should('exist');
        });
    });

    it('should delete a todo', () => {
        const todoText = 'Todo to be deleted';
        cy.get('todo-app').shadow().within(() => {
            cy.get('#new-todo-input').type(todoText);
            cy.get('#add-todo-button').click();
            cy.get('.todo-list .todo-item').contains(todoText).parent().within(() => {
                cy.get('.delete-button').should('exist').click();
            });
            cy.get('.todo-list .todo-item').contains(todoText).should('not.exist');
        });
    });

    it('should filter todos', () => {
        // Add multiple todos with different statuses
        cy.get('todo-app').shadow().within(() => {
            // Add Completed Todo
            cy.get('#new-todo-input').type('Completed Todo');
            cy.get('#add-todo-button').click();
            cy.get('.todo-list .todo-item').contains('Completed Todo').parent().within(() => {
                cy.get('.complete-checkbox').check();
            });

            // Add Active Todo
            cy.get('#new-todo-input').type('Active Todo');
            cy.get('#add-todo-button').click();
        });

        // Filter by completed
        cy.get('todo-app').shadow().within(() => {
            cy.get('#filter-todos').select('completed');
            cy.get('.todo-list .todo-item').should('have.length', 1);
            cy.get('.todo-list .todo-item').contains('Completed Todo').should('exist');
        });
    });

    it('should sort todos by priority', () => {
        // Add multiple todos with different priorities
        cy.get('todo-app').shadow().within(() => {
            // Add Low Priority Todo
            cy.get('#new-todo-input').type('Low Priority Todo');
            cy.get('#priority-select').select('low');
            cy.get('#add-todo-button').click();

            // Add High Priority Todo
            cy.get('#new-todo-input').type('High Priority Todo');
            cy.get('#priority-select').select('high');
            cy.get('#add-todo-button').click();

            // Add Medium Priority Todo
            cy.get('#new-todo-input').type('Medium Priority Todo');
            cy.get('#priority-select').select('medium');
            cy.get('#add-todo-button').click();

            // Sort by Priority Ascending
            cy.get('#sort-todos').select('priority-asc');
            cy.get('.todo-list .todo-item').then(items => {
                const texts = [...items].map(item => item.querySelector('.todo-text').textContent);
                expect(texts).to.deep.equal([
                    'Low Priority Todo',
                    'Medium Priority Todo',
                    'High Priority Todo' 
                ]);
            });
        });
    });
});
