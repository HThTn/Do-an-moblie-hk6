import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker'

import styles from '../../style/style';
import { mainBlue, mainBlack, mainWhite } from '../../style/color'
import { apiURL, facultyList, facultyToVN } from '../../config/config';
import TokenContext from '../../Context/TokenContext';
import { LoadingDataModal, Text, SubmitButtonDetail, TextInput } from '../../components';
import { ClassUtils } from '../../utils';
const ClassDetail = ({ route, navigation }) => {
    const token = useContext(TokenContext);
    const { _id } = route.params;
    const initError = { name: false }
    const initClass = {
        "quantity": 0,
        "status": "",
        "_id": "",
        "name": "",
        "year": "",
        "faculty": "",
    }
    const [Class, setClass] = useState(initClass);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState(initError);
    const [isEdit, setIsEdit] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [newClass, setNewClass] = useState({})
    const getData = async () => {
        const query = {
            token: token,
            id: _id
        }
        try {
            await ClassUtils.getClassById(query)
                .then(res => {
                    setClass(res.data)

                })
        }
        catch (err) {
            console.log('Error get Class:', err);
        }
    }

    useEffect(async () => {
        await setIsLoadingData(true)
        await getData();
        await setIsLoadingData(false)

        return () => {
            setClass()
        }
    }, [])

    const save = async () => {
        setIsProcessing(true)
        const query = {
            token: token,
            id: _id,
            Class: newClass
        }

        await setTimeout(async () => {

            setError(initError)
            try {
                await ClassUtils.updateClass(query)
                    .then(async (res) => {
                        console.log(res);
                        if (res.error == 4000) {
                            return setError(res.messages)
                        }
                        else if (res.error == 7000) {
                            return setError({ name: 'Tên lớp đã tồn tại' })
                        }
                        else if (res.statusCode == 200) {
                            await setIsEdit(false)
                            return Toast.show({
                                type: 'success',
                                position: 'top',
                                text1: 'Cập nhật thành công ',
                                visibilityTime: 2000,
                                autoHide: true,
                            })
                        }

                        return Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'Error',
                            text2: JSON.stringify(res),
                            visibilityTime: 2000,
                            autoHide: true,
                        })

                    })
                setNewClass({});
            }
            catch (err) {
                console.log('Error submit:', err);
            }
            await setIsProcessing(false)
        }, 1000)
    }

    const cancelHandler = () => {
        setIsEdit(false)
        setError(initError)
        getData()
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
            <CustomHeaderText navigation={navigation} >Chi tiết lớp</CustomHeaderText>
            <LoadingDataModal visible={isLoadingData} />
            {!isLoadingData && <View style={{ flex: 1, alignItems: 'center' }} >
                <View style={{ marginTop: 30, alignItems: 'center' }}>

                    <View style={{ width: '90%' }}>
                        <CustomView>
                            <View style={{ flex: .7, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text >Tên lớp:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    // errorMessage={error.name}
                                    type='flat'
                                    value={Class.name}
                                    editable={isEdit}
                                    outLine={isEdit}
                                    outlineColor={mainBlue}
                                    onChangeText={text => {
                                        setClass({ ...Class, name: text })
                                        setNewClass({ ...newClass, name: text })
                                    }
                                    }
                                    errorMessage={error.name}
                                />
                            </View>
                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .7, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text  >Năm: </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    outLine={false}
                                    type='flat'
                                    editable={false}
                                    value={Class.year.toString()} />
                            </View>

                        </CustomView>
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Khoa quản lý:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Picker
                                    itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                    enabled={isEdit}
                                    selectedValue={Class.faculty}
                                    onValueChange={val => {
                                        setClass({ ...Class, faculty: val })
                                        setNewClass({ ...newClass, faculty: val })
                                    }}
                                >
                                    {facultyList.map(val => {
                                        return (
                                            <Picker.Item label={facultyToVN[val]} value={val} key={val} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </CustomView>
                        {/* <CustomView>
                            <View style={{ flex: .7, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Số lượng: </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    outLine={false}
                                    type='flat'
                                    editable={false}
                                    value={Class.quantity.toString()} />
                            </View>

                        </CustomView> */}
                        <CustomView>
                            <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text>Trạng thái:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Picker style={{ marginRight: '23%' }}
                                    mode='dropdown'
                                    itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                    enabled={isEdit}
                                    selectedValue={Class.status}
                                    onValueChange={val => {
                                        setClass({ ...Class, status: val })
                                        setNewClass({ ...newClass, status: val })
                                    }}
                                >
                                    <Picker.Item label='Active' value='active' />
                                    <Picker.Item label='Disabled' value='disabled' />
                                </Picker>
                            </View>
                        </CustomView>
                    </View>


                </View>

                <SubmitButtonDetail
                    isEdit={isEdit}
                    isProcessing={isProcessing}
                    onEditPress={() => setIsEdit(true)}
                    onSavePress={() => save()}
                    onCancelPress={() => {
                        cancelHandler()
                    }}
                />
            </View>}
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </SafeAreaView >
    );
};

const CustomView = ({ children }) => {

    return <View style={{
        width: '100%', flexDirection: 'row', alignItems: 'center'
    }} >
        {children}
    </View >
}






const CustomHeaderText = ({ children, navigation }) => {

    return (
        <View style={[styles.headerView, { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }]}>
            <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                <Text style={styles.headerText}>{children}</Text>
            </View>

            <TouchableOpacity style={{ marginLeft: 10 }}
                onPress={() => navigation.goBack()}
            >
                <Icon name='arrow-left' color='#FFFFFF' size={24} />
            </TouchableOpacity>
        </View>
    )
}


export default ClassDetail;
