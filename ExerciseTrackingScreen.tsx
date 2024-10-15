import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
} from 'react-native';
import HumanPose from 'react-native-human-pose'; // Ensure this library is correctly installed
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const exercises = [
  {name: 'Squats', icon: require('./assets/squats.png')},
  {name: 'Push-ups', icon: require('./assets/pushups.png')},
  {name: 'Planks', icon: require('./assets/planks.png')},
  {name: 'Lunges', icon: require('./assets/lunges.png')},
];
const ExerciseTrackingScreen = ({route}) => {
  const {initialExerciseIndex = 0} = route.params || {};

  const {exercise, currentWorkout} = route.params; // Get the selected exercise from the previous screen
  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(initialExerciseIndex);
  console.log('currentWorkout', currentWorkout);
  const [noOfSquats, setNoOfSquats] = useState(0);
  const [noOfPushups, setNoOfPushups] = useState(0);
  const [noOfLunges, setNoOfLunges] = useState(0);

  const [hasSit, setHasSit] = useState(false);
  const [hasStand, setHasStand] = useState(false);
  const navigation = useNavigation();
  const [timer, setTimer] = useState(0);
  const [isPlanking, setIsPlanking] = useState(false);
  const currentExercise = exercises[currentExerciseIndex].name;
  const setWorkoutData = async () => {
    try {
      const localStorageData = await AsyncStorage.getItem('workout');
      const parsedData = JSON.parse(localStorageData);

      if (parsedData) {
        // Find the index of the first incomplete workout
        const currentWorkoutDataIndex = parsedData.findIndex(
          obj => obj.isComplete === false,
        );
        // If there's an incomplete workout, update its isComplete property
        if (currentWorkoutDataIndex !== -1) {
          parsedData[currentWorkoutDataIndex].isComplete = true; // Mark as complete
          console.log(
            'Updated CurrentWorkout:',
            parsedData[currentWorkoutDataIndex],
          );

          // Save the updated workout data back to AsyncStorage
          await AsyncStorage.setItem('workout', JSON.stringify(parsedData));
        }
      }
    } catch (error) {
      console.error('Error updating workout data:', error);
    }
  };

  useEffect(() => {
    let interval;
    if (isPlanking) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!isPlanking && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlanking]);

  useEffect(() => {
    setNoOfPushups(prev => (hasStand ? prev + 1 : prev));
  }, [hasStand]);

  useEffect(() => {
    setNoOfLunges(prev => (hasStand ? prev + 1 : prev));
  }, [hasStand]);

  const onPoseDetected = pose => {
    switch (exercise) {
      case 'Squats':
        handleSquats(pose);
        break;

      case 'Push-ups':
        handlePushups(pose);
        break;

      case 'Lunges':
        handleLunges(pose);
        break;

      case 'Planks':
        handlePlanks(pose);
        break;

      default:
        console.warn(`Unknown exercise: ${exercise}`);
        break;
    }
  };

  // Separate functions for each exercise
  const handleSquats = pose => {
    const leftHipY = pose[0]?.pose?.leftHip?.y;
    const leftAnkleY = pose[0]?.pose?.leftAnkle?.y;

    if (
      pose[0]?.pose?.leftHip?.confidence > 0.5 &&
      pose[0]?.pose?.leftAnkle?.confidence > 0.5
    ) {
      if (Math.abs(leftHipY - leftAnkleY) < 400) {
        setHasSit(true);
        setHasStand(false);
      }
      if (hasSit && Math.abs(leftHipY - leftAnkleY) > 400) {
        setHasStand(true);
        setHasSit(false);
      }
    }
  };

  const handlePushups = pose => {
    const leftWristY = pose[0]?.pose?.leftWrist?.y;
    const rightWristY = pose[0]?.pose?.rightWrist?.y;
    const leftShoulderY = pose[0]?.pose?.leftShoulder?.y;
    const rightShoulderY = pose[0]?.pose?.rightShoulder?.y;

    if (
      pose[0]?.pose?.leftWrist?.confidence > 0.5 &&
      pose[0]?.pose?.rightWrist?.confidence > 0.5 &&
      pose[0]?.pose?.leftShoulder?.confidence > 0.5 &&
      pose[0]?.pose?.rightShoulder?.confidence > 0.5
    ) {
      if (
        Math.abs(leftWristY - leftShoulderY) < 150 &&
        Math.abs(rightWristY - rightShoulderY) < 150
      ) {
        setHasSit(true);
        setHasStand(false);
      }
      if (
        hasSit &&
        Math.abs(leftWristY - leftShoulderY) > 200 &&
        Math.abs(rightWristY - rightShoulderY) > 200
      ) {
        setHasStand(true);
        setHasSit(false);
      }
    }
  };

  const handleLunges = pose => {
    const leftKneeY = pose[0]?.pose?.leftKnee?.y;
    const rightKneeY = pose[0]?.pose?.rightKnee?.y;
    const leftHipY = pose[0]?.pose?.leftHip?.y;
    const rightHipY = pose[0]?.pose?.rightHip?.y;

    if (
      pose[0]?.pose?.leftKnee?.confidence > 0.5 &&
      pose[0]?.pose?.rightKnee?.confidence > 0.5 &&
      pose[0]?.pose?.leftHip?.confidence > 0.5 &&
      pose[0]?.pose?.rightHip?.confidence > 0.5
    ) {
      if (
        Math.abs(leftKneeY - leftHipY) < 300 &&
        Math.abs(rightKneeY - rightHipY) < 300
      ) {
        setHasSit(true);
        setHasStand(false);
      }
      if (
        hasSit &&
        Math.abs(leftKneeY - leftHipY) > 300 &&
        Math.abs(rightKneeY - rightHipY) > 300
      ) {
        setHasStand(true);
        setHasSit(false);
      }
    }
  };

  const handlePlanks = pose => {
    const leftShoulderY = pose[0]?.pose?.leftShoulder?.y;
    const rightShoulderY = pose[0]?.pose?.rightShoulder?.y;
    const leftAnkleY = pose[0]?.pose?.leftAnkle?.y;
    const rightAnkleY = pose[0]?.pose?.rightAnkle?.y;

    if (
      pose[0]?.pose?.leftShoulder?.confidence > 0.5 &&
      pose[0]?.pose?.rightShoulder?.confidence > 0.5 &&
      pose[0]?.pose?.leftAnkle?.confidence > 0.5 &&
      pose[0]?.pose?.rightAnkle?.confidence > 0.5
    ) {
      if (
        Math.abs(leftShoulderY - leftAnkleY) < 150 &&
        Math.abs(rightShoulderY - rightAnkleY) < 150
      ) {
        setIsPlanking(true);
      } else {
        setIsPlanking(false);
      }
    }
  };

  // const onPoseDetected = (pose) => {
  //   // leftHip = 11
  //   // leftAnkle = 15
  //   if (
  //     pose[0]?.pose?.leftHip?.confidence > 0.5 &&
  //     pose[0]?.pose?.leftAnkle?.confidence > 0.5
  //   ) {
  //     if (
  //       Math.abs(pose[0]?.pose?.leftHip?.y - pose[0]?.pose?.leftAnkle?.y) < 400
  //     ) {
  //       setHasSit(true);
  //       setHasStand(false);
  //     }
  //     if (hasSit) {
  //       if (
  //         Math.abs(pose[0]?.pose?.leftHip?.y - pose[0]?.pose?.leftAnkle?.y) >
  //         400
  //       ) {
  //         setHasStand(true);
  //         setHasSit(false);
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    setNoOfSquats(prev => (hasStand ? prev + 1 : prev));
  }, [hasStand]);

  const isPreviousDisabled = currentExerciseIndex === 0;
  const isNextDisabled = currentExerciseIndex === exercises.length - 1;

  const handlePrevious = () => {
    if (!isPreviousDisabled) {
      setCurrentExerciseIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleCancel = () => {
    setWorkoutData();
    navigation.goBack(); // Go back to the previous screen or workout overview
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to detect poses.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestCameraPermission();
      if (!granted) {
        Alert.alert(
          'Camera permission denied',
          'This app cannot function without camera access.',
        );
        navigation.goBack(); // Go back if permission is denied
      }
    };
    checkPermissions();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <HumanPose
        height={500}
        width={400}
        enableKeyPoints={true}
        flipHorizontal={false}
        isBackCamera={true} // Use back camera
        onPoseDetected={onPoseDetected}
      />
      {currentExercise === 'Squats' && (
        <Text style={styles.counter}>No of Squats: {noOfSquats}</Text>
      )}

      {currentExercise === 'Push-ups' && (
        <Text style={styles.counter}>No of Push-ups: {noOfPushups}</Text>
      )}

      {currentExercise === 'Lunges' && (
        <Text style={styles.counter}>No of Lunges: {noOfLunges}</Text>
      )}

      {currentExercise === 'Planks' && (
        <Text style={styles.counter}>Plank Timer: {timer} seconds</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isPreviousDisabled && styles.buttonDisabled]}
          onPress={handlePrevious}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isNextDisabled && styles.buttonDisabled]}
          onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
          <Text style={styles.buttonText}>Complete Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fullscreen with black background
    justifyContent: 'flex-end', // Position the counter at the bottom
    alignItems: 'center', // Center horizontally
    padding: 16,
  },
  counter: {
    color: 'white', // Set text color to white for contrast against black background
    fontSize: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background for better readability
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 6,
    flex: 1, // Make each button take equal space
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonCancel: {
    flex: 1, // Make cancel buttons also take equal space
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC', // Disabled button color
  },
});

export default ExerciseTrackingScreen;
