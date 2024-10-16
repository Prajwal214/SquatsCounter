import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

export default function LandingPage() {
    const router = useNavigation();

    return (
        <View style={styles.container}>
            <FastImage
                source={require('./assets/bg.gif')}
                style={styles.backgroundImage}
                resizeMode={FastImage.resizeMode.cover} // Use FastImage resize mode
            />

            <Text style={styles.header}>
                Core<Text style={{ color: 'rgb(244 63 94)' }}>Tracker</Text>
            </Text>
            <Text style={styles.tagline}>
                Track your <Text style={{ color: 'rgb(244 63 94)' }}>progress</Text> and{' '}
                <Text style={{ color: 'rgb(244 63 94)' }}>perfect</Text> your form with
                every rep.
            </Text>
            <TouchableOpacity
                onPress={async () => {
                    const workout = await AsyncStorage.getItem('workout');
                    const parse = workout && JSON.parse(workout);
                    console.log(parse);
                    parse ? router.navigate('Exercise') : router.navigate('UserInput');
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>
                    Get Started
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef2f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject, // Makes the image cover the entire screen
        width: '100%',
        height: '100%',
    },
    button: {
        height: 50,
        backgroundColor: 'rgba(244,63,94,0.7)',
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 80, // Adjust to control the button's distance from the bottom
        alignSelf: 'center', // Centers the button horizontally
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff', // White text color for contrast
        fontSize: 20,
    },
    header: {
        textAlign: 'center',
        fontSize: 44,
        marginBottom: 20, // Reduced margin to make space for the tagline
        lineHeight: 44,
        color: '#fff',
    },
    tagline: {
        textAlign: 'center',
        fontSize: 18, // Smaller font size for the tagline
        marginTop: 10, // Adjusts spacing between title and tagline
        color: '#fff',
        paddingHorizontal: 20, // Optional: adds padding for better readability
    },
});
