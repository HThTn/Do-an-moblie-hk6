import React, { useState, useEffect, useContext } from 'react';
import { View, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

const Stack = createStackNavigator();

import styles from '../../style/style'
import { facultyList, facultyToVN } from '../../config/config'
import { mainWhite } from '../../style/color';
import TokenContext from '../../Context/TokenContext'
import { HeaderText, Search, LoadingDataModal, FlatList, CardView, Text, Button } from '../../components'
import { SubjectUtils, LectureUtils } from '../../utils'
import SubjectDetail from './SubjectDetail'
const SubjectList = ({ navigation }) => {
    const token = useContext(TokenContext)
    const [keyWord, setKeyWord] = useState('');
    const [loadingDataModal, setLoadingDataModal] = useState(true)
    const [subjectList, setSubjectList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [lectureList, setLectureList] = useState([])
    const [keyWork, setKeyWork] = useState('')
    const [filter, setFilter] = useState({ faculty: false, lecture: false })
    const [dumpFaculty, setDumpFaculty] = useState(false)

    useEffect(async () => {
        await SubjectUtils.getAllSubject({ token: token })
            .then(async (res) => {

                setSubjectList(res.data)
            })
        await LectureUtils.getAllLecture({ token: token }).
            then(async (res) => {
                await setLectureList(res.data)
            })
        setLoadingDataModal(false)
        return () => {
            setSubjectList()
        }
    }, [])
    useEffect(async () => {
        const unsubscribe = navigation.addListener('focus', () => {
            search();
        });
        return () => {
            unsubscribe
        }
    }, [navigation])

    const search = async () => {
        setLoadingDataModal(true)
        const query = {
            token: token,
            faculty: filter.faculty ? filter.faculty : '',
            sort: '-updatedAt'
        }
        await SubjectUtils.getAllSubject(query)
            .then(async (res) => {
                await setSubjectList(res.data.filter(val => val.name.includes(keyWord) || val.subject_code.includes(keyWord)))
            })
        setLoadingDataModal(false)
    }

    useEffect(async () => {
        search()
    }, [keyWord])
    useEffect(async () => {
        search()
    }, [filter])


    const toggleModal = async () => {
        setModalVisible(!modalVisible);

    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation}>Danh sách môn học</HeaderText>
            <View style={{ flex: 1 }} >
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <View style={{ width: '90%', marginTop: 10 }} >
                        <Search
                            placeholder='Tên hoạc mã môn học'
                            value={keyWord}
                            onEndEditing={setKeyWord}
                            onFilter={() => { setModalVisible(true) }}
                        />
                    </View>
                    <View style={{
                        flex: 1, width: '100%', marginTop: 20,
                    }}>
                        <LoadingDataModal visible={loadingDataModal} />
                        {!loadingDataModal && <FlatList data={subjectList} Component={SubjectItem} navigation={navigation} />}
                    </View>
                </View>
            </View>
            {/* modal */}
            {modalVisible && < Modal isVisible={true}
                backdropOpacity={.8}
            >
                <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 20, alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <FacultyPicker onValueChange={setDumpFaculty} faculty={filter.faculty} />
                    </View>
                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                        <Button onPress={async () => {
                            await toggleModal();
                            await setFilter({ ...filter, faculty: dumpFaculty })

                        }} style={{ width: 80, marginRight: 5 }} >Lưu</Button>
                        <Button onPress={toggleModal} style={{ width: 80, marginLeft: 5 }} >Hủy</Button>
                    </View>

                </View>
            </Modal >}
        </SafeAreaView>
    );
};

const SubjectItem = ({ item, navigation }) => {
    const token = useContext(TokenContext)
    const initLecture = {
        "_id": "",
        "date_of_birth": "",
        "email": "",
        "faculty": "computer_science",
        "full_name": "Không có giảng viên",
        "password": "",
        "phone": "",
        "status": ""
    }
    const [lecture, setLecture] = useState(initLecture)
    useEffect(async () => {
        await LectureUtils.getLectureById({ token, select: 'full_name', id: item.lecture_id })
            .then(async (res) => {
                if (res.data != null) {
                    await setLecture(res.data)
                }
            })
    }, [])


    return (
        <CardView onPress={() => navigation.navigate('SubjectDetail', { _id: item._id })}>
            <View style={{ width: '95%' }} >
                <Text>Tên môn học: {item.name}</Text>
                <Text>Mã môn học: {item.subject_code}</Text>
                <Text>Giảng viên: {lecture.full_name ? lecture.full_name : ''}</Text>
                <Text>Khoa quản lý: {facultyToVN[item.faculty]}</Text>
            </View>
        </CardView >

    )
}

const FacultyPicker = ({ onValueChange, faculty }) => {
    return (<View style={{ width: '90%' }}>
        <Text >Khoa:</Text>
        <Picker
            onValueChange={val => onValueChange(val)}
            selectedValue={faculty}
        >
            <Picker.Item label='All' value={false} />
            {facultyList.map(faculty => {
                return (
                    <Picker.Item label={faculty} value={faculty} key={faculty} />
                )
            })}
        </Picker>
    </View>)
}

const MainScreen = () => {

    return (
        <Stack.Navigator
            initialRouteName="SubjectList"
            headerMode='none'
            mode='modal'
        >
            <Stack.Screen name='SubjectList' component={SubjectList} />
            <Stack.Screen name="SubjectDetail" component={SubjectDetail} />
        </Stack.Navigator>
    )

}





export default MainScreen;
