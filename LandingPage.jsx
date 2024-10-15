
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LandingPage() {
    const router = useNavigation();

    return (
        <View style={styles.container}>
            <Image
                source={require('./assets/welcome.png')}
                style={styles.backgroundImage}
                resizeMode="cover" // Ensures the image covers the whole screen
            />
            <TouchableOpacity
                onPress={async () => {
                    const workout = await AsyncStorage.getItem('workout');
                    const parse = workout && JSON.parse(workout);
                    console.log(parse);
                    parse ? router.navigate('Exercise') : router.navigate('UserInput');
                }}
                style={styles.button}
                className="bg-rose-500 flex items-center justify-center mx-auto rounded-full border-[2px] border-neutral-200"
            >
                <Text className="text-white font-bold tracking-widest">
                    Get Started
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject, // Makes the image cover the entire screen
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: 'rgb(244 63 94)', // Change this to customize button color
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 50, // Adjust to control the button's distance from the bottom
        alignSelf: 'center', // Centers the button horizontally
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff', // White text color for contrast
        fontSize: 18,
        fontWeight: 'bold',
    },
});
