import React, { useState, Component, useEffect, useContext }from 'react'
import { KeyboardAvoidingView, View, Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView,ScrollView,Modal, Alert, Pressable, RefreshControl} from 'react-native';
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { passwordValidator, retypePassValidator } from '../../helpers/passwordValidator';
import { usernameValidator } from '../../helpers/usernameValidator'
import { RadioButton, Card, Avatar, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import TokenContext from '../../Context/TokenContext';
import {addDays, format, getDate, isSameDay, startOfWeek, parseJSON, isAfter, isBefore} from 'date-fns';
import { enGB, eo, ru, vi } from 'date-fns/locale';

export default function OnlineExam({navigation}){
    const token = useContext(TokenContext);
    const [examList, setExamList] = useState([]);
    const [answerList, setAnswerList] = useState([]);
    const [TimeChecker, setTimeChecker] = useState([]);
    // const [index, setIndex] = useState([]);
    const getExam = async () => {
        await fetch('http://quocha.xyz/api/exam/student', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:'Bearer '+token,
        },
        })
        .then(res => res.json())
        .then(res => {
            setExamList(res.data);
            let TimeCheckers = [];
            res.data.forEach(item => {
                TimeCheckers = TimeCheckers.concat(isAfter(new Date(),parseJSON(item.start_at)) && isBefore(new Date(),parseJSON(item.expire_at)));
            });
            setTimeChecker(TimeCheckers);
            // setIndex(Array(res.data.length).fill(-1));
        });
        };
    const getAnswer = async () => {
        await fetch('http://quocha.xyz/api/answer/student', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:'Bearer '+token,
        },
        })
        .then(res => res.json())
        .then(res => {
            setAnswerList(res.data);
        }).then(getExam);
    };
    const reload = async () =>{
        let indexs = [...index];
            for( let i =0 ; i < answerList.length; i++){
                console.log(answerList[i].exam_id);
                indexs[examList.findIndex(x => x.id === answerList[i].exam_id)] = i;
            }
            // for( const item of examList){
            //     indexs = indexs.concat(answerList.findIndex(x => x.exam_id === item));
            //     console.log(indexs);   
            // };
        setIndex(indexs) ;
    };  
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await  getAnswer(), getExam();
            console.log(answerList); 
        });
        // reload();
        return () => {unsubscribe; setExamList();}
    }, [navigation]);
    
    // const index = reload();

    // useEffect(async () => {
    //     await setTimeout(async () => {
    //     await reload();}, 100);
    // });
    // console.log(answerList.findIndex()); 
    const [modalVisible, setModalVisible] = useState(false);
    const [examID,setExamID]=useState([]);
    let index=[];
    function checkExam(item = {item}){
        index = index.concat(answerList.findIndex(x => x.exam_id === item));
        // console.log(item ,index);
        return index
    };
    // let TimeChecker = [];
    // async function checkTime(){
    //     examList.forEach(item => {
    //         TimeChecker = TimeChecker.concat(isAfter(new Date(),parseJSON(item.start_at)) && isBefore(new Date(),parseJSON(item.expire_at)));
    //     });
    //     return TimeChecker
    // };
    // checkTime();
    
    console.log(index);
    return (
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
                            <Pressable
                                    style={[styles.closebutton]}
                                    onPress={() => {setModalVisible(!modalVisible)}}>
                                    <Icon name="md-close" size={23} color='#BFBFBF' />
                            </Pressable>
                            <Text style={[styles.TitleText, {marginBottom:15}]}>{examID.name}</Text>
                            <Text style={[styles.ContentText,{textAlign:'center'}]}>Bạn có {examID.time} phút để thực hiện bài làm</Text>
                            <Text style={[styles.ContentText,{textAlign:'center'}]}>Thời gian sẽ được tính sau khi bấm "Bắt đầu"</Text>
                            <Text style={[styles.ContentText,{textAlign:'center',marginBottom:15}]}>Bạn đã sẵn sàng !</Text>
                            <Pressable
                                    style={[styles.button, {backgroundColor:'green'}]}
                                    onPress={() => {
                                            navigation.navigate('MainExam', {data1: examID, anw: false}); setModalVisible(!modalVisible)}}>
                                    <Text style={styles.textStyle}>Bắt đầu</Text>
                            </Pressable>
                        </View>
                    </View>
            </Modal>
            { examList.length != 0 ?
            (<ScrollView style={styles.NotiView}>
                {/* <Text>{token}</Text> */}
                {examList.map((item, i)=>(
                    // <Pressable   onPress={() => {
                    //     setExamID(item);
                    //     setModalVisible(!modalVisible);
                    // }}>
                    <View key={i} style={styles.NotiText}> 
                        <Text style={styles.TitleText}>{item.name} </Text>
                        <Text style={styles.ContentText}>Thời gian: {format(parseJSON(item.start_at),'p  P', {locale: vi})} -- {format(parseJSON(item.expire_at),'p  P', {locale: vi})} </Text>
                        <Text style={styles.ContentText}>Thời gian làm bài: {item.time} phút</Text>
                        { checkExam(item.id)[i] == -1 ? (
                            <View>
                                <Text style={styles.ContentText}>Chưa nộp bài</Text>
                                { TimeChecker[i] ? (
                                    <Pressable  style={[styles.button, {backgroundColor:'green', marginTop:10, flexDirection:'row', alignItems: 'center', width:'24%'}]} onPress={() => {
                                        setExamID(item);
                                        setModalVisible(!modalVisible);}}>
                                            <Icon name="ios-logo-electron" color={'#FEFEFE'} size={20} />
                                            <Text style={[styles.textStyle, {marginLeft: 10}]}>Làm bài</Text>
                                    </Pressable>
                                ) : (
                                    <Pressable  style={[styles.button, {backgroundColor:'grey', marginTop:10, flexDirection:'row', alignItems: 'center', width:'24%'}]} disabled={true} onPress={() => {
                                        setExamID(item);
                                        setModalVisible(!modalVisible);}}>
                                            <Icon name="ios-logo-electron" color={'#FEFEFE'} size={20} />
                                            <Text style={[styles.textStyle, {marginLeft: 10}]}>Làm bài</Text>
                                    </Pressable>
                                )}
                                {/* <Pressable  style={[styles.button, {backgroundColor:'green', marginTop:10, flexDirection:'row', alignItems: 'center', width:'24%'}]} onPress={() => {
                                    setExamID(item);
                                    setModalVisible(!modalVisible);}}>
                                        <Icon name="ios-logo-electron" color={'#FEFEFE'} size={20} />
                                        <Text style={[styles.textStyle, {marginLeft: 10}]}>Làm bài</Text>
                                </Pressable> */}
                            </View>
                            ) : (
                            <View>
                                <Text style={styles.ContentText}>Nộp bài lúc: {format(parseJSON(answerList[index.key = index[i]].createdAt),'p  P', {locale: vi})}</Text>
                                <Text style={styles.ContentText}>Điểm: {answerList[index.key = index[i]].score}</Text>
                                <Pressable  style={[styles.button, {backgroundColor:'#3891E9', marginTop:10, flexDirection:'row', alignItems: 'center', width:'32%'}]} onPress={() => {navigation.navigate('MainExam', {data1: item, anw: answerList[index.key = index[i]]})
                                    }}>
                                        <Icon name="ios-logo-electron" color={'#FEFEFE'} size={20} />
                                        <Text style={[styles.textStyle, {marginLeft: 10}]}>Xem lại bài làm</Text>
                                </Pressable>
                            </View>)} 
                    </View> 
                    //</Pressable>
                ))}
                
            </ScrollView>):(<Text style={{textAlign:'center', marginTop: 15}}>KHÔNG CÓ DỮ LIỆU</Text>)
            }
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: 'center'
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
        marginVertical: '2%',
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
        color:'black',
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
        paddingBottom: 38,
    },
    button: {
	    margin:2,
        borderRadius: 5,
        // borderWidth: 0.5,
        padding: 10,
        // backgroundColor:'green',
    },
    closebutton: {
	    alignSelf: 'flex-end',
    },
    textStyle: {
        color: '#FEFEFE'
    }
});


