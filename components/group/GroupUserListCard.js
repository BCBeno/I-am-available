import {Text, TouchableOpacity, View} from 'react-native'
import {colors} from "../../colors";
import {defaultStyles} from "../../default-styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useDispatch, useSelector} from "react-redux";
import {updateGroup} from "../../redux/slices/groupSlice";
import {useState} from "react";
import ConfirmActionModal from "../ConfirmActionModal";

export default function GroupUserListCard({member, isOwner, groupId}) {

    const dispatch = useDispatch();

    const group = useSelector(state => state.groups).find(group => group.id === groupId);

    const [showConfirmModal, setShowConfirmModal] = useState(false);


    const onDeleteMember = () => {
        const updatedGroupMembers = group.groupMembers.filter(
            (groupMember) => groupMember.id !== member.id
        );

        const updatedGroup = {
            ...group,
            groupMembers: updatedGroupMembers
        };

        dispatch(updateGroup(updatedGroup));
    };

    return (
        <>
            {showConfirmModal ?
                <ConfirmActionModal modalVisible={showConfirmModal} setModalVisible={setShowConfirmModal}
                                    onClick={onDeleteMember}
                                    title={`Proceed into deletion of user '${member.username}'?`}/>
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
                    isOwner ?
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