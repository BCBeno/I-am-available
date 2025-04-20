import {colors} from "../../colors";
import {Text, TouchableOpacity, View} from "react-native";
import {defaultStyles} from "../../default-styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";

export default function GroupListingCard({groupId}) {
    const navigation = useNavigation();
    const openGroupDetails = (group) => {
        navigation.navigate("Groups", {
            screen: "GroupDetails",
            params: {groupId: group.id}
        });
    }
    const group = useSelector(state => state.groups).find(group => group.id === groupId);

    return (
        <View style={{borderRadius: 20}} boxShadow={"0px 3px 3px rgba(0, 0, 0, 0.3)"}>
            <View style={styles.container} boxShadow={"inset -3px -3px 1px rgba(124,1,82,1)"}>
                <View style={styles.titleWrapper}>
                    <Text style={defaultStyles.title}>{group.groupName} </Text>
                    <Text style={defaultStyles.subtitle}>{group.groupHashtag}</Text>
                </View>
                <View style={styles.groupMembersDetails}>
                    <View style={styles.groupMembers}>
                        <MaterialIcons
                            name="group"
                            size={styles.groupMembers.icon.size}
                            style={styles.groupMembers.icon}
                        />
                        <Text
                            style={styles.groupMembersDetails.text}>{group?.groupMembers.length ?? 0}</Text>
                    </View>
                    <TouchableOpacity onPress={() => openGroupDetails(group)}>
                        <View style={styles.groupDetails}>
                            <Text style={styles.groupMembersDetails.text}>Details </Text>
                            <MaterialIcons name="arrow-forward" size={styles.groupMembers.icon.size}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = ({
    container: {
        backgroundColor: colors.absoluteWhite,
        width: "100%",
        flexDirection: "column",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 16,
    },
    titleWrapper: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    groupMembers: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        icon: {
            color: colors.primary,
            size: 24,
        }
    },
    groupMembersDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        text: {
            fontSize: 16,
            color: colors.black,
            fontFamily: 'Poppins_300Light'
        },
    },
    groupDetails: {
        flexDirection: "row",
    }
})