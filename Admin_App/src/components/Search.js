
import React, { useState } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { mainGray, mainWhite } from '../style/color';


const Search = ({ placeholder, onEndEditing, onFilter, value, style }) => {
    const [text, setText] = useState(value)
    return (
        <View style={[{ backgroundColor: mainWhite, flexDirection: 'row', alignItems: 'center', borderRadius: 30, elevation: 1, borderWidth: 1, borderColor: mainGray }, style]}>
            <TouchableOpacity style={{ marginLeft: 8 }}
                onPress={() => onEndEditing(text)}
            >
                <Icon name='search' color='#bdbdbd' size={24} style={{ padding: 5 }} />
            </TouchableOpacity>
            <TextInput
                style={[{ flex: 1, fontFamily: 'Inter', fontSize: 16, textAlign: 'center', }]}
                value={text}
                placeholder={placeholder}
                onEndEditing={() => onEndEditing(text)}
                onChangeText={val => setText(val)}
            />
            <TouchableOpacity style={{ marginRight: 12 }}
                onPress={onFilter}
            >
                <Icon name='sort' color='#bdbdbd' size={24} style={{ padding: 5 }} />
            </TouchableOpacity>
        </View>
    );
};

export default Search