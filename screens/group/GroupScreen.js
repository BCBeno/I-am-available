import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TopBar from '../../components/TopBar';
import NewGroupModal from '../../components/group/NewGroupModal';
import GroupListingCard from '../../components/group/GroupListingCard';
import {defaultStyles} from '../../default-styles';
import {fetchUser} from '../../redux/slices/userSlice';
import {fetchGroups, fetchGroupsByList} from '../../redux/slices/groupSlice';
import {collection, query, where} from 'firebase/firestore';
import {db} from "../../firebaseconfig";
import {useFocusEffect} from "@react-navigation/native";

export default function GroupScreen() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);
    const groups = useSelector(state => state.groups.items);

    const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false); // <-- Add this

    useEffect(() => {
        if (user?.groups?.length > 0) {
            const refs = user.groups.map(g => g.groupReference);
            dispatch(fetchGroupsByList(refs));
        }
    }, [dispatch, user]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchText === '') {
                if (user?.groups?.length > 0) {
                    const refs = user.groups.map(g => g.groupReference).sort((a, b) => a.localeCompare(b));
                    dispatch(fetchGroupsByList(refs));
                }
            } else {
                const q = query(
                    collection(db, 'groups'),
                    where('id', '>=', searchText),
                    where('id', '<=', searchText + '\uf8ff'),
                    where('public', '==', true)
                );

                dispatch(fetchGroups(q));
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchText, user, dispatch]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setSearchText('');
            };
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        if (searchText === '') {
            if (user?.groups?.length > 0) {
                const refs = user.groups.map(g => g.groupReference).sort((a, b) => a.localeCompare(b));
                await dispatch(fetchGroupsByList(refs));
            }
        } else {
            const q = query(
                collection(db, 'groups'),
                where('id', '>=', searchText),
                where('id', '<=', searchText + '\uf8ff'),
                where('public', '==', true)
            );
            await dispatch(fetchGroups(q));
        }
        setRefreshing(false);
    };

    return (
        <>
            <TopBar style={{paddingTop: '15%'}} setText={setSearchText} text={searchText}/>
            <View style={[defaultStyles.container, {paddingTop: '5%'}]}>
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <GroupListingCard groupId={item.id}/>
                    )}
                    contentContainerStyle={{gap: 10}}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing} // <-- Add this
                    onRefresh={onRefresh}   // <-- And this
                />

                <NewGroupModal
                    modalVisible={newGroupModalVisible}
                    setModalVisible={setNewGroupModalVisible}
                />
            </View>
        </>
    );
}