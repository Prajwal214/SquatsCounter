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
import FastImage from 'react-native-fast-image';

const exercises = [
  {name: 'Squats', icon: require('./assets/squats.png')},
  {name: 'Push-ups', icon: require('./assets/pushups.png')},
  {name: 'Planks', icon: require('./assets/planks.png')},
  {name: 'Lunges', icon: require('./assets/lunge.png')},
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
  const [hasSitPushups, setHasSitPushups] = useState(false);
  const [hasStandPushups, setHasStandPushups] = useState(false);
  const [hasSitLunges, setHasSitLunges] = useState(false);
  const [hasStandLunges, setHasStandLunges] = useState(false);
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

  const onPoseDetected = pose => {
    switch (currentExercise) { // Use currentExercise instead of exercise
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
        console.warn(`Unknown exercise: ${currentExercise}`); // Update warning message
        break;
    }
  };

  const handleSquats = pose => {
    const leftHipY = pose[0]?.pose?.leftHip?.y;
    const leftAnkleY = pose[0]?.pose?.leftAnkle?.y;
  
    console.log('Squats:', leftHipY, leftAnkleY);
  
    // Check confidence levels
    if (
      pose[0]?.pose?.leftHip?.confidence > 0.5 &&
      pose[0]?.pose?.leftAnkle?.confidence > 0.5
    ) {
      const distance = Math.abs(leftHipY - leftAnkleY);
      console.log(`Distance: ${distance}, hasSit: ${hasSit}, hasStand: ${hasStand}`);
  
      // Adjusted threshold for sitting detection
      if (distance < 300) { 
        if (!hasSit) { // Transition to sit
          setHasSit(true);
          setHasStand(false);
          console.log("Transition to Sit");
        }
      } else if (hasSit) { // Transition to stand
        setHasStand(true);
        setHasSit(false);
        setNoOfSquats(prev => prev + 1); // Increment squat counter
        console.log("Transition to Stand, Squats Incremented");
      }
    }
  };

  const THRESHOLD_DOWN_MIN = 30; // Minimum angle threshold for down position
  const THRESHOLD_DOWN_MAX = 50; // Maximum angle threshold for down position
  const THRESHOLD_UP = 140;       // Angle threshold for up position
  const BASE_CONFIDENCE_THRESHOLD = 0.6; // Base confidence threshold
  const MIN_KEYPOINT_CONFIDENCE = 0.3; // Minimum confidence for each keypoint
  const TOLERANCE = 10; // Increased tolerance for angle detection
  const STATE_FLAP_BUFFER = 1000; // Time in ms to prevent rapid state changes

const calculateAngle = (p1, p2, p3) => {
    const a = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const b = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
    const c = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
    const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    return angle * (180 / Math.PI);
};

const [isInDownPosition, setIsInDownPosition] = useState(false);
const [pushupCount, setPushupCount] = useState(0);
const [lastTransitionTime, setLastTransitionTime] = useState(0);

const handlePushups = (pose) => {
    if (!pose[0]?.pose) return;

    const { leftShoulder, rightShoulder, leftElbow, rightElbow, leftHip, rightHip } = pose[0].pose;

    // Calculate average confidence
    const averageConfidence = (leftShoulder?.confidence + rightShoulder?.confidence + leftElbow?.confidence + rightElbow?.confidence) / 4;

    // Check if keypoints have sufficient confidence
    const keypointsConfidence = [
        leftShoulder?.confidence,
        rightShoulder?.confidence,
        leftElbow?.confidence,
        rightElbow?.confidence,
    ];

    const sufficientConfidence = keypointsConfidence.every(confidence => confidence > MIN_KEYPOINT_CONFIDENCE);

    if (sufficientConfidence) {
        const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftHip);
        const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightHip);

        // Log the angles and average confidence
        console.log('Angles:', leftArmAngle, rightArmAngle);
        console.log('Average Confidence:', averageConfidence);

        // Detect down and up positions with increased tolerance
        const isInDownPositionNow = (leftArmAngle >= THRESHOLD_DOWN_MIN - TOLERANCE && leftArmAngle <= THRESHOLD_DOWN_MAX + TOLERANCE) &&
                                    (rightArmAngle >= THRESHOLD_DOWN_MIN - TOLERANCE && rightArmAngle <= THRESHOLD_DOWN_MAX + TOLERANCE);
        const isInUpPositionNow = leftArmAngle > (THRESHOLD_UP - TOLERANCE) && rightArmAngle > (THRESHOLD_UP - TOLERANCE);

        // Prevent state flapping
        const currentTime = new Date().getTime();
        if (currentTime - lastTransitionTime > STATE_FLAP_BUFFER) {
            if (isInDownPositionNow && !isInDownPosition) {
                setIsInDownPosition(true);
                setLastTransitionTime(currentTime);
            } else if (isInUpPositionNow && isInDownPosition) {
                setIsInDownPosition(false);
                setPushupCount(prevp => prevp + 1);
                setLastTransitionTime(currentTime);
            }
        }
    } else {
        console.log('Insufficient confidence in keypoints:', keypointsConfidence);
    }
};

