import { View, Text, TouchableOpacity, ScrollView, Pressable, StyleSheet,Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Anticons from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExerciseDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const item = route.params;
    const [localStorage, setLocalStorage] = useState({});
    const [data,setData] = useState({});

    useEffect(() => {
        setData(item?.item);
    },[item,item?.item]);

    console.log('item: ', data);

    return (
        <View style={styles.container}>
           {data?.gifUrl && <View style={styles.imageContainer}>
                <Image
                    source={{ uri: data?.gifUrl }}
                    contentFit="cover"
                    style={styles.image}
                />
            </View>
}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.closeButton}
            >
                <Anticons name="closecircle" size={hp(4.5)} color="#f43f5e" />
            </TouchableOpacity>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.exerciseTitle}>
                    {data?.name}
                </Text>

                {localStorage && (
                    <Text style={styles.localStorageText}>
                        {localStorage['1']}
                    </Text>
                )}

                <Text style={styles.detailsText}>
                    Equipment <Text style={styles.boldText}>{data?.equipment}</Text>
                </Text>

                <Text style={styles.detailsText}>
                    Secondary Muscles <Text style={styles.boldText}>{data?.secondaryMuscles}</Text>
                </Text>

                <Text style={styles.detailsText}>
                    Target <Text style={styles.boldText}>{data?.target}</Text>
                </Text>

                <Text style={styles.instructionsTitle}>
                    Instructions
                </Text>

                {data.instructions?.map((instruction, index) => (
                    <Text key={instruction} style={styles.instructionText}>
                        {instruction}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        shadowColor: '#000',
        backgroundColor: 'white',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    image: {
        width: wp(100),
        height: wp(100),
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    closeButton: {
        position: 'absolute',
        top: hp(2),
        right: wp(4),
    },
    scrollContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    exerciseTitle: {
        fontSize: hp(3.5),
        fontWeight: '600',
        color: '#4B5563',
    },
    localStorageText: {
        fontSize: hp(2.5),
        fontWeight: '600',
        color: '#4B5563',
    },
    detailsText: {
        fontSize: hp(2),
        color: '#6B7280',
    },
    boldText: {
        fontWeight: '700',
        color: '#1F2937',
    },
    instructionsTitle: {
        fontSize: hp(3),
        fontWeight: '600',
        color: '#1F2937',
    },
    instructionText: {
        fontSize: hp(1.7),
        color: '#374151',
    },
    cameraContainer: {
        height: hp(50),
        width: wp(100),
    },
    camera: {
        flex: 1,
    },
    cameraControlContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cameraControlText: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white',
    },
    correctPostureText: {
        color: 'green',
        fontSize: 20,
    },
    incorrectPostureText: {
        color: 'red',
        fontSize: 20,
    },
});
