import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message'

import { AdminUtils } from '../../utils'
import styles from '../../style/style';
import TokenContext from '../../Context/TokenContext';
import {
    SubmitButtonDetail,
    TextInput,
    Text,
    HeaderUserDetail,
    LoadingDataModal
} from '../../components'
import { mainWhite, mainBlue } from '../../style/color';
import { ScrollView } from 'react-native';
const AdminDetail = ({ navigation }) => {
    const token = useContext(TokenContext);
    const initAdmin = {
        "status": "",
        "_id": "",
        "name": "",
        "date_of_birth": "",
        "phone": "",
        "password": "",
        "email": "",
    }


    const [admin, setAdmin] = useState(initAdmin)
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false)
    const getAdminData = async () => {
        await AdminUtils.getAdmin({ token: token })
            .then(async (res) => {
                console.log(res.data);
                return setAdmin(res.data)
            })
        setIsLoading(false);
    }
    useEffect(async () => {
        await getAdminData();

        return () => {
            setAdmin();
        }
    }, [])


    const handlerCancel = async () => {
        await getAdminData();
        setIsEdit(false)
    }

    const save = async () => {
        setIsProcessing(true)
        const query = {

            token: token,
            admin: {
                email: admin.email,
                name: admin.name
            }
        }
        await setTimeout(async () => {
            await AdminUtils.updateAdmin(query)
                .then(async (res) => {
                    setIsProcessing(false)
                    if (res.statusCode == 200) {
                        setIsEdit(false);
                        await getAdminData()
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
                        text1: 'Cập nhật thất bại ',
                        text2: JSON.stringify(res.messages),
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                })
        }, 1000)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }} >
            <HeaderUserDetail
                onBackPress={() => navigation.goBack()}
            />
            <LoadingDataModal visible={isLoading} />
            {!isLoading &&
                <ScrollView style={{ flex: 1, marginTop: 50 }} >
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ width: '90%' }}>
                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Tên:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={isEdit}
                                        outLine={isEdit}
                                        outlineColor={mainBlue}

                                        type='flat'
                                        value={admin.name}
                                        onChangeText={val => setAdmin({ ...admin, name: val })}
                                    />
                                </View>
                            </CustomView>

                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Email:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        outLine={false}
                                        editable={isEdit}
                                        multiline={true}
                                        outLine={isEdit}
                                        outlineColor={mainBlue}
                                        type='flat'
                                        value={admin.email}
                                        onChangeText={val => setAdmin({ ...admin, email: val })}
                                    />
                                </View>
                            </CustomView>

                            <CustomView>
                                <View style={{ flex: .8, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text>Trạng thái:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Picker style={{ marginRight: '23%' }}
                                        mode='dropdown'
                                        itemStyle={{ fontFamily: 'Inter', fontSize: 18 }}
                                        enabled={false}
                                        selectedValue={admin.status}
                                        onValueChange={val => setAdmin({ ...admin, status: val })}
                                    >
                                        <Picker.Item label='Active' value='active' />
                                        <Picker.Item label='Disabled' value='disabled' />
                                    </Picker>
                                </View>
                            </CustomView>

                        </View>
                        <SubmitButtonDetail
                            isEdit={isEdit}
                            isProcessing={isProcessing}
                            onEditPress={() => setIsEdit(true)}
                            onSavePress={() => save()}
                            onCancelPress={() => handlerCancel()}
                        />

                    </View>
                </ScrollView>
            }

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

export default AdminDetail;