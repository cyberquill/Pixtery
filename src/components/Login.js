import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import * as Keychain from 'react-native-keychain';
import isEmpty from '../util/isEmpty';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: '',
        };

        this.onBkspPress = this.onBkspPress.bind(this);
        this.resetPIN = this.resetPIN.bind(this);
    }

    componentDidMount() {
        // this.props.navigation.navigate('Home');
    }

    async componentDidUpdate() {
        if(this.state.pin.length >= 4) {
            const credentials = await Keychain.getGenericPassword();
            if(!isEmpty(credentials) && !isEmpty(credentials.password)) {
                if(credentials.password === this.state.pin) {
                    this.props.navigation.navigate('Home');
                    ToastAndroid.show('Credentials Verified', ToastAndroid.SHORT);
                    this.setState({ pin: '' });
                } else {
                    ToastAndroid.show('Invalid Credentials', ToastAndroid.SHORT);
                }
            } else {
                await Keychain.setGenericPassword('PIN', this.state.pin);
                ToastAndroid.show('New Credentials Set', ToastAndroid.SHORT);
                this.props.navigation.navigate('Home');
                this.setState({ pin: '' });
            }
        }
    }

    onNumPress(n) {
        this.setState({ pin: this.state.pin+n });
    }
    onBkspPress() {
        this.setState({ pin: this.state.pin.slice(0, -1) });
    }

    async resetPIN() {
        await Keychain.setGenericPassword('PIN', this.state.pin);
        this.setState({ pin: '' });
    }

    render() {
        return (
            <View style={styles.pageWrapper}>
                <View style={{ ...styles.pageContainer, justifyContent: 'flex-end' }}>
                    <Text style={styles.text}>Enter the PIN code:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}></View>
                        <Text numberOfLines={1} style={styles.input}>{this.state.pin}</Text>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>

                <View style={styles.pageContainer}>
                    <View style={styles.numpad}>
                        <View style={styles.numpadRow}>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('1')}><Text style={styles.numpadText}>1</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('2')}><Text style={styles.numpadText}>2</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('3')}><Text style={styles.numpadText}>3</Text></TouchableOpacity>
                        </View>
                        <View style={styles.numpadRow}>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('4')}><Text style={styles.numpadText}>4</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('5')}><Text style={styles.numpadText}>5</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('6')}><Text style={styles.numpadText}>6</Text></TouchableOpacity>
                        </View>
                        <View style={styles.numpadRow}>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('7')}><Text style={styles.numpadText}>7</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('8')}><Text style={styles.numpadText}>8</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('9')}><Text style={styles.numpadText}>9</Text></TouchableOpacity>
                        </View>
                        <View style={styles.numpadRow}>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={this.resetPIN}><Text style={styles.numpadText}>Reset</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={() => this.onNumPress('0')}><Text style={styles.numpadText}>0</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.numpadCell} onPress={this.onBkspPress}><Image resizeMode='contain' style={styles.numpadBksp} source={require('../../assets/images/backspace.png')} /></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'center',
    },
    input: {
        borderColor: '#005bea',
        borderRadius: 3,
        borderWidth: 1,
        fontSize: 26,
        paddingHorizontal: 5,
        paddingVertical: 2.5,
        marginBottom: 20,
        letterSpacing: 10,
        textAlign: 'center',
        flex: 1,
    },
    numpad: {
        flex: 1,
        flexDirection: 'column',
    },
    numpadRow: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
    },
    numpadCell: {
        flex: 1,
        justifyContent: 'center',
    },
    numpadText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    numpadBksp: {
        flex: 0.5,
        marginLeft: 15,
    },
});

export default Login;
