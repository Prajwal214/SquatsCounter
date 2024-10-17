import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bodyParts } from '../constants';
import { useNavigation } from '@react-navigation/native';

export default function BodyParts() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={[styles.headerText, { fontSize: hp(3) }]}>Exercises</Text>

            <FlatList
                data={bodyParts}
                numColumns={2}
                keyExtractor={item => item.name}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item, index }) => (
                    <BodyPartCard navigation={navigation} index={index} item={item} />
                )}
            />
        </View>
    );
}

const BodyPartCard = ({ item, navigation, index }) => {
    return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Exercises', { item })}
                style={[styles.card, { width: wp(44), height: wp(52) }]}
            >
                <Image
                    source={item.image}
                    resizeMode="cover"
                    style={[styles.cardImage, { width: wp(44), height: wp(52) }]}
                />
                {/* <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={[styles.gradientOverlay, { width: wp(44), height: hp(15) }]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                /> */}
                <Text style={[styles.cardText, { fontSize: hp(2.3) }]}>{item?.name}</Text>
            </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(4),
    },
    headerText: {
        fontWeight: '600',
        color: '#4B5563', // neutral-700
    },
    flatListContent: {
        paddingBottom: 50,
        paddingTop: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        justifyContent: 'flex-end',
        padding: 16,
        marginBottom: 16,
        borderRadius: 35,
        overflow: 'hidden',
    },
    cardImage: {
        position: 'absolute',
        borderRadius: 35,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },
    cardText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});
