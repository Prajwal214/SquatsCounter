import { View, Text, TouchableOpacity, Image, StyleSheet,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchExercisesByBodypart } from './api/exerciseDB';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { bodyParts } from './constants';
import ExerciseList from './ExerciseList';

export default function Exercises() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params; // Getting the passed item from navigation params
    const [exercises, setExercises] = useState([]);

    const foundData = bodyParts.find((body) =>body.name === item?.name) || {};

    useEffect(() => {
        if (item) {
            getExercises(item.name);}
    }, [item]);

    const getExercises = async (bodypart) => {
        let data = await fetchExercisesByBodypart(bodypart);
        setExercises(data);
    };

    return (
        <ScrollView>
            <StatusBar style="light" />
            <Image
                source={foundData.image}
                style={[styles.image, { width: wp(100), height: hp(45) }]}
            />
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.backButton, { height: hp(5.5), width: hp(5.5), marginTop: hp(7) }]}
            >
                <Ionicons name="caret-back-outline" size={hp(4)} color="white" />
            </TouchableOpacity>

            {/* exercises */}
            <View style={styles.exerciseContainer}>
                <Text style={[styles.headerText, { fontSize: hp(3) }]}>{item?.name} exercises</Text>
                <View style={styles.exerciseList}>
                    <ExerciseList data={exercises} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    backButton: {
        backgroundColor: '#F43F5E', // rose-500
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(5.5) / 2,
        marginHorizontal: wp(4),
        position: 'absolute',
    },
    exerciseContainer: {
        marginHorizontal: wp(4),
        marginTop: hp(4),
    },
    headerText: {
        fontWeight: '600',
        color: '#4B5563', // neutral-700
    },
    exerciseList: {
        marginBottom: 50,
    },
});
