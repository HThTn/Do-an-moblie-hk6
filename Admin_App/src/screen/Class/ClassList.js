import React, { useContext, useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import ClassDetail from './ClassDetail'
import { apiURL, facultyList, facultyToVN, yearList } from '../../config/config'
import styles from '../../style/style'
import TokenContext from '../../Context/TokenContext'
import {
    HeaderText,
    LoadingDataModal,
    FlatList,
    Text,
    Button as CustomButton,
    Search,
    CardView,
} from '../../components';

import { mainWhite } from '../../style/color';
import { ClassUtils } from '../../utils';
import { keyword } from 'chalk';


const ClassList = ({ navigation }) => {
    const token = useContext(TokenContext);
    const [loadingDataModal, setLoadingDataModal] = useState(true);
    const [filterData, setFilterData] = useState({ faculty: false, year: false })
    const [dumpFilter, setDumpFilter] = useState({ faculty: false, year: false })
    const [keyWord, setKeyWord] = useState('');
    const [classList, setClassList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(async () => {

        return () => {
            setClassList();
            setDumpFilter();
            setFilterData();
            setKeyWord();

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


    useEffect(() => search(), [keyWord])
    useEffect(() => search(), [filterData])


    const search = async () => {
        setLoadingDataModal(true)
        const query = {
            token: token,
            year: filterData.year ? filterData.year : '',
            faculty: filterData.faculty ? filterData.faculty : '',
            sort: '-updatedAt'
        }
        await ClassUtils.getAllClass(query)
            .then(async res => {
                return setClassList(res.data.filter(val => val.name.toLowerCase().includes(keyWord.toLowerCase())))
            })
        setLoadingDataModal(false)
    }



    const toggleModal = async () => {
        setModalVisible(!modalVisible);

    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation}>Danh sách lớp học</HeaderText>
            <View style={{ flex: 1 }}>
                <View style={[styles.container]}>
                    <View style={{ width: '90%', marginTop: 10 }} >
                        <Search
                            placeholder='Tên lớp'
                            value={keyWord}
                            onEndEditing={setKeyWord}
                            onFilter={() => { setModalVisible(true) }}
                            onFilter={() => { setModalVisible(true) }}
                        />

                    </View>

                    {/* List Class */}
                    <View style={{ flex: 1, width: '100%', marginTop: 20, }}>
                        <LoadingDataModal visible={loadingDataModal} />
                        {!loadingDataModal && <FlatList data={classList} Component={ClassItem} navigation={navigation} />}
                    </View>
                </View>
            </View>

            {/* modal */}
            <Modal isVisible={modalVisible}
                backdropOpacity={.8}
            >
                <View style={{ borderWidth: 1, backgroundColor: 'white', padding: 5, borderRadius: 20, alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <YearPicker onValueChange={setDumpFilter} dumpFilter={dumpFilter} filterData={filterData} />
                        <FacultyPicker onValueChange={setDumpFilter} dumpFilter={dumpFilter} filterData={filterData} />
                    </View>

                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                        <CustomButton onPress={async () => {
                            await toggleModal();
                            if (filterData.faculty != dumpFilter.faculty || filterData.year != dumpFilter.year) {
                                await setLoadingDataModal(true);
                                await setFilterData(dumpFilter)
                                await setTimeout(async () => await setLoadingDataModal(false), 1000)

                            }

                        }} style={{ width: 80, marginRight: 5 }} >Lưu</CustomButton>
                        <CustomButton onPress={toggleModal} style={{ width: 80, marginLeft: 5 }} >Hủy</CustomButton>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const ClassItem = ({ item, navigation }) => {


    return (
        <CardView
            onPress={() => navigation.navigate('ClassDetail', { _id: item._id })}
        >
            <View style={{ width: '95%' }} >
                <Text>Tên lớp: {item.name}</Text>
                <Text>Năm: {item.year}</Text>
                <Text>Khoa quản lý: {facultyToVN[item.faculty]}</Text>
                <View style={{ width: '25%', marginTop: 10 }}
                >
                    {/* <Button title='Chi tiết'
                        onPress={() => navigation.navigate('ClassDetail', { item })}
                    /> */}
                </View>
            </View>
        </CardView>

    )
}

const FacultyPicker = ({ onValueChange, dumpFilter, filterData }) => {
    return (<View style={{}}>
        <Text >Khoa:</Text>
        <Picker
            mode='dropdown'
            onValueChange={val => onValueChange({ ...dumpFilter, faculty: val })}
            selectedValue={filterData.faculty}
        >
            <Picker.Item label='Tất cả' value={false} />
            {facultyList.map(faculty => {
                return (
                    <Picker.Item label={faculty} value={faculty} key={faculty} />
                )
            })}
        </Picker>
    </View>)
}

const YearPicker = ({ onValueChange, dumpFilter, filterData }) => {
    return (<View >
        <Text >Năm:</Text>
        <Picker
            mode='dropdown'
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

const MainScreen = () => {

    return (
        <Stack.Navigator
            initialRouteName="ClassList"
            headerMode='none'
            mode='modal'
        >
            <Stack.Screen name='ClassList' component={ClassList} />
            <Stack.Screen name="ClassDetail" component={ClassDetail} />
        </Stack.Navigator>
    )

}


export default MainScreen;