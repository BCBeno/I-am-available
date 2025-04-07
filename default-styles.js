import {colors} from "./colors";
import {StyleSheet} from "react-native";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: colors.white,
        paddingHorizontal: "5%",
        paddingTop: "20%",
        justifyContent: 'flex-start',
        gap: 20,
    },
    buttonText: {
        color: colors.absoluteWhite,
        textAlign: "center",
    },
    title: {
        fontSize: 16,
        color: colors.black,
        fontFamily: "Poppins_400Regular",
    },
    subtitle: {
        fontSize: 16,
        color: colors.black,
        fontFamily: "Poppins_200ExtraLight",
    },
    text: {
        fontSize: 14,
        color: colors.black,
        fontFamily: "Poppins_400Regular",
    },
    input: {
        width: "100%",
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.white,
        fontFamily: "Poppins_400Regular",
    },
    dropShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
});
