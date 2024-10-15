// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExerciseScreen from './ExerciseScreen'; // Adjust the path as necessary
import ExerciseTrackingScreen from './ExerciseTrackingScreen'; // Adjust the path as necessary

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Exercise">
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="ExerciseTracking" component={ExerciseTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

