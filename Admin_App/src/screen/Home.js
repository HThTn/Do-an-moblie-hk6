import React, { useContext, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

import styles from '../style/style'
import { Password, Button } from '../components'
import { mainWhite } from '../style/color';
import { AdminUtils } from '../utils'
const img = {
    student: require('../../assets/public/img/graduated.png'),
    notification: require('../../assets/public/img/sms.png'),
    lecture: require('../../assets/public/img/teacher.png'),
    exam: require('../../assets/public/img/planner.png'),
    class: require('../../assets/public/img/classroom.png'),
    logout: require('../../assets/public/img/logout.png'),
    subject: require('../../assets/public/img/school.png'),
    info: require('../../assets/public/img/man.png'),
    password: require('../../assets/public/img/padlock.png')
}

export default Home = ({ route, navigation }) => {
    const { setToken, token } = route.params
    const [modalPassword, setModalPassword] = useState(false)
    const initError = {
        old_password: false,
        new_password: false,
        retype_password: false
    }
    const initPassword = {
        old_password: '',
        new_password: '',
        retype_password: ''
    }

    const [error, setError] = useState(initError)
    const [password, setPassword] = useState(initPassword);

    const handlerCancel = () => {
        setModalPassword(false);
        setPassword(initPassword);
        setError(initError);
    }
    const handlerChangePassword = async () => {
        console.log(error);
        await setError(initError);
        console.log(error,);

        await AdminUtils.changePassword({ token: token, admin: password })
            .then(async res => {
                console.log(res, "\n ----------------");
                if (res.error == 4000) {
                    await setError(res.messages)

                }
                else if (res.error == 7000) {
                    setError({ ...error, old_password: 'Sai mật khẩu' })
                }
                else if (res.statusCode == 200) {
                    await handlerCancel();
                    return Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Đổi mật khẩu thành công',
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                }


            })
    }

    return (
        <Animatable.View style={{ flex: 1 }} animation='fadeInDown'>
            <SafeAreaView style={{ flex: 1, backgroundColor: mainWhite }}>
                <HeaderText>Trang chủ</HeaderText>
                <View style={[styles.container, { marginTop: '15%', }]}>
                    <ViewRowGroup>
                        <CustomTouchOpacity src={img.subject} onPress={() => navigation.navigate('Quản lý môn học', { navigation })} >Môn học</CustomTouchOpacity>
                        <CustomTouchOpacity src={img.exam} onPress={() => navigation.navigate('Quản lý đề thi', { navigation })}>Đề thi</CustomTouchOpacity>
                    </ViewRowGroup>

                    <ViewRowGroup>
                        <CustomTouchOpacity src={img.student} onPress={() => navigation.navigate('Quản lý sinh viên', { navigation })} >Sinh viên</CustomTouchOpacity>
                        <CustomTouchOpacity src={img.lecture} onPress={() => navigation.navigate('Quản lý giảng viên', { navigation })}>Giảng viên</CustomTouchOpacity>
                    </ViewRowGroup>

                    <ViewRowGroup>
                        <CustomTouchOpacity src={img.class} onPress={() => navigation.navigate('Quản lý lớp học', { navigation })} >Lớp</CustomTouchOpacity>
                        <CustomTouchOpacity src={img.info} onPress={() => navigation.navigate('Thông tin tài khoản', { navigation })} >Tài khoản</CustomTouchOpacity>
                    </ViewRowGroup>
                    <ViewRowGroup>
                        <CustomTouchOpacity src={img.password} onPress={() => setModalPassword(true)} >Đổi mật khẩu</CustomTouchOpacity>
                        <CustomTouchOpacity src={img.logout} onPress={() => setToken('')} >Đăng xuất</CustomTouchOpacity>
                    </ViewRowGroup>
                </View>

                <Modal isVisible={modalPassword}
                    backdropColor={mainWhite}
                    backdropOpacity={1}
                >
                    <View style={{ flex: .6, flexDirection: 'column', justifyContent: 'space-around', backgroundColor: mainWhite }}>
                        <View >
                            <View style={{ marginBottom: 15 }}>
                                <Password
                                    label='Mật khẩu cũ'
                                    placeholder='Mật khẩu cũ'
                                    isFocus={true}
                                    outLine={true}
                                    leftIcon={false}
                                    value={password.old_password}
                                    onChangeText={val => setPassword({ ...password, old_password: val })}
                                    errorMessage={error.old_password}
                                />
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Password
                                    label='Mật khẩu mới'
                                    placeholder='Mật khẩu mới'
                                    leftIcon={false}

                                    isFocus={true}
                                    outLine={true}
                                    value={password.new_password}
                                    onChangeText={val => setPassword({ ...password, new_password: val })}
                                    errorMessage={error.new_password}
                                />
                            </View>
                            <View style={{ marginBottom: 20 }} >
                                <Password
                                    label='Nhập lại mật khẩu mới'
                                    placeholder='Nhập lại mật khẩu mới'
                                    leftIcon={false}

                                    isFocus={true}
                                    outLine={true}
                                    value={password.retype_password}
                                    onChangeText={val => setPassword({ ...password, retype_password: val })}
                                    errorMessage={error.retype_password}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button
                                    onPress={() => handlerChangePassword()}
                                >Cập nhật</Button>
                                <Button onPress={() => handlerCancel()}>Hủy</Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Toast ref={(ref) => Toast.setRef(ref)} />

            </SafeAreaView>
        </Animatable.View>
    )
}

const CustomTouchOpacity = ({ children, onPress, src }) => {

    return (

        <TouchableOpacity onPress={onPress} style={[{ alignItems: 'center', width: '45%', borderRadius: 10, padding: 5, justifyContent: 'space-around', elevation: 3, }]}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontFamily: 'Inter', textAlign: 'center' }}>{children}</Text>
                <Image source={src} style={{ width: 40, height: 40 }} />
            </View>
        </TouchableOpacity>
    )
}
const ViewRowGroup = ({ children }) => {

    return (
        <View style={{ display: 'flex', flexDirection: 'row', width: '80%', height: '20%', justifyContent: 'space-between', marginBottom: 20 }} >
            {children}
        </View>
    )
}

const HeaderText = ({ children, navigation }) => {
    return (
        <View style={[styles.headerView, { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', height: 50 }]}>
            <View style={{ position: 'absolute', width: '100%', alignItems: 'center', marginVertical: 10 }}>
                <Text style={styles.headerText}>{children}</Text>
            </View>


        </View>
    )
}