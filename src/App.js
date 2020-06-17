import React, { Component } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Login from './components/Login';

const Stack = createStackNavigator();

class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Login'>
                    <Stack.Screen
                        name='Login'
                        component={Login}
                        options={{ title: 'Login' }}
                    />
                    <Stack.Screen
                        name='Home'
                        component={Home}
                        options={{ title: 'Home' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;