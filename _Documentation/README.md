
Documentation
-----------------------------


This is some brief documentation to try to describe how things work and the reasoning.




State Management
-----------------------------

To keep the app as simple as possible, we avoided using complicated state management tools like Redux/Mobx. 
We only have a handful of things that need to be shared globally.
To provide global state management, we're sharing a global state from App/Rosnet.js to all components using screenProps.
Using screenProps, we're able to share the state changes to any component that is interested. 
Using screenProps, we are also able to share a common state function that allows any component to affect the shared state.

From any component that receives screenProps, you can call _globalStateChange() that is shared from App/Rosnet.js.
Here is an example of updating userData so that all components can share it. 

this.props.screenProps._globalStateChange( { action: "login", userData: userData })


Instead of using componentWillReceiveProps, we opted to use willFocus, which provides the same benefit without the complexity. With willFocus, the screen will refresh anytime it is used. 


State Objects
-----------------------------

* userData - this is the data that is received from the PC4 API request to login. If login is successful, 
it contains a token and other things specific to the user

* menuItems - this is the data that is received from the PC4 API request for the modules that the user has
access to. 

* selectedClient - this is the site that the user has selected




Session Override (Impersonation)
-----------------------------

When impersonating another user, the react navigation stack is reset so that all off the screens are effectively "closed".
This helps simplify things and allows componentDidMount() to fire again so that we can change the header 
background color to blue/red as appropriate






