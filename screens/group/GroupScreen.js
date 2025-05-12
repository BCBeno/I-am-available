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

export default function GroupScreen() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);
    const groups = useSelector(state => state.groups.items);

    // Load user data
    useEffect(() => {
        dispatch(fetchUser('lucasalopes'));
    }, [dispatch]);

    // When user.groups changes, fetch only those groups
    useEffect(() => {
        if (user?.groups?.length > 0) {
            const refs = user.groups.map(g => g.groupReference);
            dispatch(fetchGroupsByList(refs));
        }
    }, [dispatch, user]);

    const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchText === '') {
                if (user?.groups?.length > 0) {
                    const refs = user.groups.map(g => g.groupReference);
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


    return (
        <>
            <TopBar style={{paddingTop: '15%'}} setText={setSearchText}/>
            <View style={[defaultStyles.container, {paddingTop: '5%'}]}>
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <GroupListingCard groupId={item.id}/>
                    )}
                    contentContainerStyle={{gap: 10}}
                    showsVerticalScrollIndicator={false}
                />

                <NewGroupModal
                    modalVisible={newGroupModalVisible}
                    setModalVisible={setNewGroupModalVisible}
                />
            </View>
        </>
    );
}