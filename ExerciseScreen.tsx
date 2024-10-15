// ExerciseScreen.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const exercises = [
  {name: 'Squats', icon: require('./assets/squats.png')},
  {name: 'Push-ups', icon: require('./assets/pushups.png')},
  {name: 'Planks', icon: require('./assets/planks.png')},
  {name: 'Lunges', icon: require('./assets/lunges.png')},
];

const ExerciseScreen = () => {
  const navigation = useNavigation();
  const [currentWorkout, setCurrentWorkout] = React.useState(null);
  const [fullWorkout, setFullWorkout] = React.useState([]);

  const setWorkoutData = async() => {
    let CurrentWork = null;
    const localStorageData = await AsyncStorage.getItem('workout');
    const parsedData = JSON.parse(localStorageData);
    if (parsedData) {
      CurrentWorkout = parsedData.find((obj)=> obj.isComplete === false);
      setCurrentWorkout(CurrentWorkout);
      setFullWorkout(parsedData);
    }

  };

  React.useEffect(() => {
    setWorkoutData();
  });

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.header}>Start todays Exercise</Text>
      <View style={styles.grid}>
        {exercises.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            // onPress={() =>
            //   navigation.navigate('ExerciseTracking', {
            //     exercise: exercise.name,
            //     initialExerciseIndex: index,
            //   })
            // }>
            >
            <Image source={exercise.icon} style={styles.icon} />
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseName}>{ currentWorkout ? currentWorkout[exercise.name] : 10}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button onPress={() =>  navigation.navigate('ExerciseTracking', {exercise: 'Squats',initialExerciseIndex: 0})} title="Start" />
      <Text style={styles.header}>Future workouts and progress</Text>
<View style={styles.grid} >{fullWorkout?.map((workout,index)=>{
  return <View>
    <Text style={styles.exerciseName}>Day {index}</Text>
    <Text>{JSON.stringify(workout)}</Text>
  </View>;
})}</View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#eaeaea', // Light background for contrast
  },
  header: {
    fontSize: 28, // Increased header size for better visibility
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker text for contrast
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tile: {
    width: '40%', // Adjust the width of the tiles for better fit
    margin: 10,
    padding: 10,
    borderRadius: 12, // Slightly rounded corners
    backgroundColor: '#ffffff', // White background for tiles
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    width: 70, // Adjust the size of the icons for better visibility
    height: 70,
    marginBottom: 10,
    resizeMode: 'contain', // Ensures the icon maintains its aspect ratio
  },
  exerciseName: {
    textAlign: 'center',
    fontSize: 18, // Increased text size for better readability
    color: '#555', // Slightly lighter text for aesthetics
  },
});

export default ExerciseScreen;
