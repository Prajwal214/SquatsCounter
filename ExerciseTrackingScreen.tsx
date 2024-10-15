import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid, Alert} from 'react-native';
import HumanPose from 'react-native-human-pose'; // Ensure this library is correctly installed
import {useNavigation} from '@react-navigation/native';

const ExerciseTrackingScreen = ({route}) => {
  const {exercise} = route.params; // Get the selected exercise from the previous screen
  const [noOfSquats, setNoOfSquats] = useState(0);
  const [noOfPushups, setNoOfPushups] = useState(0);
  const [noOfLunges, setNoOfLunges] = useState(0);

  const [hasSit, setHasSit] = useState(false);
  const [hasStand, setHasStand] = useState(false);
  const navigation = useNavigation();
  const [timer, setTimer] = useState(0);
  const [isPlanking, setIsPlanking] = useState(false);

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
      {exercise === 'Squats' && (
        <Text style={styles.counter}>No of Squats: {noOfSquats}</Text>
      )}

      {exercise === 'Push-ups' && (
        <Text style={styles.counter}>No of Push-ups: {noOfPushups}</Text>
      )}

      {exercise === 'Lunges' && (
        <Text style={styles.counter}>No of Lunges: {noOfLunges}</Text>
      )}

      {exercise === 'Planks' && (
        <Text style={styles.counter}>Plank Timer: {timer} seconds</Text>
      )}
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
});

export default ExerciseTrackingScreen;
