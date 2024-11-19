# Task Management System App

![Task Management System](https://via.placeholder.com/800x200.png?text=Task+Management+System)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
  - [Cypress Tests](#cypress-tests)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

The **Task Management System App** is a web-based application designed to help users efficiently manage their tasks and to-do lists. Built with modern web technologies, it offers a seamless user experience with features like task creation, editing, deletion, prioritization, and filtering. The application leverages Web Components for modular and reusable UI components, ensuring scalability and maintainability.

## Features

- **Add Todos:** Create new tasks with optional due dates and priority levels.
- **Edit Todos:** Modify existing tasks, including their text, due dates, and priority.
- **Delete Todos:** Remove tasks that are no longer needed.
- **Mark as Completed:** Toggle the completion status of tasks.
- **Priority Levels:** Assign and sort tasks based on priority (Low, Medium, High).
- **Filtering:** View tasks based on completion status or priority.
- **Sorting:** Organize tasks by added date, due date, or priority.
- **Persistent Storage:** All tasks are stored in a JSON file on the server, ensuring data persistence across sessions.
- **Responsive Design:** Optimized for various screen sizes and devices.
- **Comprehensive Testing:** Automated tests using Cypress to ensure reliability and functionality.

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6)
  - Web Components (Custom Elements, Shadow DOM)
  
- **Backend:**
  - Node.js
  - HTTP Module
  - File System (fs) Module

- **Testing:**
  - Cypress.io

- **Others:**
  - JSON for data storage

## Getting Started

Follow these instructions to set up and run the Task Management System App on your local machine.

### Prerequisites

- **Node.js:** Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **npm:** Comes bundled with Node.js.
- **Cypress:** For running automated tests.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/task-management-system.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd task-management-system
   ```

3. **Install Dependencies:**

   Although this project primarily uses Node.js's built-in modules, it's good practice to initialize npm and install Cypress.

   ```bash
   npm init -y
   npm install cypress --save-dev
   ```

4. **Project Files:**

   Ensure the following key files are present in the project directory:

   - `index.html` - The main HTML file.
   - `todo-app.js` - JavaScript file containing the Web Component.
   - `server.js` - Node.js server handling API requests.
   - `todos.json` - JSON file for storing todos.
   - `cypress/` - Directory containing Cypress tests.

### Running the Application

1. **Start the Server:**

   The server serves both the frontend and handles API requests.

   ```bash
   node server.js
   ```

   By default, the server runs on port `9000`. You can specify a different port by providing it as a command-line argument:

   ```bash
   node server.js 3000
   ```

2. **Access the Application:**

   Open your browser and navigate to [http://localhost:9000](http://localhost:9000) (replace `9000` with your chosen port if different).

## Project Structure

```plaintext
task-management-system/
├── cypress/
│   ├── e2e/
│   │   └── todo.cy.js
│   └── support/
│       └── commands.js
├── node_modules/
├── todos.json
├── index.html
├── todo-app.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

- **cypress/**: Contains all Cypress test files and configurations.
- **todos.json**: Stores all todo items in JSON format.
- **index.html**: The main HTML file that includes the `<todo-app>` web component.
- **todo-app.js**: Defines the `<todo-app>` web component with all its functionalities.
- **server.js**: Node.js server that serves static files and handles API routes.
- **package.json**: Lists project dependencies and scripts.
- **README.md**: Project documentation.

## API Documentation

The backend server provides a RESTful API to manage todos. Below are the available endpoints:

### Base URL

```
http://localhost:9000/api/todos
```

### Endpoints

#### Get All Todos

- **URL:** `/api/todos`
- **Method:** `GET`
- **Description:** Retrieves a list of all todos.
- **Response:**
  - **Status:** `200 OK`
  - **Body:** Array of todo objects.

#### Get a Single Todo

- **URL:** `/api/todos/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific todo by its ID.
- **Parameters:**
  - `id` (integer) - The ID of the todo.
- **Response:**
  - **Status:** `200 OK` if found.
  - **Body:** Todo object.
  - **Status:** `404 Not Found` if the todo does not exist.

#### Create a New Todo

- **URL:** `/api/todos`
- **Method:** `POST`
- **Description:** Creates a new todo.
- **Body:**
  ```json
  {
    "text": "Sample Todo",
    "dueDate": "31/12/2024", // Optional
    "priority": "low" // "low", "medium", or "high"
  }
  ```
- **Response:**
  - **Status:** `201 Created`
  - **Body:** The created todo object.
  - **Status:** `400 Bad Request` if required fields are missing.

#### Update an Existing Todo

- **URL:** `/api/todos/:id`
- **Method:** `PUT`
- **Description:** Updates an existing todo.
- **Parameters:**
  - `id` (integer) - The ID of the todo.
- **Body:** Any of the following fields to update:
  ```json
  {
    "text": "Updated Todo",
    "dueDate": "01/01/2025", // Optional
    "priority": "high", // "low", "medium", or "high"
    "completed": true // boolean
  }
  ```
- **Response:**
  - **Status:** `200 OK` with the updated todo object.
  - **Status:** `404 Not Found` if the todo does not exist.
  - **Status:** `400 Bad Request` if the request body is invalid.

#### Delete a Todo

- **URL:** `/api/todos/:id`
- **Method:** `DELETE`
- **Description:** Deletes a specific todo by its ID.
- **Parameters:**
  - `id` (integer) - The ID of the todo.
- **Response:**
  - **Status:** `200 OK` with the deleted todo object.
  - **Status:** `404 Not Found` if the todo does not exist.

#### Reset Todos (For Testing)

- **URL:** `/api/todos/reset`
- **Method:** `POST`
- **Description:** Clears all todos. Primarily used for testing purposes.
- **Response:**
  - **Status:** `200 OK` with a success message.
  - **Status:** `500 Internal Server Error` if unable to reset.

## Testing

### Cypress Tests

Automated end-to-end tests are implemented using Cypress to ensure the reliability and functionality of the Task Management System App.

#### Running Tests

1. **Install Cypress (If Not Already Installed):**

   ```bash
   npm install cypress --save-dev
   ```

2. **Open Cypress Test Runner:**

   ```bash
   npx cypress open
   ```

3. **Execute Tests:**

   - In the Cypress Test Runner window, click on the `todo.cy.js` file to run the tests.
   - Observe the test results in real-time. All tests should pass, ensuring that all functionalities are working as expected.

#### Test Coverage

The Cypress tests cover the following scenarios:

- **App Load:**
  - Ensures that the application loads correctly and all essential elements are visible.

- **Adding Todos:**
  - Adds new todos without due dates and with default priority.
  - Adds new todos with specified due dates and priority levels.

- **Marking Todos as Completed:**
  - Toggles the completion status of todos and verifies the corresponding UI changes.

- **Editing Todos:**
  - Edits existing todos, including changing their text and priority levels.

- **Deleting Todos:**
  - Deletes todos and ensures they are removed from the list.

- **Filtering and Sorting:**
  - Filters todos based on completion status and priority levels.
  - Sorts todos by added date and priority in both ascending and descending order.

- **Clearing Due Dates:**
  - Clears due dates from todos via editing and using the dedicated clear button.

## Deployment

While this project is set up for local development, you can deploy it to various platforms for broader access. Below are some deployment options:

### Deploying to Heroku

1. **Create a Heroku Account:** If you don't have one, sign up at [Heroku](https://www.heroku.com/).

2. **Install Heroku CLI:**

   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku:**

   ```bash
   heroku login
   ```

4. **Create a New Heroku App:**

   ```bash
   heroku create your-app-name
   ```

5. **Deploy the App:**

   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open the Deployed App:**

   ```bash
   heroku open
   ```

### Deploying to Netlify

1. **Create a Netlify Account:** Sign up at [Netlify](https://www.netlify.com/).

2. **Link Repository:**

   - In the Netlify dashboard, click on "New site from Git".
   - Connect your GitHub repository containing the project.

3. **Configure Build Settings:**

   - Since this is a static site with a Node.js backend, consider using Netlify Functions or another backend service.

4. **Deploy:**

   - Follow Netlify's prompts to complete the deployment.

### Additional Deployment Options

- **Vercel:** Ideal for frontend frameworks and static sites.
- **DigitalOcean:** Offers more control with virtual servers.
- **AWS, Azure, Google Cloud:** For scalable and robust deployments.

## Contributing

Contributions are welcome! If you'd like to enhance the Task Management System App, please follow these steps:

1. **Fork the Repository:**

   Click the "Fork" button at the top-right corner of the repository page.

2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/your-username/task-management-system.git
   cd task-management-system
   ```

3. **Create a New Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes:**

   Implement your feature or bug fix.

5. **Commit Your Changes:**

   ```bash
   git add .
   git commit -m "Add feature: YourFeatureName"
   ```

6. **Push to Your Fork:**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request:**

   Navigate to the original repository and click on "Compare & pull request". Provide a clear description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or suggestions, feel free to reach out:

- **Email:** gax35208@student.gdynia.merito.pl
- **GitHub:** [Filip-Szettel](https://github.com/Filip-Szettel)
- **LinkedIn:** [Filip Szettel](https://www.linkedin.com/in/your-profile)

---

*Developed with ❤️ by Filip Szettel.*