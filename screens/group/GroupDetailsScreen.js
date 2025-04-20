import {useNavigation, useRoute} from "@react-navigation/native";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {defaultStyles} from "../../default-styles";
import BackButton from "../../components/BackButton";
import {colors} from "../../colors";
import Button from "../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import NotificationButton from "../../components/group/NotificationButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GroupUserListCard from "../../components/group/GroupUserListCard";
import {updateGroup} from "../../redux/slices/groupSlice";
import {addGroupToUser, removeGroupFromUser} from "../../redux/slices/userSlice";
import {useState} from "react";
import JoinGroupModal from "../../components/group/JoinGroupModal";
import InviteGroupModal from "../../components/group/InviteGroupModal";

export default function GroupDetailsScreen() {

    const navigation = useNavigation()

    const route = useRoute();
    const {groupId} = route.params;

    const dispatch = useDispatch();

    const group = useSelector(state => state.groups).find(group => group.id === groupId);

    const user = useSelector(state => state.user);

    const isOwner = user.id === group.ownerId;

    const isMember = group.groupMembers.some(member => member.id === user.id);

    const [viewJoinGroupModal, setViewJoinGroupModal] = useState(false);

    const [receiveNotification, setReceiveNotification] = useState(group.groupMembers.find(member => member.id === user.id)?.notifications ?? false);

    const [viewInviteModal, setViewInviteModal] = useState(false);

    const joinGroup = () => {
        if (!group.autoAdmission) {
            setViewJoinGroupModal(true);
            return;
        }

        const updatedGroup = {
            ...group,
            groupMembers: [...group.groupMembers, user],
        };

        dispatch(updateGroup(updatedGroup));
        dispatch(addGroupToUser(updatedGroup.id))
    }

    const leftGroup = () => {
        const updatedGroup = {
            ...group,
            groupMembers: group.groupMembers.filter(member => member.id !== user.id),
        };

        dispatch(updateGroup(updatedGroup));
        dispatch(removeGroupFromUser(updatedGroup.id))
    }

    const switchNotifications = () => {
        setReceiveNotification(!receiveNotification)

        const updatedGroupMembers = group.groupMembers.map(member => {
            if (member.id === user.id) {
                return {
                    ...member,
                    notifications: !member.notifications
                };
            }
            return member;
        });

        const updatedGroup = {
            ...group,
            groupMembers: updatedGroupMembers
        };

        dispatch(updateGroup(updatedGroup));
    };

    return (
        <View style={defaultStyles.container}>
            {
                viewJoinGroupModal ?
                    <JoinGroupModal
                        modalVisible={viewJoinGroupModal}
                        setModalVisible={setViewJoinGroupModal}
                        groupId={group.id}
                    /> : null
            }
            {
                viewInviteModal ?
                    <InviteGroupModal setModalVisible={setViewInviteModal} modalVisible={viewInviteModal}/> : null
            }
            <BackButton/>
            <View style={styles.content} boxShadow={defaultStyles.dropShadow}>
                <View>
                    <Text style={defaultStyles.title}>{group.groupName}</Text>
                    <Text style={defaultStyles.subtitle}>{group.groupHashtag}</Text>
                </View>
                <Text
                    style={[
                        defaultStyles.input,
                        defaultStyles.text,
                        {
                            borderRadius: 20,
                            textAlignVertical: "top",
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                        }
                    ]}
                >{group.description}</Text>
                {
                    isOwner ?
                        <Button text={"Make an Announcement"} onClick={() => {
                            navigation.navigate("MakeAnouncement", {groupId: group.id})
                        }}/> :
                        <Button text={"Owner Details"}
                        />
                }
                {isOwner ?
                    <Button style={{backgroundColor: colors.tertiary}}
                            text={"Invite"} onClick={() => setViewInviteModal(true)}/> :
                    <View style={{flexDirection: "row", flex: 0, gap: "3%"}}>
                        {
                            !isMember ?
                                <Button style={{backgroundColor: colors.tertiary, width: "100%"}}
                                        text={"Join Group"} onClick={joinGroup}/> :
                                <>
                                    <Button style={{backgroundColor: colors.tertiary, width: "77%"}}
                                            text={"Left Group"} onClick={leftGroup}/>
                                    <NotificationButton
                                        style={{width: "20%"}}
                                        onClick={switchNotifications}
                                        receiveNotification={receiveNotification}
                                        setReceiveNotification={setReceiveNotification}
                                    />
                                </>
                        }
                    </View>
                }

                <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: 5,
                    paddingVertical: 12,
                    borderRadius: 20
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingHorizontal: 12,
                        paddingBottom: 6
                    }}>
                        <MaterialIcons name={"group"} size={24} style={{color: colors.secondary}}/>
                        <Text
                            style={[defaultStyles.title, {color: colors.secondary}]}>{group.groupMembers.length}</Text>
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
                            renderItem={({item}) => (
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <GroupUserListCard member={item} isOwner={isOwner} groupId={group.id}/>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
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