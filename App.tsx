// App.tsx
import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ExerciseScreen from './ExerciseScreen'; // Adjust the path as necessary
import ExerciseTrackingScreen from './ExerciseTrackingScreen'; // Adjust the path as necessary
import LandingPage from './LandingPage';
import UserInput from './UserInput';
import Home from './Home';
import Exercises from './Exercise';
import ExerciseDetails from './ExerciseDetails';
const Stack = createStackNavigator();

const App = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen
          options={{headerShown: false}}
          name="LandingPage"
          component={LandingPage}
        />
        <Stack.Screen
          options={{
            title: 'Dashboard',
            headerBackImage: () => <></>,
          }}
          name="Exercise"
          component={ExerciseScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="UserInput"
          component={UserInput}
        />
        <Stack.Screen
          name="ExerciseTracking"
          component={ExerciseTrackingScreen}
          options={{
            title: 'Exercise Tracking',
          }}
          listeners={{
            tabPress: e => {
              // Prevent default behavior
              e.preventDefault();
              navigationRef.reset({
                index: 0,
                routes: [{name: 'LandingPage'}],
              });
            },
          }}
        />
        <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name="Exercises"
        component={Exercises}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetails}
        options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
