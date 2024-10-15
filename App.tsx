// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ExerciseScreen from './ExerciseScreen'; // Adjust the path as necessary
import ExerciseTrackingScreen from './ExerciseTrackingScreen'; // Adjust the path as necessary
import LandingPage from './LandingPage';
import UserInput from './UserInput';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="UserInput" component={UserInput} />
        <Stack.Screen
          name="ExerciseTracking"
          component={ExerciseTrackingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
