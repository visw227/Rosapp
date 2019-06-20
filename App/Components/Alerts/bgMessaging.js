import firebase from 'react-native-firebase';
// Optional flow type
import  { RemoteMessage } from 'react-native-firebase';


// this is needed for the android to get push notifications when the app is in the foreground

export default async (RemoteMessage) => {
    // handle your message

    return Promise.resolve();
}