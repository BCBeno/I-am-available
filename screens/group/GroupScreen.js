import {FlatList, View} from "react-native";
import {useEffect, useState} from "react";
import GroupListingCard from "../../components/group/GroupListingCard";
import NewGroupModal from "../../components/group/NewGroupModal";
import {defaultStyles} from "../../default-styles";
import {useSelector} from "react-redux";
import TopBar from "../../components/TopBar";

export default function GroupScreen() {
    const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);

    const user = useSelector(state => state.user);
    const groups = useSelector(state => state.groups);

    const [searchText, setSearchText] = useState("");

    const [filteredGroups, setFilteredGroups] = useState(groups.filter((group) => user.groupIdList.includes(group.id)));

    useEffect(() => {
        if (searchText !== "") {
            setFilteredGroups((groups.filter((group) => (group.groupHashtag.includes(searchText) || group.groupName.includes(searchText))
            )));
        } else {
            setFilteredGroups(groups.filter((group) => user.groupIdList.includes(group.id)));
        }
    }, [searchText, groups]);

    return (
        <>
            <TopBar style={{paddingTop: "15%"}} setText={setSearchText}/>
            <View style={[defaultStyles.container, {paddingTop: "5%"}]}>
                <FlatList
                    data={filteredGroups}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <GroupListingCard key={item.id} groupId={item.id}/>
                    )}
                    contentContainerStyle={styles.groupList}
                    showsVerticalScrollIndicator={false}
                />
                <NewGroupModal
                    modalVisible={newGroupModalVisible}
                    setModalVisible={setNewGroupModalVisible}
                />
            </View>
        </>
    );
}

const styles = {
    groupList: {
        gap: 10,
    }
};
