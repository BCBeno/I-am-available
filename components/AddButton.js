import {TouchableOpacity} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {colors} from "../colors";

export default function AddButton({onPress, style}) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[{
                backgroundColor: colors.primary,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                padding: "1%",
                width: "100%"
            }, style]}
        >
            <MaterialIcons name={"add"} size={48} color="#FFFFFF"/>
        </TouchableOpacity>
    );
}