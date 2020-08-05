import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../Colors'

export default class App extends Component {

    render() {
        return (
            <TouchableOpacity style={[styles.container, this.props.style]}
                activeOpacity={0.7}
                onPress={this.props.onPress}>

                <Text style={styles.title}>{this.props.title}</Text>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.button,
        elevation: 1,
        borderRadius: 4,
        opacity: 0.9
    },
    title: {
        color: '#ffffff',
        fontWeight: 'bold'
    }
});
