import {Text, TouchableOpacity} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {colors} from "../../colors";
import {useEffect, useState} from "react";

export default function NotificationButton({style, onClick, receiveNotification, setReceiveNotification}) {

    useEffect(() => {
        switch (receiveNotification) {
            case false:
                setBackgroundColor(colors.mediumGray);
                setIconColor(colors.white);
                setIconName('notifications');
                break;

            case true:
                setBackgroundColor(colors.secondary);
                setIconColor(colors.white);
                setIconName('notifications-active');
                break;
        }
    }, [receiveNotification]);

    const [backgoundColor, setBackgroundColor] = useState(colors.mediumGray);
    const [iconColor, setIconColor] = useState(colors.white);
    const [iconName, setIconName] = useState('notifications');

    return (
        <TouchableOpacity
            onPress={onClick}
            style={[{
                backgroundColor: backgoundColor,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                padding: "1%",
            }, style]}
        ><MaterialIcons name={iconName} size={20} color={iconColor}/>
        </TouchableOpacity>
    )
}