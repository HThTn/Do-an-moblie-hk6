import React, { useState, Component, useEffect, useContext }from 'react'
import { KeyboardAvoidingView, View, Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView,ScrollView,Modal, Alert, Pressable, ToastAndroid, BackHandler } from 'react-native';
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { RadioButton, Card, Avatar, IconButton, Dialog, Portal } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import TokenContext from '../../Context/TokenContext';
import {addDays, format, getDate, isSameDay, startOfWeek, parseJSON, set} from 'date-fns';
import CountDown from 'react-native-countdown-component';

export default function MainExam({route, navigation}){
    const token = useContext(TokenContext);
    const [modalVisible, setModalVisible] = useState(false);
    const {data1, anw} = route.params;
    const [data,setData] = useState(data1.questions);
    // Alert.alert(final.toString());
    const [a,setA]=useState(Array(data.length).fill(' '));
    // console.log(a);
    // setA();
    const onSubmit = async () => {
        await setTimeout(async () => {
        await fetch('http://quocha.xyz/api/answer/student/submit/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({
            exam_id : data1._id,
            finish_time : 10,
            answer : a
          }),
        })
        .then(res => res.json())
        .then(res => {
            if (res.statusCode === 200) {
            // return Toast.show({
            //     type: 'success',
            //     position: 'top',
            //     text1: 'Đã nộp bài',
            //     visibilityTime: 2000,
            //     autoHide: true,
            // });
            ToastAndroid.show('Nộp bài thành công', ToastAndroid.SHORT);
            } else {
            // return Toast.show({
            //     type: 'error',
            //     position: 'top',
            //     text1: 'Không thể nộp bài',
            //     text2: JSON.stringify(res.message),
            //     autoHide: true,
            // });
            ToastAndroid.show('Hết thời gian nôp bài', ToastAndroid.SHORT);
            }
        })
        }, 1000);
      };
    // function getsubmit() {
    //     onSubmit();
    //     return <Toast ref={(ref) => Toast.setRef(ref)}/>
    // }
    useEffect(() => {
        const backAction = () => {
        //   Alert.alert("Hold on!", "Are you sure you want to go back?", [
        //     {
        //       text: "Cancel",
        //       onPress: () => null,
        //       style: "cancel"
        //     },
        //     { text: "YES", onPress: () => BackHandler.exitApp() }
        //   ]);
            if(anw==false) setModalVisible(!modalVisible); else navigation.goBack()
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);
    return (
    // <View style={{height:'90%'}}>
      <SafeAreaView style={styles.Container}>
           <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{fontWeight: 'bold', fontSize: 16}}>Lưu ý</Text>
                            <Text style={{marginVertical:10}}>Vẫn còn thời gian làm lài. Bạn muốn tiếp tục làm bài? </Text>
                            <View style={{flexDirection: 'row',justifyContent: 'space-between',}}>
                                <TouchableOpacity
                                    style={[styles.buttonGy]}
                                    onPress={() => {setModalVisible(!modalVisible)}}>
                                    <Text style={{ }}>Tiếp tục</Text>
                                </TouchableOpacity>
                                <Text>      </Text>
                                <TouchableOpacity
                                    style={[styles.buttonGn]}
                                    onPress={() => {setModalVisible(!modalVisible); onSubmit() ;navigation.goBack()}}>
                                    <Text style={{  }}>Nộp bài</Text>
                                </TouchableOpacity>
                            </View>
                                                                                    
                        </View>
                    </View>
            </Modal>
            { anw==false ? (
                <View style={styles.NotiView, {flexDirection: 'row',justifyContent: 'space-between',paddingVertical: 7.5, marginHorizontal: 10}}>
                <CountDown
                    until={data1.time * 60}
                    size={15}
                    onFinish={() => {onSubmit(); Alert('Hết giờ làm bài'); navigation.goBack();}}
                    digitStyle={{backgroundColor: '#fff'}}
                    digitTxtStyle={{color: '#4B75F2'}}
                    timeToShow={['H','M', 'S']}
                    timeLabels={{h:null, m: null, s: null}}
                    showSeparator
                    running = {true}
                />
                <TouchableOpacity
                    style={styles.buttonBe}
                    onPress={() => {setModalVisible(!modalVisible)}}>
                    <Text style={styles.textStyle}>Nộp bài</Text>
                </TouchableOpacity>
                </View>):(
                <View style={styles.NotiView, {flexDirection: 'row',justifyContent: 'flex-end',paddingVertical: 7.5, marginHorizontal: 10}}>
                {/* <Text>/{anw.answer.length}</Text> */}
                <TouchableOpacity
                    style={styles.buttonBe}
                    onPress={() => {navigation.goBack()}}>
                    <Text style={styles.textStyle}>xong</Text>
                </TouchableOpacity>
                </View>)}
            <ScrollView style={styles.NotiView,{height:'92%'}}>
                {data.map((item, i)=>(
                    <View key={i} style={styles.NotiText}>
                        
                        <Text style={styles.TitleText}>Câu {i+1}: {item.question} </Text>
                        {/* { anw==false ? (<RadioButton.Group onValueChange={value => {setA(prev => {prev[i]=value; return prev})}} value={a[i]}> */}
                        { anw==false ? (<RadioButton.Group onValueChange={value => {const b = [...a]; b[i] = value; setA(b);}} value={a[i]}>
                            {item.selection.map((selection, j)=>(
                                <View key={j} style={[styles.viewRadio]}>
                                    <RadioButton value={selection} />
                                    <Text>{selection}</Text>
                                </View>       
                        ))}</RadioButton.Group>):(
                            item.selection.map((selection, j)=>(
                            <View key={j} style={[styles.viewRadio]}>
                                { (selection == item.answer && item.answer != anw.answer[i]) && <Icons name="checkbox-marked-circle-outline" size={20} color='grey' />}
                                { (selection == item.answer && item.answer == anw.answer[i]) && <Icons name="checkbox-marked-circle-outline" size={20} color='green' />}
                                { (selection != item.answer && selection == anw.answer[i]) && <Icons name="close-circle-outline" size={20} color='red' />}
                                { ((selection !== anw.answer[i] && selection != item.answer)) &&<Icons name="checkbox-blank-circle-outline" size={20} color='grey' />}
                                {/* {check(selection, item.answer, anw.answer[i])} */}
                                <Text>  {selection}</Text>
                            </View> )))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    // </View>    
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        height: '100%'
    },
    headerText: {
        position: "relative",
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FEFEFE',
    },
    headerView: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '2.5%',
        backgroundColor: '#4B75F2',
    },
    NotiView:{
        position: 'relative',
    },
    NotiText:{
        marginHorizontal: '2.5%',
        // borderWidth: .5,
        borderRadius: 10,
        padding: 10,
        marginVertical: '.5%',
        // borderColor:'#BFBFBF',
        backgroundColor: '#FEFEFE',
    },
    TitleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ContentText: {
        fontSize: 14,
    },
    Notification_date:{
        fontSize: 10,
        color: '#262626',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
    },
    modalView: {
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '75%',
        paddingVertical: 38,
    },
    buttonBe: {
        borderRadius: 5,
        // borderWidth: 0.5,
        padding: 10,
        backgroundColor:'#4B75F2',
        // color:'#4B75F2'
    },
    buttonGn: {
        borderRadius: 5,
        // borderWidth: 0.5,
        padding: 10,
        backgroundColor:'#1CC625',
        // color:'#4B75F2'
    },
    buttonGy: {
        borderRadius: 5,
        // borderWidth: 0.5,
        padding: 10,
        backgroundColor:'#BFBFBF',
        // color:'#4B75F2'
    },
    closebutton: {
	    alignSelf: 'flex-end',
    },
    textStyle: {
        color: '#FEFEFE',
        fontSize: 15,
        // marginTop:2,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    viewRadioGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    viewRadio: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 2,
        flex:1,
        alignItems:'center',    
    },
    test: {
        position:'absolute',
    }
});


