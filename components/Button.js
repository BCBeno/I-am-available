import {Text, TouchableOpacity} from 'react-native';
import {colors} from "../colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Button({text, style, onClick, icon, showText}) {
    return (
        <TouchableOpacity
            onPress={onClick}
            style={[{
                backgroundColor: colors.primary,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                padding: "1%",
            }, style]}
        >
            {showText !== false ? <Text style={{
                color: colors.absoluteWhite,
                fontSize: 20,
                fontFamily: "Poppins_600SemiBold",
            }}>{text}</Text> : null}
            {icon ? <MaterialIcons name={icon.name} size={icon.size} color={icon.color}/> : null}
        </TouchableOpacity>
    )
}