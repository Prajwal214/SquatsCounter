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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
