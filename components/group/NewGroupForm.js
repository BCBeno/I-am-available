import {StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {colors} from '../../colors';
import {defaultStyles} from '../../default-styles';
import {useEffect, useState} from 'react';
import Button from '../Button';
import {useDispatch, useSelector} from 'react-redux';
import {addGroup, createOrUpdateGroup} from '../../redux/slices/groupSlice';
import {addGroupToUserInFirebase} from '../../redux/slices/userSlice';
import {db} from '../../firebaseconfig';
import {doc, getDoc, setDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import {Picker} from '@react-native-picker/picker';

export default function NewGroupForm({onClose, edit, group}) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);
    const groups = useSelector(state => state.groups.items);

    const [groupName, setGroupName] = useState(group?.name ?? '');
    const [groupHashtag, setGroupHashtag] = useState(group?.id ?? '');
    const [groupDescription, setGroupDescription] = useState(group?.description ?? '');
    const [publicGroup, setPublicGroup] = useState(group?.public ?? false);
    const [autoAdmission, setAutoAdmission] = useState(group?.autoAdmission ?? false);
    const [selectedRole, setSelectedRole] = useState(group?.ownerRoleHashtag ?? '');
    const [groupMembers, setGroupMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState(group?.joinRequests ?? []);

    useEffect(() => {
        if (edit) {
            setGroupMembers(group.groupMembers);
        } else {
            setGroupMembers([{
                userReference: `/users/${user.hashtag}`, notifications: false,
            },]);
        }
    }, [edit, group, user.hashtag, selectedRole]);

    const handleSubmit = async () => {
        if (!groupName) return alert('Group name is required');
        if (!groupHashtag) return alert('Group hashtag is required');
        if (!selectedRole) return alert('Associated role is required');
        if (groups.some(g => g.id === groupHashtag) && (!edit || group.id !== groupHashtag)) {
            return alert('This Group hashtag already exists');
        }

        const newGroup = {
            id: groupHashtag,
            name: groupName,
            description: groupDescription,
            public: publicGroup,
            autoAdmission: autoAdmission,
            groupMembers: groupMembers,
            ownerId: user.hashtag,
            ownerRoleHashtag: selectedRole,
            ownerAvailable: false,
            joinRequests: joinRequests,
        };

        try {
            await dispatch(createOrUpdateGroup({groupId: newGroup.id, groupData: newGroup, userHashtag: user.hashtag}));
            alert(edit ? 'Group updated successfully' : 'Group created successfully');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Não foi possível salvar. Tente novamente.');
        }
    };

    return (<View style={styles.container}>
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
                    style={[defaultStyles.input, defaultStyles.text, edit ? {backgroundColor: colors.lighGray} : {}]}
                    value={groupHashtag}
                    editable={!edit}
                    onChangeText={(value) => setGroupHashtag(value)}
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={defaultStyles.title}>Associated Role</Text>
                <View style={[defaultStyles.input, {paddingVertical: 0}]}>
                    <Picker
                        selectedValue={selectedRole}
                        onValueChange={(itemValue) => setSelectedRole(itemValue)}
                    >
                        {user.roles?.map((role, index) => (
                                <Picker.Item label={role.name} value={role.hashtag} key={index}/>)) ??
                            <Picker.Item label="No roles available" value="" enabled={false}/>}
                    </Picker>
                </View>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={defaultStyles.title}>Description</Text>
                <TextInput
                    style={[defaultStyles.input, defaultStyles.text, {
                        height: 100, borderRadius: 20, textAlignVertical: "top",
                    }]}
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
                        onValueChange={() => setPublicGroup(previousState => !previousState)}
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
        <Button text={!edit ? "Create Group" : "Save Changes"} onClick={() => {
            handleSubmit()
        }}/>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        width: "90%", paddingHorizontal: 0, paddingVertical: 0, backgroundColor: colors.absoluteWhite, gap: 24
    }, inputWrapper: {
        width: "100%", gap: 4, backgroundColor: colors.absoluteWhite,
    }, inputList: {
        width: "100%", gap: 20, backgroundColor: colors.absoluteWhite,
    }, switchWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.absoluteWhite,
    }, switchesWrapper: {
        width: "100%",
        gap: 0,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.absoluteWhite,
    },
})
