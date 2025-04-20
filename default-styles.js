import {colors} from "./colors";
import {StyleSheet} from "react-native";
import { colors } from "./colors";

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
export const defaultStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 60,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.absoluteWhite,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: colors.black,
  },

  backButton: {
    backgroundColor: "transparent",
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  groupName: {
    fontWeight: "bold",
  },
  groupId: {
    fontSize: 12,
    color: colors.gray,
    paddingBottom: 10,
  },

  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -45,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    marginRight: 5,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  username: {
    fontSize: 12,
    color: colors.gray,
  },
  buttons: {
    flexDirection: "column",
    marginLeft: 10,
  },
  acceptBtn: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  rejectBtn: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
  },
  buttonPlaceholder: {
    height: 70,
    justifyContent: "center",
  },
  accepted: {
    color: colors.green,
    fontWeight: "bold",
    marginTop: 10
  },
  rejected: {
    color: colors.red,
    fontWeight: "bold",
    marginTop: 10
  },

  requestList: {
    flex: 1,
    marginTop: 10,
  },

  bigCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10,
    flex: 1,
  },

  announcement: {
    backgroundColor: "lightgray",
    elevation: 3,
    overflow: "hidden",
    padding: 20,
    borderRadius: 10,
    fontSize: 16,
    color: colors.black,
    marginVertical: 10,
    lineHeight: 22,
  },
};
