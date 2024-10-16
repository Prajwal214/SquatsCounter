// UserInput.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatGPTResponse } from './ChatService';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const UserInput = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    const router = useNavigation();

    const handleSubmit = async () => {
        // const data = [];
        if (!age || !height || !weight || !gender) {
            alert('All fields are required!');
        } else {
            const data = await getChatGPTResponse(`Hi 
    my weight is ${weight}kg . I am a ${gender} . my height is ${height}cm . Can you create a workout for a  month that only consist of Squats,Push-ups,Planks and Lunges . please give answer in this format
    [{pushup:10 , situps:10,isComplete:false} , {pushup:10 , situps:10,isComplete:false}]
    Please send only result and no other words`);
            console.log(data);
            await AsyncStorage.setItem('workout', JSON.stringify(data));
            router.navigate('Exercise');
        }
    };

    return (
        <View style={styles.container}>
            <FastImage
                source={require('./assets/bg.gif')}
                style={styles.backgroundImage}
                resizeMode={FastImage.resizeMode.cover} // Use FastImage resize mode

            />
            <Text style={styles.header}>
                Unlock Your {'\n'}
                <Text style={{ color: 'rgb(244 63 94)' }}> Perfect Workout</Text>
            </Text>
            <View style={styles.form}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Age
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setAge}
                        value={age}
                        placeholderTextColor="#000"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Height (cm)
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setHeight}
                        placeholderTextColor="#000"

                        value={height}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Weight (kg)
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setWeight}
                        placeholderTextColor="#000"

                        value={weight}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.genderRow}>
                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            gender === 'male' && styles.selectedGender,
                        ]}
                        onPress={() => setGender('male')}
                    >
                        <Text style={[
                            styles.genderText,
                            gender === 'male' && styles.selectedGenderMale,
                        ]}>
                            Male
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            gender === 'female' && styles.selectedGender,
                        ]}
                        onPress={() => setGender('female')}
                    >
                        <Text style={[
                            styles.genderText,
                            gender === 'female' && styles.selectedGenderFemale,
                        ]}>Female</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>
                        Create workout
                    </Text>
                </TouchableOpacity>
                {bmiResult && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>
                            BMI:
                        </Text>
                        <Text style={styles.resultText}>
                            {bmiResult.bmi}
                        </Text>
                        <Text style={styles.resultLabel}>
                            Result:
                        </Text>
                        <Text style={styles.resultText}>
                            {bmiResult.result}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

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
    header: {
        textAlign: 'center',
        fontSize: 34,
        marginBottom: 60,
        lineHeight: 48,
        color: '#fff',
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        elevation: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
        color: '#111',
    },
    textInput: {
        flex: 2,
        height: 40,
        borderWidth: 1,
        borderColor: '#7e7e7e',
        borderRadius: 6,
        paddingLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    genderButton: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dbeffe',
        padding: 10,
        margin: 10,
    },
    selectedGender: {
        backgroundColor: 'rgb(244 63 94)',
    },
    selectedGenderMale: {
        color: '#fff',
    },
    selectedGenderFemale: {
        color: '#fff',

    },
    genderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    submitButton: {
        backgroundColor: 'rgb(244 63 94)',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    resultContainer: {
        marginTop: 20,
    },
    resultLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    resultText: {
        fontSize: 16,
    },
});

export default UserInput;
