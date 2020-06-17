import AsyncStorage from '@react-native-community/async-storage';
import * as RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import isEmpty from './isEmpty';

const directoryEncryptor = async () => {
    const dirURI = JSON.parse(await AsyncStorage.getItem('@Pykstery:dirURI'));
    const storagePath = RNFS.ExternalStorageDirectoryPath + '/pykstery';
    const extRE = /(?:\.([^.]+))?$/;
    const imageExt = ['jpg', 'png', 'gif', 'jpeg', 'tif'];
    const videoExt = ['mp4', 'avi', 'wmv', 'mov', 'flv'];
    await RNFS.mkdir(storagePath);
    console.log('inside');

    dirURI.forEach(async (URI, index) => {
        const files = await RNFS.readDir(URI);
        files.forEach(async file => {
            // const res = await RNFS.readFile(file.path, 'base64');
            // console.log(file);

            let data = '';
            RNFetchBlob.fs.readStream(file.path, 'base64', 4095).then(ifstream => {
                ifstream.open();
                ifstream.onData(chunk => console.log(chunk));
                ifstream.onEnd(() => (data = 'data:image/png,base64' + data));
                ifstream.onError(err => console.log('oops', err));
            });

            /* const ext = extRE.exec(file.name)[1].toLowerCase();
            let type = null;
            if(imageExt.includes(ext))
                type = 'image';
            else if(videoExt.includes(ext))
                type = 'video';

            if (!isEmpty(type)) {
                console.log('Encrypting: ' + file.name + '     ----> '+type+'/'+ext);
                const res = await RNFS.readFile(file.path, 'base64');
                const encPath = storagePath + '/' + new Date().getTime() + '.bin';
                const encData = 'data:'+type+'/'+ext+';base64,'+res;
                await RNFS.writeFile(encPath, encData, 'base64');
                await RNFS.unlink(file.path);
                console.log(await RNFS.readFile(encPath));
            } */
        });
    });
    console.log('exiting');
};

export default directoryEncryptor;
