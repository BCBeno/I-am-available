//AvailabilityScreen.js
import React, {useState, useCallback, useEffect} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {loadCompleteUserData} from '../data/userDataLoader';
import TopBar from '../components/TopBar';
import ClockIcon from '../assets/Clock.png';
import CalendarIcon from '../assets/Calendar.png';
import {useSelector} from "react-redux";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseconfig";

export default function AvailabilityScreen({navigation, route, refreshTrigger}) {
    const [availabilities, setAvailabilities] = useState([]);

    const user = useSelector(state => state.user.data);

    // useFocusEffect(
    //     useCallback(() => {
    //         setAvailabilities(user?.availabilities || []);
    //
    //         if (route?.params?.refreshed) {
    //             navigation.setParams({refreshed: false});
    //         }
    //     }, [route?.params?.refreshed, refreshTrigger, user])
    // );

    useEffect(() => {
        const fetchAvailabilities = async () => {
            const q = query(collection(db, 'availabilities'), where('user', '==', user.hashtag));
            const snap = await getDocs(q);
            const data = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setAvailabilities(data);
        };

        fetchAvailabilities();
    }, []);

    const renderItem = ({item, index}) => {
        const isRepeating = !!item.days;
        const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

        return (
            <View style={styles.card}>
                <View style={styles.row}>
                    <Image source={ClockIcon} style={styles.icon}/>
                    <Text style={styles.cardText}>{item.time}</Text>
                </View>

                <View style={[styles.row, styles.bottomRow]}>
                    <Image source={CalendarIcon} style={styles.icon}/>
                    {isRepeating ? (
                        <Text style={styles.daysText}>
                            {daysOfWeek.map((day, idx) => {
                                const fullDay = [
                                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                                ][idx];
                                const isActive = item.days.includes(fullDay);
                                return (
                                    <Text
                                        key={`${day}-${idx}`}
                                        style={[styles.day, isActive && styles.activeDay]}
                                    >
                                        {day}
                                    </Text>
                                );
                            })}
                        </Text>
                    ) : (
                        <Text style={[styles.cardText, styles.dateText]}>
                            {item.date?.replace(/-/g, ' / ')}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('OwnerAvailabilityDetails', {
                            availability: item,
                        })
                    }
                >
                    <Text style={styles.details}>Details →</Text>
                </TouchableOpacity>

            </View>
        );
    };

    return (
        <>
            <TopBar
                style={{paddingTop: "15%"}}
                setText={() => {
                }}
                hideSearch={true}
            />

            <View style={styles.container}>
                <FlatList
                    data={availabilities}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{paddingBottom: 100}}
                />
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() =>
                        navigation.navigate('CreateAvailability', {user})
                    }
                >
                    <Ionicons name="add" size={40} color="#fff"/>
                </TouchableOpacity>

            </View>
        </>
    );
  };

const styles = StyleSheet.create({
    daysText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    day: {
        fontFamily: 'Poppins',
        color: '#ccc',
        marginRight: 5,
        letterSpacing: 6,
    },
    activeDay: {
        color: '#7C0152',
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F0F0F0',
    },
    card: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#7C0152',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 3,
    },
    cardText: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: 'bold',
    },
    details: {
        fontFamily: 'Poppins',
        textAlign: 'right',
        color: '#7C0152',
        fontWeight: 'bold',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#7C0152',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    bottomRow: {
        marginTop: 10,
    },
});
