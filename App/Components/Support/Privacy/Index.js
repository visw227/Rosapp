import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'


class Privacy extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Privacy Policy',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })



  render() {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ScrollView
            style={{ paddingBottom: 100 }}
          >


        <Text style={{ padding: 20 }}>

Rosnet Privacy Statement
 Last modified: January 9, 2015
 Rosnet (the “Service”) is a scheduling-related information and messaging service, available from ROS Technology Services, Inc. DBA Rosnet (the “Company”) either online through our website at www.Rosnet.com or via our mobile application. The Service provides users with the ability to store scheduling-related information into one location, share that information, and receive updates, manage availability, request time off, and message and receive messages from other employees regarding scheduling.
 INTRODUCTION
 We respect your privacy and are committed to protecting it. Please take a moment to familiarize yourself with our privacy practices. By accessing the Service, you agree to our privacy practices as set out in this privacy statement.
 This statement describes the information that we collect and how that information may be used by us. This statement does not apply to information we collect through any other means, or to information collected on any other Company or third-party site that may link to or be accessible from the Service. We encourage you to learn about the privacy practices of those third parties.
 Our servers and data centers for the Service are located in the U.S. We may also subcontract processing to or share your personal information with third parties located in countries other than your home country. If you are accessing the Service from outside the U.S., you agree that your personal information may be transferred to the U.S. or another country, which may have different privacy and data security protections than those of your own jurisdiction, to be processed and stored. You expressly consent to your personal information being used as set out in this paragraph.
 COLLECTION OF PERSONAL INFORMATION
 Personal information is data that can be used to uniquely identify or contact a single person. We collect several types of personal information from and about users of the Service, including:
 • Personal information you provide to us when you register for the Service or thereafter, such as your name and email address;
 •	Personal information provided to us prior to your registration with the Service by a the company where you work that uses the Rosnet scheduling program;
 • Personal information included in any messaging you undertake through the Service, such as sharing of schedule-related information; and
 •	If you contact us, personal information you provide to us that details the nature of your question or problem.
 •	Other information from your mobile platform, including your location, IP address, OS version of device, time zone and the page that you requested.
 
 If you connect to the Service using credentials of a third party Social Networking Site (“SNS”) such as Facebook, Google +, or LinkedIn, you authorize us to collect your authentication information, such as your name, e-mail address, and encrypted access credentials, as well as information that is public under the terms and policies set out by your SNS. We may store this information so that it can be used for the purposes explained in this statement, and it may also be used to verify your credentials with the SNS. The information available to Rosnet from an SNS is affected by the privacy settings you establish at the SNS. You understand and agree that an SNS’s use of information they collect from you is governed by their privacy policies, and Rosnet’s use of such information is governed by this privacy statement.
 USE OF PERSONAL INFORMATION
 We use personal information in the following ways:
 •	To present the Service and its contents in a suitable and effective manner for you and for your computer or mobile device;
 •	To provide you with information, products or services that you request from us;
 •	To notify you about changes to the Service; and
 •	To allow you to utilize the schedule integration, sharing, and messaging features of the Service, if and when you choose to do so.

        </Text>

        </ScrollView>

      </View>
    );

  }
}


//make this component available to the app
export default Privacy;