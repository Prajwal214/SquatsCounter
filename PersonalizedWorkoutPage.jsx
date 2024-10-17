import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageSlider from '../components/ImageSlider';
import PersonalizedBodyParts from '../components/PersonalizedBodyParts';
import ExerciseList from '../components/ExerciseList';
import { fetchExercisesById } from '../api/exerciseDB';
import FloatingButton from '../components/FloatingButton';
import { useNavigation } from '@react-navigation/native';

export default function PersonalizedWorkoutPage() {

  const [exercises, setExercises] = React.useState([]);

  const router = useNavigation();

  React.useEffect(() => {
    console.log('There');
    getExercises();
  }, []);

  const getExercises = async (bodypart) => {
    console.log('here');
    let data = [];
    let pushUpData = await fetchExercisesById(1274);
    let squatData = await fetchExercisesById('0514');
    data.push(pushUpData);
    data.push(squatData);
    // console.log('got data: ', data);
    setExercises(data);
    console.log('exercises: ', data);
  };

  return (
    <SafeAreaView className="flex-1 bg-white flex space-y-5" edges={['top']}>
      <StatusBar style="dark" />

      {/* punchilne and avatar */}
      <View className="flex-row justify-between items-center mx-5">
        <View className="space-y-2">
          <Text
            className="font-bold tracking-wider text-neutral-700"
          >
            READY TO
          </Text>
          <Text

            className="font-bold tracking-wider text-rose-500"
          >
            WORKOUT
          </Text>
        </View>

        <View className="flex justify-center items-center space-y-2">
          <Image
            source={require('../assets/images/avatar.jpg')}

            className="rounded-full"
          />
          <View
            className="bg-neutral-200 rounded-full flex justify-center items-center border-[3px] border-neutral-300"

          >
            <Ionicons name="notifications" color="gray" />
          </View>
        </View>
      </View>

      {/* image slider */}
      <View>
        <ImageSlider />
      </View>



      {/* body parts list */}
      <ExerciseList data={exercises} />

      <FloatingButton
        style={styles.floatinBtn}
        onPress={() => router.navigate('home')}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatinBtn: {

    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
