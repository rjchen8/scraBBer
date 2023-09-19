# scraBBer

scraBBer is a single page fullstack MERN app bootstrapped with Vite in replacement of Create React App used to track the availability of products on a shopping site.
To run app in development:

Create .env file in ```backend``` folder and add a MongoDB Atlas URI to connect (i.e. ```mongodb+srv://<username>:<password>@banana-apple.blueberry.mongodb.net/?retryWrites=true&w=majority```).
Call this variable ```URI``` in the .env file.

Add ```PORT``` variable to same .env file, frontend is designed to make calls to the backend to ```localhost:1337```, however this can be easily changed by modifying the ```App.jsx``` file.

To start frontend beginning from scraper filepath: ```cd frontend``` -> ```npm run dev```
To start backend beginning from scraper filepath: ```cd backend``` -> ```npm start```

<img src="https://i.imgur.com/4GnqCiu.png">
