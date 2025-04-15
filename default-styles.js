import { colors } from "./colors";

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

  // New Styles for GroupRequests screen
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

  // New Styles for RequestItem screen
  requestCard: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
    marginVertical: 10,
  },
  userInfo: {
    flex: 1, // Take up remaining space
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -45, // Ensure no extra left margin
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: colors.gray,
    borderRadius: 20, // Circular avatar
    marginRight: 5, // Reduce spacing between avatar and text
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 2, // Add slight spacing between name and username
  },
  username: {
    fontSize: 12,
    color: colors.gray,
  },
  buttons: {
    flexDirection: "column", // Stack buttons vertically
    marginLeft: 10, // Add space between user info and buttons
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
    height: 70, // Reserve space for two buttons (adjust as needed)
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
    elevation: 2, // For Android shadow
    marginVertical: 10,
    flex: 1, // Allow the card to take up remaining space
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
