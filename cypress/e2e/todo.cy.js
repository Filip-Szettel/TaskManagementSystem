// cypress/e2e/todo.cy.js

describe('Task Management System App', () => {
  const API_URL = 'http://localhost:9000/api/todos';

  // Helper function to delete all existing todos
  const deleteAllTodos = () => {
    cy.request('GET', API_URL).then((response) => {
      expect(response.status).to.eq(200);
      const todos = response.body;
      todos.forEach((todo) => {
        cy.request('DELETE', `${API_URL}/${todo.id}`);
      });
    });
  };

  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');

    // Ensure the backend has no todos before each test
    deleteAllTodos();
  });

  it('Should load the app correctly.', () => {
    // Access elements within the Shadow DOM
    cy.get('todo-app').shadow().within(() => {
      cy.contains('Task Management System').should('be.visible');
      cy.get('#new-todo-input').should('be.visible');
      cy.get('#add-todo-button').should('be.visible');
      cy.get('#due-date-input').should('be.visible');
      cy.get('#priority-select').should('be.visible');
    });
  });

  it('Should add a new todo without a due date and default priority.', () => {
    const todoText = 'Test adding a new todo';
    const defaultPriority = 'Low';

    // Interact within the Shadow DOM
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todoText);
      cy.get('#add-todo-button').click();
    });

    // Verify the todo appears in the list within the Shadow DOM
    cy.get('todo-app').shadow().within(() => {
      cy.get('#todo-list').should('contain', todoText);
      cy.contains(todoText)
        .closest('.todo-item')
        .within(() => {
          cy.get('.due-date').should('not.exist');
          cy.get('.priority-label')
            .should('be.visible')
            .and('have.text', defaultPriority);
        });
    });
  });

  it('Should add a new todo with a due date and specified priority.', () => {
    const todoText = 'Test adding a new todo with due date and priority';
    const dueDate = '2024-12-30'; // Format: YYYY-MM-DD
    const formattedDate = '30/12/2024'; // Expected format in the app
    const priority = 'High';

    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todoText);
      cy.get('#due-date-input').type(dueDate);
      cy.get('#priority-select').select(priority.toLowerCase());
      cy.get('#add-todo-button').click();
    });

    cy.get('todo-app').shadow().within(() => {
      cy.get('#todo-list').should('contain', todoText);
      cy.contains(todoText)
        .closest('.todo-item')
        .within(() => {
          cy.get('.due-date')
            .should('be.visible')
            .and('have.text', formattedDate);
          cy.get('.priority-label')
            .should('be.visible')
            .and('have.text', priority);
        });
    });
  });

  it('Should mark a todo as completed.', () => {
    const todoText = 'Test marking todo as completed.';

    // Add a new todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todoText);
      cy.get('#add-todo-button').click();
    });

    // Mark as complete
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.complete-checkbox')
        .check();
    });

    // Check if the todo has the 'completed' class
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .should('have.class', 'completed');
    });
  });

  it('Should edit an existing todo text and priority.', () => {
    const originalText = 'Original Todo Text';
    const updatedText = 'Updated Todo Text';
    const updatedPriority = 'Medium';

    // Add a new todo with High priority
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(originalText);
      cy.get('#priority-select').select('high');
      cy.get('#add-todo-button').click();
    });

    // Enter Edit Mode
    cy.get('todo-app').shadow().within(() => {
      cy.contains(originalText)
        .closest('.todo-item')
        .find('.edit-button')
        .click();
    });

    // Update the todo text and priority
    cy.get('todo-app').shadow().within(() => {
      cy.contains(originalText)
        .closest('.todo-item')
        .within(() => {
          cy.get('.edit-text-input').clear().type(updatedText);
          cy.get('.edit-priority-select').select(updatedPriority.toLowerCase());
          cy.get('.save-button').click();
        });
    });

    // Verify the updated text and priority label
    cy.get('todo-app').shadow().within(() => {
      cy.contains(updatedText).should('be.visible');
      cy.contains(originalText).should('not.exist');
      cy.contains(updatedText)
        .closest('.todo-item')
        .find('.priority-label')
        .should('be.visible')
        .and('have.text', updatedPriority);
    });
  });

  it('Should delete a todo.', () => {
    const todoText = 'Test deleting a todo';

    // Add a new todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todoText);
      cy.get('#add-todo-button').click();
    });

    // Delete the todo
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.delete-button')
        .click();
    });

    // Confirm the deletion
    cy.on('window:confirm', () => true);

    // Verify the todo is deleted
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText).should('not.exist');
    });
  });

  it('Should filter todos by completed.', () => {
    const todo1 = 'Completed Todo';
    const todo2 = 'Active Todo';

    // Add two todos
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo1);
      cy.get('#add-todo-button').click();

      cy.get('#new-todo-input').type(todo2);
      cy.get('#add-todo-button').click();
    });

    // Mark the first todo as completed
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todo1)
        .closest('.todo-item')
        .find('.complete-checkbox')
        .check();
    });

    // Apply filter "Completed"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#filter-todos').select('completed');
    });

    // Verify only the completed todo is visible
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todo1).should('be.visible');
      cy.contains(todo2).should('not.exist');
    });
  });

  it('Should sort todos by added date descending.', () => {
    const todo1 = 'First Todo';
    const todo2 = 'Second Todo';

    // Add first todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo1);
      cy.get('#add-todo-button').click();
    });

    // Add second todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo2);
      cy.get('#add-todo-button').click();
    });

    // Apply sort "Added Date (Desc)"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#sort-todos').select('added-date-desc');
    });

    // Verify the order
    cy.get('todo-app').shadow().within(() => {
      cy.get('#todo-list .todo-item').eq(0).should('contain', todo2);
      cy.get('#todo-list .todo-item').eq(1).should('contain', todo1);
    });
  });

  it('Should sort todos by priority ascending (Low to High).', () => {
    const todo1 = 'Low Priority Todo';
    const todo2 = 'High Priority Todo';
    const todo3 = 'Medium Priority Todo';

    // Add Low priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo1);
      cy.get('#priority-select').select('low');
      cy.get('#add-todo-button').click();
    });

    // Add High priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo2);
      cy.get('#priority-select').select('high');
      cy.get('#add-todo-button').click();
    });

    // Add Medium priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo3);
      cy.get('#priority-select').select('medium');
      cy.get('#add-todo-button').click();
    });

    // Apply sort "Priority (Low to High)"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#sort-todos').select('priority-asc');
    });

    // Verify the order: Low, Medium, High
    cy.get('todo-app').shadow().within(() => {
      cy.get('#todo-list .todo-item').eq(0).should('contain', todo1);
      cy.get('#todo-list .todo-item').eq(1).should('contain', todo3);
      cy.get('#todo-list .todo-item').eq(2).should('contain', todo2);
    });
  });

  it('Should sort todos by priority descending (High to Low).', () => {
    const todo1 = 'Low Priority Todo';
    const todo2 = 'High Priority Todo';
    const todo3 = 'Medium Priority Todo';

    // Add Low priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo1);
      cy.get('#priority-select').select('low');
      cy.get('#add-todo-button').click();
    });

    // Add High priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo2);
      cy.get('#priority-select').select('high');
      cy.get('#add-todo-button').click();
    });

    // Add Medium priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo3);
      cy.get('#priority-select').select('medium');
      cy.get('#add-todo-button').click();
    });

    // Apply sort "Priority (High to Low)"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#sort-todos').select('priority-desc');
    });

    // Verify the order: High, Medium, Low
    cy.get('todo-app').shadow().within(() => {
      cy.get('#todo-list .todo-item').eq(0).should('contain', todo2);
      cy.get('#todo-list .todo-item').eq(1).should('contain', todo3);
      cy.get('#todo-list .todo-item').eq(2).should('contain', todo1);
    });
  });

  it('Should filter todos by priority.', () => {
    const todo1 = 'High Priority Todo';
    const todo2 = 'Medium Priority Todo';
    const todo3 = 'Low Priority Todo';

    // Add High priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo1);
      cy.get('#priority-select').select('high');
      cy.get('#add-todo-button').click();
    });

    // Add Medium priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo2);
      cy.get('#priority-select').select('medium');
      cy.get('#add-todo-button').click();
    });

    // Add Low priority todo
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todo3);
      cy.get('#priority-select').select('low');
      cy.get('#add-todo-button').click();
    });

    // Apply filter "High Priority"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#filter-todos').select('high-priority');
    });

    // Verify only High priority todo is visible
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todo1).should('be.visible');
      cy.contains(todo2).should('not.exist');
      cy.contains(todo3).should('not.exist');
    });

    // Apply filter "Medium Priority"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#filter-todos').select('medium-priority');
    });

    // Verify only Medium priority todo is visible
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todo1).should('not.exist');
      cy.contains(todo2).should('be.visible');
      cy.contains(todo3).should('not.exist');
    });

    // Apply filter "Low Priority"
    cy.get('todo-app').shadow().within(() => {
      cy.get('#filter-todos').select('low-priority');
    });

    // Verify only Low priority todo is visible
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todo1).should('not.exist');
      cy.contains(todo2).should('not.exist');
      cy.contains(todo3).should('be.visible');
    });
  });

  it('Should clear due date from a todo by editing.', () => {
    const todoText = 'Todo with due date to clear';
    const dueDate = '2024-12-31'; // Format: YYYY-MM-DD
    const formattedDate = '31/12/2024'; // Expected format in the app

    // Add a new todo with due date and High priority
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todoText);
      cy.get('#due-date-input').type(dueDate);
      cy.get('#priority-select').select('high');
      cy.get('#add-todo-button').click();
    });

    // Verify due date is set
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.due-date')
        .should('be.visible')
        .and('have.text', formattedDate);
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.priority-label')
        .should('be.visible')
        .and('have.text', 'High');
    });

    // Enter Edit Mode
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.edit-button')
        .click();
    });

    // Clear the due date and save changes
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .within(() => {
          cy.get('.edit-due-date-input').clear();
          cy.get('.save-button').click();
        });
    });

    // Verify the due date is cleared
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.due-date')
        .should('not.exist');
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.priority-label')
        .should('have.text', 'High');
    });
  });

  it('Should clear due date from a todo using the Clear Due Date button.', () => {
    const todoText = 'Todo with due date to clear via button';
    const dueDate = '2024-12-31'; // Format: YYYY-MM-DD
    const formattedDate = '31/12/2024'; // Expected format in the app

    // Add a new todo with due date and Medium priority
    cy.get('todo-app').shadow().within(() => {
      cy.get('#new-todo-input').type(todoText);
      cy.get('#due-date-input').type(dueDate);
      cy.get('#priority-select').select('medium');
      cy.get('#add-todo-button').click();
    });

    // Verify due date is set
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.due-date')
        .should('be.visible')
        .and('have.text', formattedDate);
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.priority-label')
        .should('be.visible')
        .and('have.text', 'Medium');
    });

    // Click the Clear Due Date button
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.clear-due-date-button')
        .click();
    });

    // Verify the due date is cleared
    cy.get('todo-app').shadow().within(() => {
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.due-date')
        .should('not.exist');
      cy.contains(todoText)
        .closest('.todo-item')
        .find('.priority-label')
        .should('have.text', 'Medium');
    });
  });
});
