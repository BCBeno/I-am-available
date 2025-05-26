import {Text, TouchableOpacity, View} from 'react-native'
import {colors} from "../../colors";
import {defaultStyles} from "../../default-styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useDispatch, useSelector} from "react-redux";
import {removeUserFromGroup, updateGroup, updateGroupInFirestore} from "../../redux/slices/groupSlice";
import {useEffect, useState} from "react";
import ConfirmActionModal from "../ConfirmActionModal";
import {fetchUser, removeGroupFromUserInFirebase} from "../../redux/slices/userSlice";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../firebaseconfig";

export default function GroupUserListCard({memberRef, isOwner, groupId}) {

    const dispatch = useDispatch();

    const group = useSelector(state => state.groups.items).find(group => group.id === groupId);

    const user = useSelector(state => state.user.data);

    const isMine = memberRef.userReference === `/users/${user.hashtag}`;
    useEffect(() => {
        const fetchMember = async () => {
            try {
                const userDoc = doc(db, memberRef.userReference);
                const snapshot = await getDoc(userDoc);
                if (snapshot.exists()) {
                    setMember({...snapshot.data(), userReference: memberRef.userReference});
                } else {
                    console.warn(`No user found at ${memberRef.userReference}`);
                }
            } catch (error) {
                console.error('Error fetching member:', error);
            }
        };
        fetchMember();
    }, [memberRef]);

    const [member, setMember] = useState({name: ''});

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const onDeleteMember = () => {
        dispatch(removeUserFromGroup({groupId, userHashtag: member.hashtag}));
    };

    return (
        <>
            {showConfirmModal ?
                <ConfirmActionModal modalVisible={showConfirmModal} setModalVisible={setShowConfirmModal}
                                    onClick={onDeleteMember}
                                    title={`Proceed into deletion of user '${member.name}'?`}/>
                : null
            }
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingHorizontal: 12,
                paddingVertical: 16,
            }}>
                <View style={{
                    flexDirection: "row",
                    gap: 6,
                    width: "70%",
                }}>
                    <MaterialIcons name={"account-circle"} size={24} style={{color: colors.mediumGray}}/>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={[
                            defaultStyles.title,
                            {
                                width: "100%",
                            }
                        ]}>{member.name}</Text>
                </View>
                {
                    isOwner && isMine === false ?
                        <View style={{flexDirection: "row", gap: 4}}>
                            <TouchableOpacity onPress={() => setShowConfirmModal(true)}>
                                <MaterialIcons name={"delete"} size={20} style={{color: colors.mediumGray}}/>
                            </TouchableOpacity>
                        </View> : null
                }
            </View>
        </>
    )
}