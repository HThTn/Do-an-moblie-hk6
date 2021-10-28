import React from 'react';
import { TouchableOpacity } from 'react-native'

const CardView = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity style={[{
            marginVertical: 20, marginHorizontal: 10, elevation: 2, padding: 8, alignItems: 'center', borderRadius: 15
        }, { style }]}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

export default CardView;