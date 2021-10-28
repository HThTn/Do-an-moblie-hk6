import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import HeaderText from '../../components/HeaderText';
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack';
import Modal from 'react-native-modal';

const Stack = createStackNavigator();

import { yearList, apiURL } from '../../config/config';
import { StudentUtils, ClassUtils } from '../../utils'
import styles from '../../style/style';
import TokenContext from '../../Context/TokenContext';
import StudentDetail from './StudentDetail';
import LoadingDataModal from '../../components/LoadingDataModal'
import FlatList from '../../components/FlatList'
import CustomButton from '../../components/Button'
import Text from '../../components/Text'
import Search from '../../components/Search'
import { mainWhite } from '../../style/color';


const ClassListContext = React.createContext()


const StudentList = ({ navigation }) => {

    const token = useContext(TokenContext);


    const [studentList, setStudentList] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [classList, setClassList] = useState([]);
    const [loadingDataModal, setLoadingDataModal] = useState(true);
    const [keyWord, setKeyWord] = useState('');
    const [filterData, setFilterData] = useState({ year: false, class: false });
    const [dumpFilter, setDumpfilter] = useState({ year: false, class: false });
    const [completed, setCompleted] = useState(false)
    useEffect(async () => {
        try {
            await StudentUtils.getAllStudent({ token: token }).then(async (res) => {

                await setStudentList(res.data)
            })
            await ClassUtils.getAllClass({ token: token }).then(async (res) => {
                await setClassList(res.data)

            })
            await setCompleted(true)
            await setLoadingDataModal(false)
        } catch (err) {
            console.log("Error get data: ", err);
        }
        setCompleted(true)
        return () => {
            setStudentList();
            setClassList();
            setKeyWord();
            setFilterData();
            setDumpfilter();
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
            year: filterData.year ? filterData.year : '',
            class_id: filterData.class ? filterData.class : '',
            sort: '-updatedAt'

        }
        await StudentUtils.getAllStudent(query)
            .then(res => {
                return setStudentList(res.data.filter(val => {
                    return val.full_name.toLowerCase().includes(keyWord.toLowerCase()) ||
                        val.email.toLowerCase().includes(keyWord.toLowerCase())
                }))
            })
        setLoadingDataModal(false)
    }

    useEffect(async () => {
        await search()
    }, [filterData])

    useEffect(async () => {
        await search()
    }, [keyWord])
    const toggleModal = async () => {
        setModalVisible(!isModalVisible);
    };


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation}>Danh sách sinh viên</HeaderText>
            <View style={{ flex: 1 }} >
                <View style={[styles.container]}>
                    <View style={{ width: '90%', marginTop: 10 }} >
                        <Search
                            placeholder='Tên sinh viên hoặc email'
                            value={keyWord}
                            onEndEditing={setKeyWord}
                            onFilter={() => { setModalVisible(true) }}
                        />

                    </View>
                    {/* List student */}
                    <View style={{ flex: 1, width: '100%', marginTop: 20, }}>
                        <View style={{ flex: 1, width: '100%', marginTop: 20 }}>
                            {(loadingDataModal) && < LoadingDataModal visible={true} />}
                            {(!loadingDataModal && completed) &&
                                <ClassListContext.Provider value={classList}>
                                    <FlatList data={studentList} Component={StudentItem} navigation={navigation} />
                                </ClassListContext.Provider>
                            }
                        </View>
                    </View>
                </View>
            </View>
            {/* modal */}
            {isModalVisible && <Modal isVisible={true}
                backdropOpacity={.8}
            >
                <View style={{ borderWidth: 1, backgroundColor: 'white', padding: 5, borderRadius: 20, alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <YearPicker onValueChange={setDumpfilter} dumpFilter={dumpFilter} filterData={filterData} />
                        <ClassPicker classList={classList} onValueChange={setDumpfilter} dumpFilter={dumpFilter} filterData={filterData} />
                    </View>
                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                        <CustomButton onPress={async () => {
                            await setFilterData(dumpFilter)
                            await toggleModal();
                        }}
                            style={{ width: 80, marginRight: 5 }} >Lưu</CustomButton>
                        <CustomButton onPress={() => toggleModal()} style={{ width: 80, marginLeft: 5 }} >Hủy</CustomButton>
                    </View>

                </View>
            </Modal>}
        </SafeAreaView >

    );
};

const StudentItem = ({ item, navigation }) => {
    const classList = useContext(ClassListContext);
    const { _id, name, class_id, year, full_name, student_code, email } = item
    const initClass = {
        "quantity": 0,
        "status": "",
        "_id": "",
        "name": "Không có lớp",
        "year": "",
        "faculty": "",
    }
    const [Class, setClass] = useState(initClass);
    useEffect(async (obj = classList.find(element => element._id == class_id)) => {
        if (obj) {
            setClass(obj)
        }
        return () => {
            setClass()
        }
    }, [])
    return (
        <TouchableOpacity style={{
            marginVertical: 20, marginHorizontal: 10, elevation: 2, padding: 8, alignItems: 'center', borderRadius: 15
        }}
            onPress={() => navigation.navigate('StudentDetail', { _id })}
        >
            <View style={{ width: '95%' }} >
                <Text>Mã sinh viên: {student_code}</Text>
                <Text>Họ tên: {full_name}</Text>
                <Text>Email: {email}</Text>
                <Text>Năm học: {year}</Text>
                <Text>Lớp sinh hoạt: {Class.name ? Class.name : null} </Text>
                <View style={{ width: '25%', marginTop: 10 }}
                >

                </View>
            </View>
        </TouchableOpacity>

    )
}

const YearPicker = ({ onValueChange, dumpFilter, filterData }) => {
    return (<View >
        <Text >Năm:</Text>
        <Picker
            onValueChange={val => onValueChange({ ...dumpFilter, year: val })}
            selectedValue={filterData.year}
        >
            <Picker.Item label='Tất cả' value={false} />
            {yearList.map(year => {
                return (
                    <Picker.Item label={year.toString()} value={year.toString()} key={year.toString()} />
                )
            })}
        </Picker>
    </View>)
}

const ClassPicker = ({ classList, onValueChange, filterData, dumpFilter, setDumpfilter }) => {
    const [renderList, setRenderList] = useState([]);

    useEffect(async (year = dumpFilter.year) => {

        if (year == false) {
            setRenderList(classList)
        } else {
            setRenderList(classList.filter(val => val.year == dumpFilter.year))
        }
        return () => {
            setRenderList()
        }
    }, [dumpFilter.year])

    return (
        <View >
            <Text >Lớp:</Text>
            <Picker
                onValueChange={val => onValueChange({ ...dumpFilter, class: val })}
                selectedValue={filterData.class}
            >
                <Picker.Item label={renderList.length > 0 ? 'Tất cả' : 'None'} value={renderList.length > 0 ? false : 'none'} />
                {
                    renderList.map(val => {
                        return <Picker.Item label={val.name} value={val._id} key={val._id} />
                    })
                }
            </Picker>
        </View >
    )
}


const MainScreen = () => {

    return (
        <Stack.Navigator
            initialRouteName="StudentList"
            headerMode='none'
            mode='modal'
        >
            <Stack.Screen name='StudentList' component={StudentList} />
            <Stack.Screen name="StudentDetail" component={StudentDetail} />
        </Stack.Navigator>
    )

}




export default MainScreen;