
Documentation
-----------------------------



State Management
-----------------------------

To keep the app as simple as possible, we avoided using complicated state management tools like Redux/Mobx. 
We only have a handful of things that need to be shared globally.
To provide global state management, we're sharing a global state from App-Rosnet.js to all components using screenProps.
Using screenProps, we're able to broadcast state changes to any component that is interested. 
Using screenProps, we are also able to share a common state function that allows any component to affect the shared state.


State Objects
-----------------------------

* userData - this is the data that is received from the PC4 API request to login. If login is successful, 
it contains a token and other things specific to the user

* menuItems - this is the data that is received from the PC4 API request for the modules that the user has
access to. 

* selectedClient - this is the site that the user has selected

* favorites - this is a list of favorite modules the user has selected


Background Processes
-----------------------------




