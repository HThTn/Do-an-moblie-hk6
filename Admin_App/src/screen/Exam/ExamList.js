
import React, { useContext, useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import HeaderText from '../../components/HeaderText';
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack';
import Modal from 'react-native-modal';

const Stack = createStackNavigator();

import { ExamUtils } from '../../utils'
import styles from '../../style/style';
import TokenContext from '../../Context/TokenContext';
import Text from '../../components/Text'
import ExamDetail from './ExamDetail';
import LoadingDataModal from '../../components/LoadingDataModal';
import FlatList from '../../components/FlatList';
import CustomButton from '../../components/Button';
import Search from '../../components/Search'
import CardView from '../../components/CardView'
import { mainWhite } from '../../style/color';


const ExamList = ({ navigation }) => {
    const token = useContext(TokenContext);
    const [typeFilter, setTypeFilter] = useState(false);
    const [examList, setExamList] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loadingDataModal, setLoadingDataModal] = useState(true)
    const [dumpType, setDumpType] = useState(false)
    const [keyWord, setKeyWord] = useState('')
    useEffect(async () => {
        // try {
        //     await ExamUtils.getAllExam({ token: token })
        //         .then(res => {
        //             setExamList(res.data)
        //         })
        //     setLoadingDataModal(false)
        // } catch (err) {
        //     console.log('Error get examList: ', err);
        // }
        return () => {
            setExamList();
            setTypeFilter();
            setDumpType();
            setKeyWord();
        }
    }, [])

    useEffect(() => search(), [typeFilter])
    useEffect(() => search(), [keyWord])

    useEffect(async () => {
        const unsubscribe = navigation.addListener('focus', () => {
            search();
        });
        return () => {
            unsubscribe
        }
    }, [navigation])

    const search = async () => {
        setLoadingDataModal(true);
        const query = {
            token: token,
            type: typeFilter ? typeFilter : '',
            sort: '-updatedAt'
        }
        await ExamUtils.getAllExam(query)
            .then(async (res) => {
                return setExamList(res.data.filter(val => {
                    return val.name.toLowerCase().includes(keyWord.toLowerCase())
                }))
            })
        setLoadingDataModal(false)
    }



    const toggleModal = async () => {
        setModalVisible(!isModalVisible);
    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <HeaderText navigation={navigation}>Danh sách bài thi</HeaderText>
            <View style={{ flex: 1 }} >
                <View style={[styles.container]}>

                    <View style={{ width: '90%', marginTop: 10 }} >
                        <Search
                            placeholder='Tên bài thi'
                            value={keyWord}
                            onEndEditing={setKeyWord}
                            onFilter={() => { setModalVisible(true) }}
                        />

                    </View>
                    {/* List exam */}
                    <View style={{
                        flex: 1, width: '100%', marginTop: 20,
                    }}>
                        <LoadingDataModal visible={loadingDataModal} />
                        {!loadingDataModal && <FlatList data={examList} Component={ExamItem} navigation={navigation} />}
                    </View>
                </View>
            </View >
            {/* modal */}
            {isModalVisible && < Modal isVisible={true}
                backdropOpacity={.8}
            >
                <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 20, alignItems: 'center' }}>
                    <View style={{ width: '90%', }}>
                        <Text>Loại bài thi:</Text>
                        <Picker
                            style={{ borderWidth: 1, elevation: 5 }}
                            mode='dropdown'
                            selectedValue={typeFilter}
                            onValueChange={type => setDumpType(type)}
                        >
                            <Picker.Item label='Tất cả' value={false} />
                            <Picker.Item label='All' value='all' />
                            <Picker.Item label='Lớp' value='class' />
                            <Picker.Item label='Nhóm' value='group' />
                        </Picker>
                    </View>
                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                        <CustomButton onPress={async () => {
                            await toggleModal();
                            await setTypeFilter(dumpType)

                        }} style={{ width: 80, marginRight: 5 }} >Lưu</CustomButton>
                        <CustomButton onPress={toggleModal} style={{ width: 80, marginLeft: 5 }} >Hủy</CustomButton>
                    </View>

                </View>
            </Modal >}
        </SafeAreaView >

    );
};

const ExamItem = ({ item, navigation }) => {
    return (
        <CardView onPress={() => navigation.navigate('ExamDetail', { _id: item._id })}>
            <View style={{ width: '95%' }} >
                <Text>Tên bài thi: {item.name}</Text>
                <Text>Số lương câu hỏi: {item.questions.length}</Text>
                <Text>Thời gian làm bài: {item.time} phút</Text>
                <Text>Loại: {item.for}</Text>
                <View style={{ width: '25%', marginTop: 10 }}
                >

                </View>
            </View>
        </CardView>

    )
}



const MainScreen = () => {

    return (
        <Stack.Navigator
            initialRouteName="ExamList"
            headerMode='none'
            mode='modal'
        >
            <Stack.Screen name='ExamList' component={ExamList} />
            <Stack.Screen name="ExamDetail" component={ExamDetail} />
        </Stack.Navigator>
    )

}





export default MainScreen;
