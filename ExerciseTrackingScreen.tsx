import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import HumanPose from 'react-native-human-pose'; // Ensure this library is correctly installed
import { useNavigation } from '@react-navigation/native';

const ExerciseTrackingScreen = ({ route }) => {
  const { exercise } = route.params; // Get the selected exercise from the previous screen
  const [noOfSquats, setNoOfSquats] = useState(0);
  const [hasSit, setHasSit] = useState(false);
  const [hasStand, setHasStand] = useState(false);
  const navigation = useNavigation();

  const onPoseDetected = (pose) => {
    // leftHip = 11
    // leftAnkle = 15
    if (
      pose[0]?.pose?.leftHip?.confidence > 0.5 &&
      pose[0]?.pose?.leftAnkle?.confidence > 0.5
    ) {
      if (
        Math.abs(pose[0]?.pose?.leftHip?.y - pose[0]?.pose?.leftAnkle?.y) < 400
      ) {
        setHasSit(true);
        setHasStand(false);
      }
      if (hasSit) {
        if (
          Math.abs(pose[0]?.pose?.leftHip?.y - pose[0]?.pose?.leftAnkle?.y) >
          400
        ) {
          setHasStand(true);
          setHasSit(false);
        }
      }
    }
  };

  useEffect(() => {
    setNoOfSquats((prev) => (hasStand ? prev + 1 : prev));
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
        }
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
        Alert.alert('Camera permission denied', 'This app cannot function without camera access.');
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
      <Text style={styles.counter}>
        No of Squats: {noOfSquats}
      </Text>
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

