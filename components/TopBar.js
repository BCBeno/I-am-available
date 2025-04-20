import {TextInput, View} from "react-native";
import {colors} from "../colors";
import {defaultStyles} from "../default-styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TopBar({style, setText}) {
    return (
        <View style={[{
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
        }, style]}>
            <View style={{
                flexDirection: "row",
                width: "85%",
                alignItems: "center",
                backgroundColor: colors.white,
                borderRadius: 150,
            }}>
                <TextInput style={[defaultStyles.input, {paddingVertical: 4, width: "90%"}]}
                           onChangeText={(text) => setText(text)}/>
                <MaterialIcons name={'search'} size={24} color={colors.mediumGray}/>
            </View>
            <MaterialIcons name={'account-circle'} size={32} color={colors.white}/>
        </View>
    )
}