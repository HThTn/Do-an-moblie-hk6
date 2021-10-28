import {addDays, format, getDate, isSameDay, startOfWeek} from 'date-fns';
import { enGB, eo, ru, vi } from 'date-fns/locale';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  date: Date;
  onChange: (value: Date) => void;
};

const WeekCalendar: React.FC<Props> = ({date, onChange}) => {
  const [week, setWeek] = useState<WeekDay[]>([]);

  useEffect(() => {
    const weekDays = getWeekDays(date);
    setWeek(weekDays);
  }, [date]);

  return (
  <View>
    <Text style={{fontSize:22, marginLeft: '1.25%'}}>Tháng {format(date, 'MMMMM', {
        locale: vi
      })}</Text>
    <View style={styles.container}>
      {week.map((weekDay) => {
        const textStyles = [styles.label];
        const touchable = [styles.touchable];

        const sameDay = isSameDay(weekDay.date, date);
        if (sameDay) {
          textStyles.push(styles.selectedLabel);
          touchable.push(styles.selectedTouchable);
        }
        const currentDay = isSameDay(weekDay.date, new Date())
        if (currentDay && !sameDay) {
          textStyles.push(styles.currentLabel);
          touchable.push(styles.currentTouchable);
        }
        return (
          <View style={styles.weekDayItem} key={weekDay.formatted}>
            <Text style={styles.weekDayText}>{weekDay.formatted}</Text>
            <TouchableOpacity
              onPress={() => onChange(weekDay.date)}
              style={touchable}>
              <Text style={textStyles}>{weekDay.day}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  weekDayText: {
    color: 'gray',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#FEFEFE',
  },
  currentLabel: {
    color: '#4B75F2',
  },
  touchable: {
    borderRadius: 20,
    padding: 7.5,
    height: 35,
    width: 35,
  },
  selectedTouchable: {
    backgroundColor: '#4B75F2',
  },
  currentTouchable: {
    borderColor: '#4B75F2',
    borderWidth: .5,
  },
  weekDayItem: {
    alignItems: 'center',
  },
});

type WeekDay = {
  formatted: string;
  date: Date;
  day: number;
};

// get week days
export const getWeekDays = (date: Date): WeekDay[] => {
  const start = startOfWeek(date, {weekStartsOn: 0});

  const final = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    final.push({
      formatted: format(date, 'EEEEEE', {
        locale: vi
      }),
      date,
      day: getDate(date),
    });
  }

  return final;
};

export default WeekCalendar;