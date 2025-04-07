import {StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {colors} from "../../colors";
import {defaultStyles} from "../../default-styles";
import {useState} from "react";
import Button from "../Button";
import {useDispatch, useSelector} from "react-redux";
import {addGroup} from "../../redux/slices/groupSlice";
import {addGroupToUser} from "../../redux/slices/userSlice";

export default function NewGroupForm({onClose, edit, group}) {
    const [groupName, setGroupName] = useState(group?.groupName ?? "");
    const [groupHashtag, setGroupHashtag] = useState(group?.groupHashtag ?? "");
    const [groupDescription, setGroupDescription] = useState(group?.description ?? "");
    const [publicGroup, setpublicGroup] = useState(group?.publicGroup ?? false);
    const [autoAdmission, setAutoAdmission] = useState(group?.autoAdmission ?? false);

    const groups = useSelector(state => state.groups);
    const dispatch = useDispatch();

    const user = useSelector(state => state.user);

    const handleSubmit = () => {
        if (groupName === '' && groupHashtag === '' || groupName === undefined && groupHashtag === undefined) {
            alert("Group name and hashtag are required");
            return;
        } else if (groupName === "" || groupName === undefined) {
            alert("Group name is required");
            return;
        } else if (groupHashtag === "" || groupHashtag === undefined) {
            alert("Group hashtag is required");
            return;
        }

        if (groups.filter(group => group.groupHashtag === groupHashtag).length > 0) {
            alert("This Group hashtag already exists");
            return;
        }

        const newGroup = {
            groupName: groupName,
            groupHashtag: groupHashtag,
            groupDescription: groupDescription,
            publicGroup: publicGroup,
            autoAdmission: autoAdmission,
            groupMembers: [],
            ownerId: user.id,
        }

        dispatch(addGroupToUser(newGroup));
        dispatch(addGroup(newGroup));

        alert("Group created successfully");
        onClose();
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputList}>
                <View style={styles.inputWrapper}>
                    <Text style={defaultStyles.title}>Name</Text>
                    <TextInput
                        style={[defaultStyles.input, defaultStyles.text]}
                        value={groupName}
                        onChangeText={(value) => setGroupName(value)}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={defaultStyles.title}>Hashtag</Text>
                    <TextInput
                        style={[defaultStyles.input, defaultStyles.text]}
                        value={groupHashtag}
                        onChangeText={(value) => setGroupHashtag(value)}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={defaultStyles.title}>Description</Text>
                    <TextInput
                        style={[
                            defaultStyles.input,
                            defaultStyles.text,
                            {
                                height: 100,
                                borderRadius: 20,
                                textAlignVertical: "top",
                            }
                        ]}
                        multiline
                        value={groupDescription}
                        numberOfLines={4}
                        onChangeText={(value) => setGroupDescription(value)}/>
                </View>
                <View style={styles.switchesWrapper}>
                    <View style={styles.switchWrapper}>
                        <Text style={defaultStyles.title}>Public group</Text>
                        <Switch
                            value={publicGroup}
                            onValueChange={() => setpublicGroup(previousState => !previousState)}
                            trackColor={{false: colors.mediumGray, true: colors.tertiary}}
                            thumbColor={!publicGroup ? colors.lighGray : colors.primary}
                        />
                    </View>
                    <View style={styles.switchWrapper}>
                        <Text style={defaultStyles.title}>Automatic admission</Text>
                        <Switch
                            value={autoAdmission}
                            onValueChange={() => setAutoAdmission(previousState => !previousState)}
                            trackColor={{false: colors.mediumGray, true: colors.tertiary}}
                            thumbColor={!autoAdmission ? colors.lighGray : colors.primary}
                        />
                    </View>
                </View>
            </View>
            <Button text={"Create Group"} onClick={() => {
                handleSubmit()
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        paddingHorizontal: 0,
        paddingVertical: 0,
        backgroundColor: colors.absoluteWhite,
        gap: 24
    },
    inputWrapper: {
        width: "100%",
        gap: 4,
        backgroundColor: colors.absoluteWhite,
    },
    inputList: {
        width: "100%",
        gap: 20,
        backgroundColor: colors.absoluteWhite,
    },
    switchWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.absoluteWhite,
    },
    switchesWrapper: {
        width: "100%",
        gap: 0,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.absoluteWhite,
    },
})