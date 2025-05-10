//ProfilePage.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    TextInput
} from 'react-native';
import defaultPhoto from '../assets/defaulticon.png';
import editIcon from '../assets/edit-button-icon.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { defaultStyles } from '../default-styles';
import BackButton from '../components/BackButton';
import { loadCompleteUserData } from '../data/userDataLoader';
import { doc, updateDoc,setDoc} from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { deleteRoleData } from '../data/deleteRoleData';
const ProfileScreen = (user) => {
    const [mockUser, setMockUser] = useState(null);
    const [tempUser, setTempUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    const [editedRoleName, setEditedRoleName] = useState('');
    const [newRoleModalVisible, setNewRoleModalVisible] = useState(false);
    const [newRoleData, setNewRoleData] = useState({ name: '', hashtag: '' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const hashtag = global.loggedInUserHashtag ?? user?.hashtag;
                const data = await loadCompleteUserData(hashtag);
                setMockUser(data);
            } catch (err) {
                console.error("❌ Failed to load user in ProfileScreen:", err);
            }
        };

        fetchUser();
    }, [user]);
      

    const saveProfileChanges = async (updatedUser) => {
        try {
            const userRef = doc(db, 'users', updatedUser.hashtag);
            await updateDoc(userRef, {
                roles: updatedUser.roles,
                photo: updatedUser.photo || '',
            });
            console.log('✅ Profile successfully updated in Firestore.');
        } catch (error) {
            console.error('❌ Failed to update profile:', error);
            Alert.alert('Error', 'Failed to save your profile changes.');
        }
    };

    const handlePickImage = async () => {
        if (!editMode) return;

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission required", "You need to allow access to media library to upload a photo.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedUri = result.assets[0].uri;

            const base64 = await FileSystem.readAsStringAsync(selectedUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            setTempUser((prev) => ({
                ...prev,
                profileImage: `data:image/jpeg;base64,${base64}`,
            }));
        }
    };

    const confirmEditRole = (hashtag) => {
        if (!editedRoleName.trim()) {
            Alert.alert('Error', 'Role name cannot be empty.');
            return;
        }

        setTempUser((prev) => ({
            ...prev,
            roles: prev.roles.map((r) =>
                r.hashtag === hashtag ? { ...r, name: editedRoleName.trim() } : r
            ),
        }));

        setEditingRole(null);
        setEditedRoleName('');
        setActiveDropdownIndex(null);
    };

    const handleEditProfile = () => {
        if (!editMode) {
            setTempUser({
                ...mockUser,
                profileImage: mockUser.photo,
                availabilities: mockUser.availabilities || [],
            });
        } else {
            setTempUser(null);
        }
        setEditMode((prev) => !prev);
    };

    const handleDeleteRole = (hashtagToDelete) => {
        setTempUser((prev) => ({
            ...prev,
            roles: prev.roles.filter((r) => r.hashtag !== hashtagToDelete),
            availabilities: prev.availabilities
                ? prev.availabilities.filter((a) => a.roleHashtag !== hashtagToDelete)
                : [],
        }));
    };

    const handleAddNewRole = () => {
        const trimmedName = newRoleData.name.trim();
        const trimmedHashtag = newRoleData.hashtag.trim();

        if (!trimmedName || !trimmedHashtag) {
            Alert.alert('Error', 'Both role name and hashtag are required.');
            return;
        }

        const hashtagExistsInUser = tempUser.roles.some(
            (r) => r.hashtag.toLowerCase() === trimmedHashtag.toLowerCase()
        );

        if (hashtagExistsInUser) {
            Alert.alert('Error', 'This hashtag is already used by one of your roles.');
            return;
        }

        const newRole = {
            name: trimmedName,
            hashtag: trimmedHashtag,
        };

        setTempUser((prev) => ({
            ...prev,
            roles: [...prev.roles, newRole],
        }));

        setNewRoleData({ name: '', hashtag: '' });
        setNewRoleModalVisible(false);
    };

    if (!mockUser) {
        return (
            <View style={defaultStyles.container}>
                <Text>Loading your profile...</Text>
            </View>
        );
    }
    
    return (
        <View style={defaultStyles.container}>
            <BackButton/>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Back Button */}
                {/* Profile Card */}
                <View style={styles.profileCard}>

                    <TouchableOpacity style={styles.editIcon} onPress={handleEditProfile}>
                        <Image source={editIcon} style={{width: 15, height: 15, borderColor: ''}}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePickImage} disabled={!editMode}>
                        <Image
                            source={
                                editMode
                                    ? tempUser?.profileImage
                                        ? {uri: tempUser.profileImage} //  In edit mode and a new image was selected → show it
                                        : defaultPhoto                   //  In edit mode but no new image selected yet → show default
                                    : mockUser.photo
                                        ? {uri: mockUser.photo}         //  In view mode and a saved photo exists → show it
                                        : defaultPhoto                    //  In view mode and no saved photo exists → show default
                            }
                            style={styles.profileImage}
                        />

                    </TouchableOpacity>


                    <Text style={styles.name}>{mockUser.name}</Text>
                    <Text style={styles.hashtag}>{mockUser.hashtag}</Text>
                    {/*The divider*/}
                    <View style={styles.divider}/>

                    <Text style={styles.rolesTitle}>User Roles</Text>


                    {(editMode ? tempUser?.roles : mockUser.roles).map((role, index) => (
                        <View key={index} style={styles.roleContainer}>
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
                                                onPress={() =>
                                                    setActiveDropdownIndex(activeDropdownIndex === index ? null : index)
                                                }
                                                style={styles.roleTouchable}
                                            >
                                                <Text style={styles.roleText}>{role.name}</Text>
                                                <Ionicons name="chevron-down" size={18} color="#555"
                                                          style={styles.dropdownIcon}/>
                                            </TouchableOpacity>

                                            {activeDropdownIndex === index && (
                                                <View style={styles.dropdownMenu}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEditingRole(role.hashtag);
                                                            setEditedRoleName(role.name);
                                                        }}
                                                    >
                                                        <Text style={styles.editText}>Edit Role Name</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            Alert.alert(
                                                                'Confirm Delete',
                                                                'Are you sure you want to delete this role?',
                                                                [
                                                                    {text: 'Cancel', style: 'cancel'},
                                                                    {
                                                                        text: 'Delete',
                                                                        style: 'destructive',
                                                                        onPress: () => handleDeleteRole(role.hashtag),
                                                                    },
                                                                ]
                                                            );
                                                        }}
                                                    >
                                                        <Text style={styles.deleteText}>Delete Profile</Text>
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
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={() => setNewRoleModalVisible(true)}
                    >
                        <Ionicons name="add" size={40} color="#fff"/>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => {
                            let updatedTempUser = {...tempUser};

                            if (editingRole && editedRoleName.trim()) {
                                updatedTempUser.roles = updatedTempUser.roles.map((r) =>
                                    r.hashtag === editingRole ? {...r, name: editedRoleName.trim()} : r
                                );
                            }

                            if (tempUser?.profileImage) {
                                updatedTempUser.photo = tempUser.profileImage;
                            }
                            saveProfileChanges({
                                ...updatedTempUser,
                                availabilities: updatedTempUser.availabilities || [],
                            });
                            setMockUser(updatedTempUser);
                            setTempUser(null);
                            setEditMode(false);
                            setEditingRole(null);
                            setEditedRoleName('');

    
                        }}
                    >
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>

                </View>
            )}
            {showOptions && (
                <View style={styles.modalOverlay}>
                    <View style={styles.optionsBox}>
                        <Text style={styles.optionTitle}>{selectedRole?.name}</Text>

                        <TouchableOpacity onPress={() => {
                            setEditingRole(selectedRole.hashtag);
                            setEditedRoleName(selectedRole.name);
                            setShowOptions(false);
                            setActiveDropdownIndex(null);
                        }}>
                            <Text style={styles.optionText}>Edit Role Name</Text>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => {
                            // TODO: handle delete
                            alert(`Delete "${selectedRole.name}"`);
                            setShowOptions(false);
                        }}>
                            <Text style={[styles.optionText, {color: 'red'}]}>Delete Role</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowOptions(false)}>
                            <Text style={[styles.optionText, {color: '#888'}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
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
                            onChangeText={(text) => setNewRoleData({...newRoleData, name: text})}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Hashtag"
                            value={newRoleData.hashtag}
                            onChangeText={(text) => setNewRoleData({...newRoleData, hashtag: text})}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => {
                                    setNewRoleModalVisible(false);
                                    setNewRoleData({name: '', hashtag: ''});
                                }}
                            >
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => handleAddNewRole()}>
                                <Text style={styles.modalConfirm}>Add Role</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

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

});

export default ProfileScreen;
