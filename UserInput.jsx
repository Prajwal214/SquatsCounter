// UserInput.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatGPTResponse } from './ChatService';
import { useNavigation } from '@react-navigation/native';

const UserInput = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    const router = useNavigation();

    const validateForm = () => {
        if (!age || !height || !weight || !gender) {
            alert('All fields are required!');
        } else {
            countBmi();
        }
    };

    const handleSubmit = async () => {
        // const data = [];
        const data = await getChatGPTResponse(`Hi 
my weight is ${weight}kg . I am a ${gender} . my height is ${height}cm . Can you create a workout for a  month that only consist of Squats,Push-ups,Planks and Lunges . please give answer in this format
[{pushup:10 , situps:10,isComplete:false} , {pushup:10 , situps:10,isComplete:false}]
Please send only result and no other words`);
        console.log(data);
        await AsyncStorage.setItem('workout', JSON.stringify(data));
        router.navigate('Exercise');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Get personlized workout
            </Text>
            <View style={styles.form}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Age
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your age"
                        onChangeText={setAge}
                        value={age}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Height (cm)
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your height"
                        onChangeText={setHeight}
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
                        placeholder="Enter your weight"
                        onChangeText={setWeight}
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
                        <Text style={styles.genderText}>
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
                        <Text style={styles.genderText}>Female</Text>
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
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#289df6',
        marginBottom: 20,
    },
    form: {
        backgroundColor: '#fff',
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
        borderColor: '#ddd',
        borderRadius: 10,
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
        backgroundColor: '#289df6',
    },
    genderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#289df6',
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
