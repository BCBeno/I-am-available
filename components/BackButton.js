import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {colors} from "../colors";
import {defaultStyles} from "../default-styles";

export default function BackButton() {

    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.buttonWrapper}>
                <MaterialIcons name="arrow-back" size={styles.icon.size} color={colors.black}/>
                <Text style={defaultStyles.title}>Back</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        size: 24,
    }
})