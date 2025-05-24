import {useNavigation, useRoute} from "@react-navigation/native";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {defaultStyles} from "../../default-styles";
import BackButton from "../../components/BackButton";
import {colors} from "../../colors";
import Button from "../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import NotificationButton from "../../components/group/NotificationButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GroupUserListCard from "../../components/group/GroupUserListCard";
import {addUserToGroup, deleteGroup, removeUserFromGroup, updateGroupInFirestore} from "../../redux/slices/groupSlice";
import {useEffect, useState} from "react";
import JoinGroupModal from "../../components/group/JoinGroupModal";
import InviteGroupModal from "../../components/group/InviteGroupModal";
import NewGroupModal from "../../components/group/NewGroupModal";
import ConfirmActionModal from "../../components/ConfirmActionModal";

export default function GroupDetailsScreen() {

    const navigation = useNavigation()

    const route = useRoute();
    const {groupId} = route.params;

    const dispatch = useDispatch();

    const group = useSelector(state => state.groups.items).find(group => group.id === groupId);

    const user = useSelector(state => state.user.data);

    const [isOwner, setIsOwner] = useState(group.ownerId === user.hashtag);

    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        setIsMember(group.groupMembers.some(member => member.userReference === `/users/${user.hashtag}`));
    }, [group]);

    const [viewJoinGroupModal, setViewJoinGroupModal] = useState(false);

    const [receiveNotification, setReceiveNotification] = useState(group.groupMembers.find(member => member.userReference === `/users/${user.hashtag}`)?.notifications ?? false);

    const [viewInviteModal, setViewInviteModal] = useState(false);

    const [viewEditGroupModal, setViewEditGroupModal] = useState(false);

    const [viewConfirmDeleteModal, setViewConfirmDeleteModal] = useState(false);

    const joinGroup = () => {
        if (!group.autoAdmission) {
            setViewJoinGroupModal(true);
            return;
        }
        dispatch(addUserToGroup({groupId: group.id, userHashtag: user.hashtag, notifications: false}));
        setIsMember(true)
    }

    const leftGroup = () => {
        dispatch(removeUserFromGroup({
            groupId: group.id, userHashtag: user.hashtag
        }));
        navigation.goBack()
    }

    const switchNotifications = () => {

        const updatedGroupMembers = group.groupMembers.map(member => {

            if (member.userReference === `/users/${user.hashtag}`) {
                return {
                    ...member, notifications: !receiveNotification
                };
            } else {
                return member;
            }
        });

        const updatedGroup = {
            ...group, groupMembers: updatedGroupMembers
        };
        setReceiveNotification(!receiveNotification)

        dispatch(updateGroupInFirestore(updatedGroup));
    };

    const handleDeleteGroup = () => {
        dispatch(deleteGroup(group.id))
        navigation.goBack()
        alert("Group deleted successfully")
    }

    return (<View style={defaultStyles.container}>
        {viewJoinGroupModal ? <JoinGroupModal
            modalVisible={viewJoinGroupModal}
            setModalVisible={setViewJoinGroupModal}
            groupId={group.id}
        /> : null}
        {viewConfirmDeleteModal ? <ConfirmActionModal modalVisible={viewConfirmDeleteModal}
                                                      setModalVisible={setViewConfirmDeleteModal}
                                                      onClick={() => handleDeleteGroup()}
                                                      text={"Are you sure you want to delete this group?"}
                                                      title={"Delete Group"}/> : null}
        {viewInviteModal ?
            <InviteGroupModal setModalVisible={setViewInviteModal} modalVisible={viewInviteModal}/> : null}
        {viewEditGroupModal ? <NewGroupModal
            modalVisible={viewEditGroupModal}
            setModalVisible={setViewEditGroupModal}
            group={group}
            edit={true}
        /> : null}
        <BackButton/>
        <View style={styles.content} boxShadow={defaultStyles.dropShadow}>
            <View style={{justifyContent: "space-between", flexDirection: "row", alignItems: "start"}}>
                <View>
                    <Text style={defaultStyles.title}>{group.name}</Text>
                    <Text style={defaultStyles.subtitle}>{group.id}</Text>
                </View>
                {
                    isOwner ?
                        <View style={{flexDirection: "row", gap: 10}}>
                            <TouchableOpacity onPress={() => {
                                setViewEditGroupModal(!viewEditGroupModal)
                            }}>
                                <MaterialIcons name={"edit"} size={24} style={{color: colors.secondary}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setViewConfirmDeleteModal(!viewConfirmDeleteModal)
                            }}>
                                <MaterialIcons name={"delete"} size={24} style={{color: colors.secondary}}/>
                            </TouchableOpacity>
                        </View> : null
                }
            </View>
            <Text
                style={[defaultStyles.input, defaultStyles.text, {
                    borderRadius: 20, textAlignVertical: "top", paddingVertical: 12, paddingHorizontal: 16,
                }]}
            >{group.description}</Text>
            {isOwner ? <Button text={"Make an Announcement"} onClick={() => {
                navigation.navigate("MakeAnouncement", {groupId: group.id})
            }}/> : <Button text={"Owner Details"} onClick={() => {
                navigation.navigate("Profile", {userHashtag: group.ownerId})
            }}
            />}
            {isOwner ? <Button style={{backgroundColor: colors.tertiary}}
                               text={"Invite"} onClick={() => setViewInviteModal(true)}/> :
                <View style={{flexDirection: "row", flex: 0, gap: "3%"}}>
                    {!isMember ? <Button style={{backgroundColor: colors.tertiary, width: "100%"}}
                                         text={"Join Group"} onClick={joinGroup}/> : <>
                        <Button style={{backgroundColor: colors.tertiary, width: "77%"}}
                                text={"Left Group"} onClick={leftGroup}/>
                        <NotificationButton
                            style={{width: "20%"}}
                            onClick={switchNotifications}
                            receiveNotification={receiveNotification}
                            setReceiveNotification={setReceiveNotification}
                        />
                    </>}
                </View>}

            <View style={{
                backgroundColor: colors.white, paddingHorizontal: 5, paddingVertical: 12, borderRadius: 20
            }}>
                <View style={{
                    flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingBottom: 6
                }}>
                    <MaterialIcons name={"group"} size={24} style={{color: colors.secondary}}/>
                    <Text
                        style={[defaultStyles.title, {color: colors.secondary}]}>{group?.groupMembers?.length ?? 0}</Text>
                </View>
                <View
                    style={{
                        flexDirection: "column",
                        backgroundColor: colors.absoluteWhite,
                        borderRadius: 20,
                        overflow: "hidden",
                        boxShadow: "inset 0px 1px 3px rgba(0, 0, 0, 0.5)",
                    }}>
                    <FlatList
                        data={group.groupMembers}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (<View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <GroupUserListCard memberRef={item} isOwner={isOwner}
                                               groupId={group.id}/>
                        </View>)}
                    />
                </View>
            </View>
        </View>
    </View>)


}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    }, content: {
        flex: 0,
        justifyContent: 'center',
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
        borderRadius: 20,
        backgroundColor: colors.absoluteWhite,
        gap: 20,
    },
})