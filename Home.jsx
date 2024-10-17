import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import FloatingButton from './components/FloatingButton';
import ImageSlider from './components/ImageSlider';
import BodyParts from './components/BodyParts';

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* punchline and avatar */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText, styles.headerTextNeutral]}>READY TO</Text>
          <Text style={[styles.headerText, styles.headerTextRose]}>WORKOUT</Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={require('./assets/images/avatar.jpg')}
            style={styles.avatar}
          />
          <View style={styles.notificationIconContainer}>
            <Ionicons name="notifications" size={hp(3)} color="gray" />
          </View>
        </View>
      </View>

      {/* image slider */}
      <View>
        <ImageSlider />
      </View>

      {/* body parts list */}
      <View style={styles.bodyPartsContainer}>
        <BodyParts />
      </View>

      <FloatingButton
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('PersonalizedWorkoutPage')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: hp(2),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(5),
  },
  headerTextContainer: {
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: hp(4.5),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerTextNeutral: {
    color: '#4B5563', // neutral-700
  },
  headerTextRose: {
    color: '#F43F5E', // rose-500
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(6) / 2,
  },
  notificationIconContainer: {
    backgroundColor: '#E5E7EB', // neutral-200
    borderRadius: hp(5.5) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#D1D5DB', // neutral-300
    height: hp(5.5),
    width: hp(5.5),
  },
  bodyPartsContainer: {
    flex: 1,
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
