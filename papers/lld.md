--- 
title: Nextflix Low-level Design
geometry: a4paper,margin=2.5cm
---

# Nextflix Low-level Design

Revision 1.0 - Date 5/4/2023

## Table of Contents

- [Nextflix Low-level Design](#nextflix-low-level-design)
    - [Table of Contents](#table-of-contents)
    - [1. Introduction](#1-introduction)
    - [2. System Architecture](#2-system-architecture)
        - [Frontend Layer](#frontend-layer)
        - [Database Layer](#database-layer)
        - [Backend Layer](#backend-layer)
    - [3. Backend Design](#3-backend-design)
        - [Express.js Framework](#expressjs-framework)
        - [API Endpoints](#api-endpoints)
        - [Database Interaction](#database-interaction)
    - [4. Frontend Design](#4-frontend-design)
        - [Next.js Framework](#nextjs-framework)
        - [React Components](#react-components)
        - [Data Flow](#data-flow)
        - [User Interface Design](#user-interface-design)
            - [Application screens](#application-screens)
        - [Scalability and Performance Considerations](#scalability-and-performance-considerations)
    - [5. User Authentication and Authorization](#5-user-authentication-and-authorization)
        - [User Authentication](#user-authentication)
    - [6. Data Storage and Management](#6-data-storage-and-management)
        - [Relational Database Management System](#relational-database-management-system)
        - [Database Schema](#database-schema)
        - [Data Retrieval](#data-retrieval)
    - [9. Future Enhancements](#9-future-enhancements)
- [10. Conclusion](#10-conclusion)

## 1. Introduction

The purpose of this low-level design document is to outline the architecture and key components of Nextflix. The goal of this project is to create a full-stack web application that mimics the popular streaming platform Netflix. The application will be written in TypeScript, using Express.js for the backend, MySQL for the database management system, and Next.js for the frontend.

Nextflix aims to provide users with a seamless and enjoyable media discovery experience, allowing them to browse and search a wide range of movies and TV shows. The application will incorporate features such as user authentication, copyright holder records, region-based media availability, and the ability to create and manage watchlists.

By building Nextflix, we aim to demonstrate our understanding of full-stack web development, including frontend and backend technologies, data storage and retrieval, user authentication, and user interface design. This project will allow us to apply our knowledge of TypeScript, Express.js, Database management systems, and Next.js in a practical context while simulating the development of a real-world web application.

The successful completion of this project will not only demonstrate our technical skills but also enhance our understanding of the complexities involved in developing a realistic feature-rich web application.

## 2. System Architecture

Nextflix follows a client-server architecture, where the frontend and backend components interact to provide a seamless authentication and browsing experience. The architecture consists of three main layers: the frontend layer, the backend layer, and the database layer.

### Frontend Layer

The frontend layer of the application is built using Next.js with the new App Router and React server components. Next.js is a React framework that enables server-side rendering and provides an efficient development environment. React is used for building reusable UI components and managing the application's state. The frontend layer is responsible for presenting the user interface to the viewers, allowing them to browse movies and TV shows by trending, top rated or search.

The client-server communication between the frontend and backend layers is established using HTTP protocols. API endpoints are defined on the backend to enable the frontend layer to make HTTP requests and receive responses in JSON format.

### Database Layer

The database layer utilizes MySQL, a widely used relational database management system (RDBMS). MySQL stores and manages structured data required by the Nextflix application. It stores information such as user profiles, media details, copyright details, copyright-holder-to-media relationships, and authentication credentials.

### Backend Layer

The backend layer of the application is developed using Express.js, a popular web application framework for Node.js. Express.js provides a robust set of tools and middleware to handle HTTP requests, routing, and server-side logic. It acts as the intermediary between the frontend layer and the database layer, processing user requests, performing necessary operations on the data, and returning appropriate responses to the client.

The backend layer implements RESTful API endpoints to support the different functionalities of Nextflix. These endpoints handle media search and media details retrieval, and user authentication and session expiry. The backend layer interacts with the database layer to fetch and store data.

The backend layer communicates with the database through SQL-native prepared statements.

Overall, the system architecture ensures a clear separation of concerns, with the frontend layer handling the user interface and the backend layer managing the business logic and data processing. The database layer serves as the central repository for storing and retrieving application data. By following this system architecture, Nextflix will be structured in a modular and scalable manner, allowing for easy maintenance, extensibility, and efficient data management.

## 3. Backend Design

### Express.js Framework

Express.js is chosen as the backend framework due to its simplicity, scalability, and wide adoption in the Node.js ecosystem. It allows us to define routes, handle middleware, and implement business logic in a clean and modular manner.

### API Endpoints

The backend exposes several RESTful API endpoints to support different functionalities of Nextflix. These endpoints are responsible for handling various operations such as user authentication, searching the media and fetching media data.

- User Authentication Endpoints: These endpoints handle user registration and login. They ensure the creation of secure, stateless user sessions using http-only token-based authentication. User authentication endpoints to be implemented are:
    - `POST /api/auth/signup`: Creates a new user account and returns JWT access and refresh tokens.
    - `POST /api/auth/login`: Authenticates a user and returns a JWT access token.
    - `POST /api/auth/discord`: Authenticates a user using Discord OAuth strategy and returns a JWT access token.
    - `POST /api/auth/google`: Authenticates a user using Google OAuth strategy and returns a JWT access token.
    - `POST /api/auth/refresh`: Refreshes a user's access token using their refresh token.

- Media Endpoints: These endpoints facilitate the retrieval of media, including details, ratings, and other relevant information. They support functionalities like browsing media by trending and top-rated as well as searching for specific media. They rely on the auth layer to ensure that only authenticated users can access the data layer to fetch media from the database and that the media is filtered by availability in each user's region. Media search includes advanced filters such as sorting movies by popularity or user ratings.

    Media searching endpoints:
    - `GET /api/media/tv/trending`: Returns a page of trending TV shows.
    - `GET /api/media/tv/top`: Returns a page of top-rated TV shows.
    - `GET /api/media/movie/trending`: Returns a page of trending movies.
    - `GET /api/media/movie/top`: Returns a page of top-rated movies.
    - `GET /api/media/all/trending`: Returns a page of movies and TV shows ordered by popularity.
    - `GET /api/media/all/top`: Returns a page of movies and TV shows ordered by rating.
    - `GET /api/media/all`: Returns a page of movies and TV shows ordered by the default database order, meant to be used with a `?search` query parameter to find media by name.
  
    Query parameters for media searching endpoints:
    - `search : string`: The search query to filter results by.
    - `details : boolean`: Whether to include detailed information about each media item.
    - `order : "asc" | "desc"`: Whether to sort the results ascendingly or descendingly.
    - `cursor : int`: The cursor to use for pagination.
    - `limit : int`: The maximum number of results to return.

    Media details endpoint:
    - `GET /api/details/:ids`: Returns detailed information about one or more media items given a comma separated list of their ids.

    User management endpoints:
    - `GET /api/user`: Returns the currently authenticated user's profile.
    - `PUT /api/user`: Updates the currently authenticated user's profile.

### Database Interaction

The backend interacts with the MySQL database to store and retrieve data. The backend layer uses node-mysql2 to communicate with the database using SQL. It fetches media data and user profiles to fulfill and filter user requests.

The backend incorporates appropriate database access techniques to ensure data integrity, security, and efficient data retrieval. Techniques like query parameterization and prepared statements are used to prevent SQL injection attacks.

## 4. Frontend Design

### Next.js Framework

Next.js is chosen as the frontend framework due to its excellent support for server-side rendering, which enhances performance and improves search engine optimization. It also provides its own caching and cache invalidation strategies, as well as efficient routing, code splitting, and hot reloading which result in a smoother development experience.

### React Components

The frontend is built using React components, which are modular units of UI that encapsulate functionality and present the user interface. The components are structured hierarchically to compose complex UI screens. Some key components in Nextflix frontend may include

- Navigation Bar: Provides navigation options for browsing different sections of the application, such as the home page, user profile, and movie details.
- Media List: Displays a list of movies or TV shows, allowing users to browse and filter based on genres, release dates, and other criteria.
- Media Details: Presents detailed information about a specific movie or TV show, including synopsis, cast, ratings, and related recommendations.
- Media Row: Displays a horizontal list of media suggestions as a preview of every browsing category.

### Data Flow

The frontend communicates with the backend through RESTful API endpoints to fetch data required for rendering UI components. Upon receiving responses from the backend, the frontend updates its state and re-renders the components accordingly.

The frontend manages application state using React hooks. This allows for efficient handling of user interactions, component updates, and seamless data synchronization with the backend.

### User Interface Design

The user interface design of Nextflix should follow modern and intuitive principles. It will incorporate a visually appealing layout with easy-to-use navigation, clear information display, and interactive elements. The design aims to provide a seamless and engaging user experience.

Responsive design techniques are utilized to ensure the application is accessible and works well on different devices and screen sizes. The Tailwind CSS framework is employed to expedite the UI development process and maintain a consistent design system.

#### Application screens

- Home Page: The home page displays two lists of trending movies and TV shows each, as well as a hero banner that displays media items randomly selected from the most trending media.
- Sign Up: The sign-up page displays a form that allows users to create a new account.
- Sign In: The sign-in page displays a form that allows users to sign in to their accounts.
- Trending: The trending page displays a grid of trending movies and TV shows and a page navigation component that switches pages and queries the backend for more media entries to display.
- Movies: The movies page is a variant of the home page that's dedicated only to movies, it displays a hero banner and two lists of trending and top-rated movies, these lists can be clicked to switch to full dedicated pages for only trending and top-rated movies
- TV Shows: The TV shows page is a variant of the home page that's dedicated only to TV shows, it displays a hero banner and two lists of trending and top-rated TV shows, these lists can be clicked to switch to full dedicated pages for only trending and top-rated TV shows
- Media Search: The media search page displays a grid of movies and TV shows that match the user's search query, it contains a filter toggle that switches search order between "relevant", "trending" and "top-rated". It also displays the page navigation component.
- My Watchlist: The watchlist page displays a grid of movies and TV shows that the user has added to their watchlist and the page navigation component.
- Media Details: The media details page displays detailed information about a specific movie or TV show, including synopsis, cast, and ratings.
- Account page: The account page displays the user's profile information and a logout prompt.

### Scalability and Performance Considerations

To ensure the backend can handle increased load and maintain optimal performance, caching mechanisms provided by Next.js are used to decrease the frequency of data fetching from the backend.

## 5. User Authentication and Authorization

User authentication and authorization play a crucial role in Nextflix, ensuring secure access to user accounts and protecting sensitive data. This section outlines the mechanisms employed for user authentication and authorization.

### User Authentication

User authentication is the process of verifying the identity of users accessing the application. Nextflix utilizes jwt-based authentication to manage user sessions and authenticate subsequent requests. When users log in, they receive a JSON Web Token (JWT) that is included in the headers of subsequent API requests. The backend verifies the token's authenticity and authorizes the user's access to protected resources. The token is stored in an http-only cookie to prevent cross-site scripting (XSS) attacks. The token is also signed using a secret key to prevent tampering. The token is set to expire after a certain period, requiring users to log in again to obtain a new token, this ensures that user sessions are short-lived and secure. The backend also implements a refresh token mechanism to allow users with no suspicious behavior to obtain a new token without having to log in again.

The authentication flow is as follows:  

- Registration: Users create new accounts by providing necessary information, such as username, email, and password. During registration, password hashing is used to securely store user credentials.
- Login: Registered users can log in using their credentials, which are validated against stored hashed passwords. Upon successful authentication, a unique access token is generated and sent to the client, enabling subsequent authorized requests, and a refresh token is stored in the database.
- Token-Based Authentication: Token-based authentication is employed to manage user sessions. When users log in, they receive an authentication token that is included in the headers of subsequent API requests. The backend verifies the token's authenticity and authorizes the user's access to protected resources. 

By implementing robust user authentication and authorization mechanisms, Nextflix ensures that only authorized users can access and search the media and that session data can always be used to filter the media by availablity per user region, protecting user accounts and providing a copyright-compliant browsing experience.

## 6. Data Storage and Management

Data storage and management are essential aspects of Nextflix. This section outlines the approach taken for storing and managing data within the application.

### Relational Database Management System

Nextflix utilizes MySQL as the relational database management system (RDBMS) to store and manage structured data. MySQL offers a robust and scalable solution for handling relational data, which aligns well with the requirements of the application.

### Database Schema
![Database Schema](./assets/eer.drawio.svg)  
The database schema is designed to capture the necessary entities and relationships within Nextflix. The schema consists of various tables representing entities such as users, regions, media, genres and media production companies.

### Data Retrieval

The backend interacts with the MySQL database to retrieve relevant data based on user requests. SQL queries are used to fetch media, user profiles, and other necessary information. The data is then transformed into appropriate formats and returned to the frontend for rendering.

## 9. Future Enhancements

While the current design and implementation of Nextflix provide a solid foundation, there are several potential areas for future enhancements and feature additions. These enhancements can further improve the functionality, performance, and user experience of the application. Some potential future enhancements include

1. User Recommendations:  
    Implement a personalized recommendation engine that analyzes user preferences, viewing history, and ratings to provide customized movie and TV show recommendations. This feature can enhance user engagement and provide a more tailored streaming experience.

2. Social Interactions:  
    Introduce social features that allow users to connect with friends, share their favorite movies, and see what their friends are watching. Implement features like following other users, liking and commenting on movies, and creating watch parties to enhance the social aspect of the application.

3. Advanced Search and Filtering:  
    Enhance the search functionality, maybe by using full-text search, to include advanced filters like filtering by actors, directors, or specific keywords within movie descriptions.

4. Multiple Language Support:  
    Provide support for multiple languages, allowing users to access the application in their preferred language. This can involve translating the user interface, movie metadata, and subtitles into different languages to cater to a broader audience.

# 10. Conclusion  

The low-level design of Nextflix provides an overview of the system architecture, backend design, frontend implementation, user authentication and authorization, data storage and management, and potential future enhancements. This design document serves as a roadmap for the development the application, outlining the key components and technologies involved.

The chosen technologies, including TypeScript, Express.js, MySQL, and Next.js, offer a robust and scalable foundation for building a full-stack web application. The use of TypeScript ensures enhanced development productivity, while Express.js provides a lightweight and efficient backend framework. MySQL serves as a reliable and scalable database management system, and Next.js enables server-side rendering and a smooth user experience on the frontend.

By following the low-level design outlined in this document and considering the potential future enhancements, Nextflix can provide a compelling media browsing experience for users, offering a wide range of movies and TV shows, seamless user interactions, and robust data management.
