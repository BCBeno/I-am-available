import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    StyleSheet
} from 'react-native';
import defaultPhoto from '../assets/defaulticon.png';
import editIcon from '../assets/edit-button-icon.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {defaultStyles} from '../default-styles';
import BackButton from '../components/BackButton';
import {loadCompleteUserData} from '../data/userDataLoader';
import {deleteRoleData} from '../data/deleteRoleData';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import {getDoc, doc, setDoc, updateDoc} from 'firebase/firestore';
import {db} from '../firebaseconfig';
import {getAuth, signOut} from 'firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {deleteGroup} from "../redux/slices/groupSlice";
import {fetchUser, updateUser} from "../redux/slices/userSlice";

const UserProfileScreen = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);
    const navigation = useNavigation();

    const [deletedRoleHashtags, setDeletedRoleHashtags] = useState([]);
    const [mockUser, setMockUser] = useState(null);
    const [tempUser, setTempUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    const [editedRoleName, setEditedRoleName] = useState('');
    const [newRoleModalVisible, setNewRoleModalVisible] = useState(false);
    const [newRoleData, setNewRoleData] = useState({name: '', hashtag: ''});
    const [newHashtagsToCreate, setNewHashtagsToCreate] = useState([]);
    const [confirmDisabled, setConfirmDisabled] = useState(false);

    useEffect(() => {
        setMockUser(user);
    }, [user, tempUser]);

    const saveProfileToFirestore = async (updatedUser) => {
        try {
            const userRef = doc(db, 'users', updatedUser.hashtag);
            dispatch(updateUser({userData: updatedUser}));
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to save your profile changes.');
        }
    };

    const handlePickImage = async () => {
        if (!editMode) return;
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Allow access to media library to upload a photo.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const base64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64});
            setTempUser(prev => ({...prev, profileImage: `data:image/jpeg;base64,${base64}`}));
        }
    };

    const confirmEditRole = (hashtag) => {
        if (!editedRoleName.trim()) {
            Alert.alert('Error', 'Role name cannot be empty.');
            return;
        }
        setTempUser(prev => ({
            ...prev,
            roles: prev.roles.map(r => r.hashtag === hashtag ? {...r, name: editedRoleName.trim()} : r)
        }));
        setEditingRole(null);
        setEditedRoleName('');
        setActiveDropdownIndex(null);
    };

    const handleEditProfile = () => {
        if (!editMode) {
            setTempUser({...mockUser, profileImage: mockUser.photo, availabilities: mockUser.availabilities || []});
        } else {
            setTempUser(null);
        }
        setEditMode(prev => !prev);
    };

    const handleDeleteRole = (hashtagToDelete) => {
        // Update local view
        setTempUser(prev => ({
            ...prev,
            roles: prev.roles.filter(r => r.hashtag !== hashtagToDelete),
            availabilities: prev.availabilities?.filter(a => a.roleHashtag !== hashtagToDelete)
        }));
        setDeletedRoleHashtags(prev => [...prev, hashtagToDelete]);
    };

    const handleAddNewRole = async () => {
        const name = newRoleData.name.trim();
        const hashtag = newRoleData.hashtag.trim();
        if (!name || !hashtag) {
            Alert.alert('Error', 'Both role name and hashtag are required.');
            return;
        }
        if (tempUser.roles.some(r => r.hashtag.toLowerCase() === hashtag.toLowerCase())) {
            Alert.alert('Error', 'This hashtag is already used by one of your roles.');
            return;
        }
        const docRef = doc(db, 'hashtags', hashtag);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            Alert.alert('Error', 'This hashtag is already used by another user.');
            return;
        }
        const newRole = {name, hashtag};
        setTempUser(prev => ({...prev, roles: [...prev.roles, newRole]}));
        setNewHashtagsToCreate(prev => [...prev, hashtag]);
        setNewRoleData({name: '', hashtag: ''});
        setNewRoleModalVisible(false);
      };

    const onBackPressHandler = () => {
        if (editMode) {
            Alert.alert('Discard Changes?', 'You have unsaved changes. Discard them?', [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Discard', style: 'destructive', onPress: () => {
                        setEditMode(false);
                        setTempUser(null);
                        navigation.goBack();
                    }
                }
            ]);
            return true;
        }
        return false;
    };

    const focusCallback = React.useCallback(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPressHandler);
        const unsubscribe = navigation.addListener('beforeRemove', e => {
            if (!editMode) return;
            e.preventDefault();
            Alert.alert('Discard Changes?', 'You have unsaved changes. Discard them?', [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Discard', style: 'destructive', onPress: () => {
                        setEditMode(false);
                        setTempUser(null);
                        navigation.dispatch(e.data.action);
                    }
                }
            ]);
        });
        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [editMode, navigation]);

    useFocusEffect(focusCallback);

    if (!mockUser) {
        return (
            <View style={defaultStyles.container}>
                <Text>Loading your profile...</Text>
            </View>
        );
    }

    return (
        <View style={defaultStyles.container}>
            <View style={styles.topBarContainer}>
                <BackButton/>
                {!editMode && (
                    <TouchableOpacity style={styles.logoutButton}
                                      onPress={() => Alert.alert('Log Out', 'Are you sure?', [
                                          {text: 'Cancel', style: 'cancel'},
                                          {
                                              text: 'Log Out', style: 'destructive', onPress: async () => {
                                                  try {
                                                      await signOut(getAuth());
                                                      dispatch(updateUser(null));
                                                  } catch (err) {
                                                      Alert.alert('Error', 'Logout failed');
                                                  }
                                              }
                                          }
                                      ])}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileCard}>
                    <TouchableOpacity style={styles.editIcon} onPress={handleEditProfile}>
                        <Image source={editIcon} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePickImage} disabled={!editMode}>
                        <Image
                            source={editMode ? (tempUser.profileImage ? {uri: tempUser.profileImage} : defaultPhoto)
                                : (mockUser.photo ? {uri: mockUser.photo} : defaultPhoto)}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.name}>{mockUser.name}</Text>
                    <Text style={styles.hashtag}>{mockUser.hashtag}</Text>
                    <View style={styles.divider}/>
                    <Text style={styles.rolesTitle}>User Roles</Text>
                    {(editMode ? tempUser.roles : mockUser.roles).map((role, idx) => (
                        <View key={idx} style={styles.roleContainer}>
                            <Text style={styles.hashtagText}>{role.hashtag}</Text>
                            <View style={styles.roleCard}>
                                {editMode ? (
                                    editingRole === role.hashtag ? (
                                        <TextInput
                                            style={styles.roleInput}
                                            value={editedRoleName}
                                            onChangeText={setEditedRoleName}
                                            onSubmitEditing={() => confirmEditRole(role.hashtag)}
                                            placeholder="New role name"
                                            returnKeyType="done"
                                            autoFocus
                                        />
                                    ) : (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => setActiveDropdownIndex(activeDropdownIndex === idx ? null : idx)}
                                                style={styles.roleTouchable}
                                            >
                                                <Text style={styles.roleText}>{role.name}</Text>
                                                <Ionicons name="chevron-down" size={18} color="#555"
                                                          style={styles.dropdownIcon}/>
                                            </TouchableOpacity>
                                            {activeDropdownIndex === idx && (
                                                <View style={styles.dropdownMenu}>
                                                    <TouchableOpacity onPress={() => {
                                                        setEditingRole(role.hashtag);
                                                        setEditedRoleName(role.name);
                                                    }}>
                                                        <Text style={styles.editText}>Edit Role Name</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => Alert.alert('Confirm Delete', 'Delete this role?', [
                                                            {text: 'Cancel', style: 'cancel'},
                                                            {
                                                                text: 'Delete',
                                                                style: 'destructive',
                                                                onPress: () => handleDeleteRole(role.hashtag)
                                                            }
                                                        ])}>
                                                        <Text style={styles.deleteText}>Delete Role</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <Text style={styles.roleText}>{role.name}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {editMode && (
                <View style={styles.footerButtons}>
                    <TouchableOpacity style={styles.floatingButton} onPress={() => setNewRoleModalVisible(true)}>
                        <Ionicons name="add" size={40} color="#fff"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.confirmButton, confirmDisabled && {opacity: 0.6}]}
                        disabled={confirmDisabled}
                        onPress={async () => {
                            setConfirmDisabled(true);
                            let updated = {...tempUser};
                            if (editingRole && editedRoleName.trim()) {
                                updated.roles = updated.roles.map(r => r.hashtag === editingRole ? {
                                    ...r,
                                    name: editedRoleName.trim()
                                } : r);
                            }
                            if (tempUser.profileImage) updated.photo = tempUser.profileImage;
                            await saveProfileToFirestore(updated);
                            for (const tag of newHashtagsToCreate) {
                                try {
                                    await setDoc(doc(db, 'hashtags', tag), {
                                        value: tag,
                                        type: 'hashtag',
                                        createdAt: new Date().toISOString()
                                    });
                                } catch (e) {
                                    console.warn(e);
                                }
                            }
                            for (const tag of deletedRoleHashtags) {
                                try {
                                    await deleteRoleData(tag, user.hashtag);
                                } catch {
                                }

                            }
                            // Reload fresh user
                            const fresh = await loadCompleteUserData(updated.hashtag);

                            dispatch(fetchUser(user.hashtag))
                            setMockUser(user);
                            // reset
                            setTempUser(null);
                            setEditMode(false);
                            setEditingRole(null);
                            setEditedRoleName('');
                            setDeletedRoleHashtags([]);
                            setNewHashtagsToCreate([]);
                            setTimeout(() => setConfirmDisabled(false), 5000);
                        }}
                        >
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
            {newRoleModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.optionsBox}>
                        <Text style={styles.optionTitle}>Create New Role</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Role Name"
                            value={newRoleData.name}
                            onChangeText={text => setNewRoleData({...newRoleData, name: text})}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Hashtag"
                            value={newRoleData.hashtag}
                            onChangeText={text => setNewRoleData({...newRoleData, hashtag: text})}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => {
                                setNewRoleModalVisible(false);
                                setNewRoleData({name: '', hashtag: ''});
                            }}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddNewRole}>
                                <Text style={styles.modalConfirm}>Add Role</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    roleInput: {
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: '500',
    },

    deleteText: {
        color: 'red',
        fontSize: 16,
        marginVertical: 5,
    },

    dropdownMenu: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 99,
    },

    dropdownItem: {
        paddingVertical: 6,
    },

    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },

    dropdownArrow: {
        fontSize: 18,
        marginLeft: 10,
    },

    dropdownMenu: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        elevation: 4,
    },

    dropdownItem: {
        fontSize: 16,
        paddingVertical: 5,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20,
    },

    modalCancel: {
        color: 'gray',
        fontSize: 16,
    },

    modalConfirm: {
        color: '#80004d',
        fontWeight: 'bold',
        fontSize: 16,
    },

    modalOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionsBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '80%',
        elevation: 6,
    },

    optionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },

    optionText: {
        fontSize: 16,
        paddingVertical: 8,
    },

    container: {
        padding: 20,
        paddingBottom: 100,
        justifyContent: 'center',
    },
    backContainer: {
        marginBottom: 10,
        marginTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Poppins'
    },
    arrow: {
        fontSize: 20,
        marginRight: 6,
    },
    backText: {
        fontSize: 16,
        fontFamily: 'Poppins'
    },
    profileCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 25,
        elevation: 5,
        position: 'relative',
        alignItems: 'center',
    },
    editIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 6,
        elevation: 3,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    hashtag: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    sectionTitle: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    roleCard: {

        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        width: '90%',
        justifyContent: 'center',
    },
    hashtagText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    roleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },


    footerButtons: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },


    plusButton: {

        backgroundColor: '#80004d',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 6,
    },
    plusText: {
        fontSize: 50,
        color: '#fff',
    },
    confirmButton: {
        backgroundColor: '#80004d',
        paddingVertical: 14,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
    },


    rolesTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    roleContainer: {
        marginBottom: 20,
        alignItems: 'flex-start',
        width: '90%',
        alignSelf: 'center',
    },

    hashtagText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 6,
        marginLeft: 10,
    },

    roleCard: {
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },

    roleText: {
        fontSize: 16,
        color: '#000',
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15,
        width: '90%',
        alignSelf: 'center',
    },
    roleTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dropdownIcon: {
        marginLeft: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 90,
        alignSelf: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#7C0152',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    topBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    logoutButton: {
        padding: 10,
    },

    logoutText: {
        color: '#80004d',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default UserProfileScreen;