const handleLunges = pose => {
  const leftKneeY = pose[0]?.pose?.leftKnee?.y;
  const rightKneeY = pose[0]?.pose?.rightKnee?.y;
  const leftHipY = pose[0]?.pose?.leftHip?.y;
  const rightHipY = pose[0]?.pose?.rightHip?.y;

  console.log('Lunges:', leftKneeY, rightKneeY, leftHipY, rightHipY);
  console.log('State - hasSitLunges:', hasSitLunges, 'hasStandLunges:', hasStandLunges);

  // Check if all required keypoints are detected with sufficient confidence
  if (
      pose[0]?.pose?.leftKnee?.confidence > 0.5 &&
      pose[0]?.pose?.rightKnee?.confidence > 0.5 &&
      pose[0]?.pose?.leftHip?.confidence > 0.5 &&
      pose[0]?.pose?.rightHip?.confidence > 0.5
  ) {
      // Detect sitting lunge position
      if (
          Math.abs(leftKneeY - leftHipY) < 290 &&  // Adjusted threshold
          Math.abs(rightKneeY - rightHipY) < 290
      ) {
          setHasSitLunges(true);
          setHasStandLunges(false);
          console.log('Detected sitting lunge');
      }
      
      // Detect standing position and count lunges
      if (
          hasSitLunges &&
          Math.abs(leftKneeY - leftHipY) > 190 &&  // Adjusted threshold
          Math.abs(rightKneeY - rightHipY) > 190
      ) {
          setHasStandLunges(true);
          setHasSitLunges(false);
          setNoOfLunges(prevl => prevl + 1);
          console.log('Detected standing lunge. Incrementing count:', noOfLunges + 1);
      } else {
          console.log('Conditions for standing lunge not met:', {
              leftKneeY,
              leftHipY,
              rightKneeY,
              rightHipY,
              hasSitLunges,
              hasStandLunges
          });
      }
  }
};

    const [plankStartTime, setPlankStartTime] = useState(null);
  
    const handlePlanks = pose => {
      // Check if pose data is available
      if (!pose || pose.length === 0) {
          if (isPlanking) {
              const elapsed_time = (Date.now() - plankStartTime) / 1000;
              setTimer(elapsed_time);
              setIsPlanking(false);
              console.log("Plank ended, time:", elapsed_time);
          }
          return; // Exit if no pose data is available
      }
  
      const leftShoulderY = pose[0]?.pose?.leftShoulder?.y;
      const rightShoulderY = pose[0]?.pose?.rightShoulder?.y;
      const leftAnkleY = pose[0]?.pose?.leftAnkle?.y;
      const rightAnkleY = pose[0]?.pose?.rightAnkle?.y;
  
      const leftShoulderConfidence = pose[0]?.pose?.leftShoulder?.confidence;
      const rightShoulderConfidence = pose[0]?.pose?.rightShoulder?.confidence;
      const leftAnkleConfidence = pose[0]?.pose?.leftAnkle?.confidence;
      const rightAnkleConfidence = pose[0]?.pose?.rightAnkle?.confidence;
  
      // Log the current positions and confidence levels
      console.log('Planks:', leftShoulderY, rightShoulderY, leftAnkleY, rightAnkleY);
      console.log('Confidences:', leftShoulderConfidence, rightShoulderConfidence, leftAnkleConfidence, rightAnkleConfidence);
  
      // Define thresholds for confidence and Y-coordinate differences
      const confidenceThreshold = 0.08;
      const yDifferenceThreshold = 100;
  
      // Check if shoulders are detected with high confidence
      if (leftShoulderConfidence > confidenceThreshold && rightShoulderConfidence > confidenceThreshold) {
          // Allow for fallback if at least one ankle is detected with some confidence
          if (leftAnkleConfidence > confidenceThreshold || rightAnkleConfidence > confidenceThreshold) {
              // Calculate the differences in Y-coordinates
              const leftShoulderAnkleDiff = leftShoulderY - (leftAnkleY || rightAnkleY);
              const rightShoulderAnkleDiff = rightShoulderY - (rightAnkleY || leftAnkleY);
  
              // Check if the user is in the plank position
              const isCurrentlyPlanking = Math.abs(leftShoulderAnkleDiff) < yDifferenceThreshold &&
                                          Math.abs(rightShoulderAnkleDiff) < yDifferenceThreshold;
  
              if (isCurrentlyPlanking) {
                  if (!isPlanking) {
                      setPlankStartTime(Date.now());
                      setIsPlanking(true);
                      console.log("Plank started");
                  }
              } else {
                  if (isPlanking) {
                      const elapsed_time = (Date.now() - plankStartTime) / 1000;
                      setTimer(elapsed_time);
                      setIsPlanking(false);
                      console.log("Plank ended, time:", elapsed_time);
                  }
              }
          } else {
              // If ankle confidence is low, check if currently planking and stop the timer
              if (isPlanking) {
                  const elapsed_time = (Date.now() - plankStartTime) / 1000;
                  setTimer(elapsed_time);
                  setIsPlanking(false);
                  console.log("Plank ended due to insufficient ankle confidence, time:", elapsed_time);
              }
          }
      } else {
          // If shoulder confidence is low, check if currently planking and stop the timer
          if (isPlanking) {
              const elapsed_time = (Date.now() - plankStartTime) / 1000;
              setTimer(elapsed_time);
              setIsPlanking(false);
              console.log("Plank ended due to insufficient shoulder confidence, time:", elapsed_time);
          }
      }
  };

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

  const handleComplete = () => {
    setWorkoutData();
    navigation.goBack(); // Go back to the previous screen or workout overview
  };

 const handleCancel = () => {
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
  const exerciseGifs = {
    Squats: require('./assets/squat.gif'), // Adjust the paths as needed
    'Push-ups': require('./assets/push-up.gif'),
    Lunges: require('./assets/lunges.gif'),
    Planks: require('./assets/plank.gif'),
  };

  // Get the current GIF based on the current exercise
  const currentGif = exerciseGifs[currentExercise] || exerciseGifs.Squats; // Fallback to Squats if not found
  return (
    <View style={styles.container}>
      <FastImage
        source={currentGif} // Use a local GIF
        style={styles.gif} // Adjust the style as needed
        resizeMode="contain" // To maintain aspect ratio
      />
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
        <Text style={styles.counter}>No of Push-ups: {pushupCount}</Text>
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

        <TouchableOpacity style={styles.buttonCancel} onPress={handleComplete}>
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
  gif: {
    width: 300, // Adjust width as needed
    height: 200, // Adjust height as needed
    marginBottom: 20, // Space between the GIF and HumanPose component
  },
});

export default ExerciseTrackingScreen;
