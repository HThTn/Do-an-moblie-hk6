import React from 'react';
import { FlatList, View } from 'react-native';

import Text from './Text'

const CustomFlatList = ({ data, Component, navigation = null }) => {
    return (
        data.length == 0 ?
            <View style={{ flex: 1, alignItems: 'center', marginTop: '30%' }}>
                <Text>Không có dữ liệu</Text>
            </View>
            :
            <FlatList
                data={data}
                renderItem={({ item }) => {
                    return <Component item={item} navigation={navigation} />
                }}
                keyExtractor={item => item._id}

            />
    );
};

export default CustomFlatList;