# Space News Web Application

## Overview
The Space News Web Application is a dynamic web application built using Node.js, Express, EJS, and Axios. It fetched the space news from the Spaceflight News API. (https://spaceflightnewsapi.net/). 

## Features
- Home page with a summary of the latest space news.
- Detailed pages for blogs, reports, and articles fetched from the Spaceflight News API.
- Pagination for browsing through lists.
- Using localStorage to handle the Client-side Caching. (Update per hour)
- Error handling for non-existent pages (404) and server errors (500).
- The frontend uses Bootstrap, so it can support the mibile side.


## Getting Started

### Prerequisites
Ensure you have Node.js and npm installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/GaryZLG/SpaceNews.git
   ```
2. Navigate into the project directory:
   ```bash
   cd SpaceNews
   ```
3. Make sure you have install the dependencies:
   ```bash
   npm install axios dayjs ejs express nodemon
   ```
### Running the Application
To start the application, run:
   ```bash
   npm run serve
   ```
This will start the server on `localhost:3000` by default. Open your browser and navigate to `http://localhost:3000` to view the application.

### Running Tests

To run the test suite, execute the following command:
   ```bash
   npm test
   ```

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **EJS**: Templating language for generating HTML markup with JavaScript.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Bootstrap**: Front-end framework for developing responsive and mobile-first websites.
- **Jest**: JavaScript testing framework.


## Acknowledgments

- Thanks to the Spaceflight News API for providing data used in this project.
