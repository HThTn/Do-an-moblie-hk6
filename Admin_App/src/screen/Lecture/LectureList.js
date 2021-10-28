
import React, { useContext, useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import HeaderText from '../../components/HeaderText';
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack';
import Modal from 'react-native-modal';

const Stack = createStackNavigator();

import { facultyList, apiURL, facultyToVN } from '../../config/config';
import { LectureUtils } from '../../utils'
import styles from '../../style/style';
import TokenContext from '../../Context/TokenContext';
import Text from '../../components/Text'
import LectureDetail from './LectureDetail';
import LoadingDataModal from '../../components/LoadingDataModal'
import FlatList from '../../components/FlatList';
import CustomButton from '../../components/Button'
import Search from '../../components/Search'
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { mainWhite } from '../../style/color';

const LectureList = ({ navigation }) => {

    const token = useContext(TokenContext);

    const [lectureList, setLectureList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [faculty, setFaculty] = useState(false);
    const [dumpFaculty, setDumpFaculty] = useState(false)
    const [loadingDataModal, setLoadingDataModal] = useState(true);
    const [keyWord, setKeyWord] = useState('');

    useEffect(async () => {


        return () => {
            setLectureList();
            setDataLecture();
            setKeyWord();
            setDumpFaculty();
            setFaculty();
        }
    }, [])

    useEffect(async () => {
        search()
    }, [keyWord])
    useEffect(async () => {
        search()
    }, [faculty])

    useEffect(async () => {
        const unsubscribe = navigation.addListener('focus', () => {
            search();
        });
        return () => {
            unsubscribe
        }
    }, [navigation])

    const search = async () => {
        await setLoadingDataModal(true)
        const query = {
            token: token,
            faculty: faculty ? faculty : '',
            sort: '-updatedAt'
        }

        await LectureUtils.getAllLecture(query).then(async (res) => {
            await setLectureList(res.data.filter(val => {
                return val.full_name.toLowerCase().includes(keyWord.toLowerCase()) ||
                    val.email.toLowerCase().includes(keyWord.toLowerCase())

            }))
        })
        await setLoadingDataModal(false)
    }



    const toggleModal = async () => {
        setModalVisible(!modalVisible);

    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation}>Danh sách giảng viên</HeaderText>
            <View style={{ flex: 1 }} >
                <View style={[styles.container]}>
                    {/* Search bar */}
                    <View style={{ width: '90%', marginTop: 10 }} >
                        <Search
                            placeholder='Tên giảng viên hoặc email'
                            value={keyWord}
                            onEndEditing={setKeyWord}
                            onFilter={() => { setModalVisible(true) }}
                        />

                    </View>
                    {/* List lecture */}
                    <View style={{ flex: 1, width: '100%', marginTop: 20, }}>
                        {loadingDataModal && < LoadingDataModal visible={true} />}
                        {!loadingDataModal && <FlatList data={lectureList} Component={LectureItem} navigation={navigation} />}
                    </View>
                </View>
            </View>
            {/* modal */}
            {modalVisible && <Modal isVisible={true}
                backdropOpacity={.8}
            >
                <View style={{ borderWidth: 1, backgroundColor: 'white', padding: 5, borderRadius: 20, alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <FacultyPicker onValueChange={setDumpFaculty} faculty={faculty} />
                    </View>

                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                        <CustomButton onPress={async () => {
                            await toggleModal();
                            await setFaculty(dumpFaculty)

                        }} style={{ width: 80, marginRight: 5 }} >Lưu</CustomButton>
                        <CustomButton onPress={toggleModal} style={{ width: 80, marginLeft: 5 }} >Hủy</CustomButton>
                    </View>
                </View>
            </Modal>}
        </SafeAreaView >

    );
};

const LectureItem = ({ item, navigation }) => {
    const { _id, full_name, faculty, email } = item
    return (
        <TouchableOpacity style={{

            marginVertical: 20, marginHorizontal: 10, elevation: 2, padding: 8, alignItems: 'center', borderRadius: 15
        }}
            onPress={() => navigation.navigate('LectureDetail', { _id })}
        >
            <View style={{ width: '95%' }} >
                <Text>Họ tên: {full_name}</Text>
                <Text>Email: {email}</Text>
                <Text>Khoa: {facultyToVN[faculty]}</Text>
                <View style={{ width: '25%', marginTop: 10 }}
                >

                </View>
            </View>
        </TouchableOpacity >

    )
}

const FacultyPicker = ({ onValueChange, faculty }) => {
    return (<View style={{ width: '90%' }}>
        <Text >Khoa:</Text>
        <Picker
            onValueChange={val => onValueChange(val)}
            selectedValue={faculty}
        >
            <Picker.Item label='Tất cả' value={false} />
            {facultyList.map(faculty => {
                return (
                    <Picker.Item label={facultyToVN[faculty]} value={faculty} key={faculty} />
                )
            })}
        </Picker>
    </View>)
}


const MainScreen = () => {

    return (
        <Stack.Navigator
            initialRouteName="lectureList"
            headerMode='none'
            mode='modal'
        >
            <Stack.Screen name='lectureList' component={LectureList} />
            <Stack.Screen name="LectureDetail" component={LectureDetail} />
        </Stack.Navigator>
    )

}



export default MainScreen;
