import React, { useState, Component, useEffect,  useContext}from 'react'
import { KeyboardAvoidingView, View, Text, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView , StatusBar, BackHandler, Alert} from 'react-native';
import {Calendar
    , CalendarList
    , Agenda} from 'react-native-calendars';
import {addDays, format, getDate, isSameDay, startOfWeek, getDay} from 'date-fns';
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { passwordValidator, retypePassValidator } from '../../helpers/passwordValidator';
import { usernameValidator } from '../../helpers/usernameValidator'
import { RadioButton, Card, Avatar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import WeekCalendar from './WeekCalendar';
import TokenContext from '../../Context/TokenContext';

export default function TimeTable({navigation}){
    const token = useContext(TokenContext);
    const [scheduleList, setScheduleList] = useState([]);
    const [TimeTable,setTimeTable] = useState([[],[],[],[],[],[],[]]);
    async function getTable (){
        await fetch('http://quocha.xyz/api/schedule/student', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:'Bearer '+token,
        },
        })
        .then(res => res.json())
        .then(res => {
            setScheduleList(res.data.schedule);
            let TimeTables =[[],[],[],[],[],[],[]];
            res.data.schedule.forEach(schedule => {
                switch (schedule.weekday) {
                    case 'monday':
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables[1]=schedule.details;
                        break;
                    case 'tuesday':
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables[2]=schedule.details;
                        break;
                    case 'wednesday':
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables[3]=schedule.details;
                        break;
                    case 'thursday':
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables[4]=schedule.details;
                        break;
                    case 'friday':
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables[5]=schedule.details;
                        break;
                    case 'saturday':
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables[6]=schedule.details;
                        break;
                    default:
                        if (typeof schedule.details[0] !== 'undefined')
                        TimeTables = schedule.details;
                        break;
                }});
            setTimeTable(TimeTables);
        });};
    // const onScreenLoad = () => {
    //     scheduleList.forEach(schedule =>{
    //         switch (schedule.weekday) {
    //             case 'monday':
    //                 TimeTable[1].push(schedule.details[0]);
    //                 break;
    //             case 'tuesday':
    //                 TimeTable[2].push(schedule.details[0]);
    //                 break;
    //             case 'wednesday':
    //                 TimeTable[3].push(schedule.details[0]);
    //                 break;
    //             case 'thursday':
    //                 TimeTable[4].push(schedule.details[0]);
    //                 break;
    //             case 'friday':
    //                 TimeTable[5].push(schedule.details[0]);
    //                 break;
    //             case 'saturday':
    //                 TimeTable[6].push(schedule.details[0]);
    //                 break;
    //             default:
    //                 TimeTable[0].push(schedule.details[0]);
    //                 break;
    //         }
    //     });
    // };
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
          await getTable();        
        });
        return () => {
          unsubscribe;      
        }
    }, [navigation]);
    // onScreenLoad();
    // useEffect(() => {
    //     const backAction = () => {
    //     //   Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //     //     {
    //     //       text: "Cancel",
    //     //       onPress: () => null,
    //     //       style: "cancel"
    //     //     },
    //     //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //     //   ]);
    //         BackHandler.exitApp()
    //       return true;
    //     };
      
    //     const backHandler = BackHandler.addEventListener(
    //       "hardwareBackPress",
    //       backAction
    //     );
      
    //     return () => backHandler.remove();
    //   }, []);
    // console.log(TimeTable);
    const [date, setDate] = useState(new Date());
    return (
       <SafeAreaView style={styles.safe}>
           <StatusBar backgroundColor= '#3891E9'/>
            <WeekCalendar date={date} onChange={(newDate) => {setDate(newDate)}} />
            {TimeTable[date.getDay()].length != 0 ?(
                TimeTable[date.getDay()].map((item, key)=>(
                <View style={styles.timetableText} key={key}>
                    <Text style={styles.TitleText}>{item.subject_name} </Text>
                    <Text style={styles.ContentText}>GV: {item.lecture_name} </Text>
                    <Text style={styles.ContentText}>Thời gian: {item.from}h -- {item.to}h</Text>
                </View>
            ))):(<Text style={{textAlign:'center', marginTop: 15}}>KHÔNG CÓ DỮ LIỆU</Text>)}
        </SafeAreaView>
    );
    
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
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
    timetableText:{
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
});