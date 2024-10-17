import { View, Text, FlatList, TouchableOpacity, StyleSheet,Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ExerciseList({ data }) {
    const navigation = useNavigation();

    return (
        <View>
            <FlatList
                data={data}
                numColumns={2}
                keyExtractor={item => item.name}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item, index }) => (
                    <ExerciseCard navigation={navigation} index={index} item={item} />
                )}
            />
        </View>
    );
}

const ExerciseCard = ({ item, navigation, index }) => {
    return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ExerciseDetails', { item })}
                style={styles.touchableOpacity}
            >
                <View style={styles.cardContainer}>
                    <Image
                        source={{ uri: item.gifUrl }}
                        contentFit="cover"
                        style={styles.cardImage}
                    />
                </View>

                <Text style={styles.exerciseText}>
                    {item?.name?.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
                </Text>
            </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    flatListContent: {
        paddingBottom: 60,
        paddingTop: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    touchableOpacity: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    cardContainer: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderRadius: 25,
    },
    cardImage: {
        width: wp(44),
        height: wp(52),
        borderRadius: 25,
    },
    exerciseText: {
        fontSize: hp(1.7),
        color: '#4B5563', // neutral-700
        fontWeight: '600',
        marginLeft: 8,
        letterSpacing: 0.5,
        marginTop: 8,
    },
});
