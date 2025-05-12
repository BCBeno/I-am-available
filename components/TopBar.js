import { TextInput, TouchableOpacity, View, Image } from "react-native";
import { colors } from "../colors";
import { defaultStyles } from "../default-styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import defaultIcon from "../assets/defaulticon.png"; 

export default function TopBar({ style, setText, user, setLoggedInUser, hideSearch }) {
    const navigation = useNavigation();

    const profileImageSource = user?.photo
        ? { uri: user.photo }
        : defaultIcon;

    return (
        <View style={[
            {
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                paddingBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            },
            style
        ]}>
            <View style={{ position: "relative", width: "85%" }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.white,
                    borderRadius: 150,
                    paddingHorizontal: 10,
                }}>
                    <TextInput
                        style={[defaultStyles.input, { paddingVertical: 4, flex: 1 }]}
                        onChangeText={(text) => setText(text)}
                    />
                    <MaterialIcons name={'search'} size={24} color={colors.mediumGray} />
                </View>

                            {hideSearch && (
                <View style={{
                    position: "absolute",
                    top: -2, 
                    left: -2,  
                    right: -2,   
                    bottom: -2,  
                    backgroundColor: colors.primary,
                    borderRadius: 160, 
                    zIndex: 1
                }} />
            )}
            </View>

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ProfileFlow', {
                        user: user,
                        setLoggedInUser: setLoggedInUser
                    })
                }
            >
                <Image
                    source={profileImageSource}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        marginLeft: 10,
                        backgroundColor: '#ccc',
                    }}
                />
            </TouchableOpacity>
        </View>
    );
}
