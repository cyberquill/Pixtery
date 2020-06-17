import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DirectoryPickerManager from 'react-native-directory-picker';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import isEmpty from '../util/isEmpty';
import directoryEncryptor from '../util/directoryEncryptor';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dirURI: [],
        };
        this.onBrowseBtnPress = this.onBrowseBtnPress.bind(this);
        this.onStartBtnPress = this.onStartBtnPress.bind(this);
        this.onStopBtnPress = this.onStopBtnPress.bind(this);
    }

    async componentDidMount() {
        const URI = await AsyncStorage.getItem('@Pykstery:dirURI');
        if (!isEmpty(URI)) this.setState({ dirURI: JSON.parse(URI) });
    }

    onBrowseBtnPress() {
        DirectoryPickerManager.showDirectoryPicker(null, async response => {
            if (response.didCancel) {
                ToastAndroid.show('User cancelled directory picker', ToastAndroid.SHORT);
            } else if (response.error) {
                console.log('DirectoryPickerManager Error: ', response.error);
            } else if(!this.state.dirURI.includes(response.path)) {
                const newURI = [response.path, ...this.state.dirURI];
                this.setState({ dirURI: newURI });
                await AsyncStorage.setItem('@Pykstery:dirURI', JSON.stringify(newURI));
            }
        });
    }

    removeURIField(index) {
        this.setState({ dirURI: this.state.dirURI.filter((URI, uidx) => uidx!==index) });
    }

    onStartBtnPress() {
        BackgroundTimer.runBackgroundTimer(() => directoryEncryptor(), 3000);
        ToastAndroid.show('Folder-Monitoring Initiated!', ToastAndroid.SHORT);
    }

    async onStopBtnPress() {
        BackgroundTimer.stopBackgroundTimer();
        ToastAndroid.show('Folder-Monitoring Terminated!', ToastAndroid.SHORT);
    }

    render() {
        let URI_fields = null;
        URI_fields = this.state.dirURI.map((URI, index) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, }} key={URI}>
                <View style={{ flex: 0.1 }}></View>
                <ScrollView horizontal style={styles.dirURIview}>
                    <Text style={styles.dirURItext}>{URI}</Text>
                </ScrollView>
                <TouchableOpacity
                    style={styles.rmBtn}
                    activeOpacity={0.7}
                    onPress={() => this.removeURIField(index)}>
                    <Text style={styles.btnText}>&mdash;</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.1 }}></View>
            </View>
        ));

        return (
            <View style={styles.pageWrapper}>
                <View style={{ ...styles.pageSection, marginBottom: 100 }}>
                    <Text style={styles.text}>Folders to be monitored:</Text>
                    <TouchableOpacity
                        style={[styles.btn, { marginBottom: 20 }]}
                        activeOpacity={0.7}
                        onPress={this.onBrowseBtnPress}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#00c6fb', '#005bea']}
                            style={styles.btnBg}>
                            <Text style={styles.btnText}>Add a folder</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    {URI_fields}
                </View>

                <View style={styles.pageSection}>
                    <TouchableOpacity
                        style={styles.btn}
                        activeOpacity={0.7}
                        onPress={this.onStartBtnPress}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#7ed56f', '#28b485']}
                            style={styles.btnBg}>
                            <Text style={styles.btnText}>Start Monitoring</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.pageSection}>
                    <TouchableOpacity
                        style={styles.btn}
                        activeOpacity={0.7}
                        onPress={this.onStopBtnPress}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#ffb900', '#ff7730']}
                            style={styles.btnBg}>
                            <Text style={styles.btnText}>Stop Monitoring</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageSection: {
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    dirURIview: {
        flex: 0.65,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#999',
        backgroundColor: '#fff',
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 9,
    },
    dirURItext: {
        fontSize: 14,
        fontFamily: 'monospace',
    },
    btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnBg: {
        paddingHorizontal: 35,
        paddingVertical: 10,
        borderRadius: 100,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rmBtn: {
        backgroundColor: '#f0366e',
        height: 40,
        flex: 0.15,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home;
