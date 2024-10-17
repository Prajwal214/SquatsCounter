// ExerciseScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import FloatingButton from './components/FloatingButton';

const exercises = [
  {name: 'Squats', icon: require('./assets/squats.png')},
  {name: 'Push-ups', icon: require('./assets/pushups.png')},
  {name: 'Planks', icon: require('./assets/planks.png')},
  {name: 'Lunges', icon: require('./assets/lunge.png')},
];

const ExerciseScreen = () => {
  const navigation = useNavigation();
  const [currentWorkout, setCurrentWorkout] = React.useState({});
  const [fullWorkout, setFullWorkout] = React.useState([]);


  const setWorkoutData = async () => {
    let CurrentWork = null;
    const localStorageData = await AsyncStorage.getItem('workout');
    const parsedData = JSON.parse(localStorageData);
    if (parsedData) {
      CurrentWorkout = parsedData.find(obj => obj.isComplete === false);
      setCurrentWorkout(CurrentWorkout);
      setFullWorkout(parsedData);
    }
  };

  React.useEffect(() => {
    setWorkoutData();
  }, []);

  return (
    <SafeAreaView>
    <ScrollView>
      {currentWorkout && (
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
                <View style={styles.searchSection}>
              <View>
            <Icon style={styles.searchIcon} name="pencil" size={20} color="#000"/>
            </View>
    <TextInput
   keyboardType="numeric"
   onChangeText={(text)=> setCurrentWorkout({...currentWorkout,[exercise.name]: text})}
   value={String(currentWorkout[exercise.name])}
   defaultValue={currentWorkout[exercise.name] }
   maxLength={10}  //setting limit of input
   style={styles.input}
/>
</View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ExerciseTracking', {
                exercise: 'Squats',
                initialExerciseIndex: 0,
                currentWorkout: currentWorkout,
              })
            }
            style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Future workouts and progress</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}>
            {fullWorkout.map((workout, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  workout.isComplete
                    ? styles.buttonComplete
                    : styles.buttonIncomplete,
                ]}
                onPress={() => {
                  /* Handle button press, e.g., navigate to details */
                }}>
                <Text style={styles.buttonText}>
                  <Text style={styles.exerciseName}>Day {index}</Text>
                  {'\n'}
                  Squats: {workout.Squats} {'\n'}
                  Push-ups: {workout['Push-ups']} {'\n'}
                  Planks: {workout.Planks} {'\n'}
                  Lunges: {workout.Lunges}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
    <FloatingButton
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('Home')}
      />
    </SafeAreaView>
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
  scrollView: {
    padding: 10,
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    width: 120, // Set width for uniformity
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonComplete: {
    borderColor: 'green',
    backgroundColor: 'lightgreen',
  },
  buttonIncomplete: {
    borderColor: 'red',
    backgroundColor: 'lightcoral',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: 'rgb(244 63 94)', // Change this to customize button color
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 10, // Adjust to control the button's distance from the bottom
    marginBottom: 10, // Adjust to control the button's distance from the bottom
    alignSelf: 'center', // Centers the button horizontally
    borderRadius: 10,
  },
  startButtonText: {
    color: '#fff', // White text color for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
},
floatingBtn: {
  position: 'absolute',
  bottom: 10,
  right: 10,
},
});

export default ExerciseScreen;
