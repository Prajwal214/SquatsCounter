// ExerciseScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const exercises = [
  { name: 'Squats', icon: require('./assets/squats.png') },
  { name: 'Push-ups', icon: require('./assets/pushups.png') },
  { name: 'Planks', icon: require('./assets/planks.png') },
  { name: 'Jumping Jacks', icon: require('./assets/jumpingjacks.png') },
  { name: 'Lunges', icon: require('./assets/lunges.png') },
  { name: 'Burpees', icon: require('./assets/burpees.png') },
  { name: 'Sit-ups', icon: require('./assets/situps.png') },
  { name: 'Mountain Climbers', icon: require('./assets/mountainclimbers.png') },
];

const ExerciseScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select an Exercise</Text>
      <View style={styles.grid}>
        {exercises.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            onPress={() => navigation.navigate('ExerciseTracking', { exercise: exercise.name })}
          >
            <Image source={exercise.icon} style={styles.icon} />
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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

