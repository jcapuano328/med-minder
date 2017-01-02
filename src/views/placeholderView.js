import React from 'react';
import { View, Text } from 'react-native';

const PlaceholderView = (title) => {
    return () => {
        return (
            <View style={{flex: 1}}>
                <Text>{title}</Text>
            </View>
        );
    }
}

export default PlaceholderView;
