
import { Utils } from '../Helpers/Utils';


export var Parsers = {


    UserData: function(response) {

        let userData = {
            token: response.SecurityToken,
            userId: response.Rosnet_User_ID,
            userName: response.Browse_User_Name,
            commonName: response.Common_Name,
            sites: response.Sites || [], // just in case null
            isRosnetEmployee: response.Rosnet_Employee,
            mustChangePassword: response.Must_Change_Password,
            userLevel: response.Browse_User_Level,
            location: response.Browse_Linkto_Location // usually null except for userLevel 1
        }

        // sort before persisting
        if(response.Sites && response.Sites.length > 0) {
            userData.sites.sort()
        }
        else {
            userData.sites = [""] // make sure something is there to assign sites[0] elsewhere
        }

        userData.selectedSite = userData.sites[0]

        console.log("Parsers.UserData", userData)

        return userData


    },


    StaffMembers: function(response) {

        //   {
        //     "Employee_ID": 247464,
        //     "SL_Emp_User_ID": 93633,
        //     "ROSnet_Emp_Name": "ABIGAIL JOHNSTON",
        //     "Primary_Job_ID": 3,
        //     "Job_Description": "Server",
        //     "Phone": "4124985606",
        //     "Email": "ajohnston12017@gmail.com",
        //     "StafflinqPhone": "4124985606"
        // },

        //   {
        //     "userClients": null,
        //     "employeeId": 0,
        //     "userId": 93633,
        //     "location": 2020011,
        //     "name": "ABIGAIL JOHNSTON",
        //     "shareEmail": false,
        //     "sharePhone": true,
        //     "phone": "4124985606",
        //     "email": "ajohnston12017@gmail.com",
        //     "imageData": null,
        //     "imagePath": null
        // },


        let list = []

        response.forEach(function(p){

            let item = {
                employeeId: p.Employee_ID,
                stafflinqId: p.SL_Emp_User_ID,
                name: Parsers.Name(p.ROSnet_Emp_Name),
                shareEmail: false,
                sharePhone: false,
                phone: Parsers.Phone(p.Phone),
                email: p.Email,
                imageData: null,
                imagePath: null

            }

            if(item.email && item.email.length > 0) item.shareEmail = true

            if(item.phone && item.phone.length > 0) item.sharePhone = true

            list.push(item)

        })



        return list



    },


    // Name parser
    Name: function(name) {

        // improve the name display
        // From: CANDICE DOMINGUEZ FIELDS
        // To: {
        //   "first": "Candice",
        //   "last": "Dominguez",
        //   "initials": "CD",
        //   "name": "Candice Dominguez"
        // }

        // console.log("parsing : " + name)
        let parsed = {
            full: "",
            first: "",
            last: "",
            initials: "",
            firstAndLast: ""
        }

        if(name && name != undefined) {
        // if last name, first
        if(name.indexOf(',') != -1) {
            parsed.first = name.split(',')[1].trim()
            parsed.last = name.split(',')[0].trim()
        }
        // if first name space last
        else {
            parsed.first = name.split(' ')[0].trim()
            parsed.last = name.split(' ')[1].trim()
        }


        // Change upper-case to title-case for the UI
        parsed.first = parsed.first.substring(0,1) + parsed.first.substring(1).toLowerCase()
        parsed.last = parsed.last.substring(0,1) + parsed.last.substring(1).toLowerCase()

        parsed.firstAndLast = parsed.first + " " + parsed.last

        parsed.initials = parsed.first.substring(0,1) + parsed.last.substring(0,1)

        // console.log("parsed: " + JSON.stringify(parsed, null, 2))

        }

        return parsed

    },

    // Phone number parser
    Phone: function(phone) {

        // only keep 0-9
        let parsed = phone

        if(phone && phone.length > 0) {
        
            parsed = phone.replace(/[^0-9]+/, '');

            //console.log("parsing phone: ", phone)
            
            if(phone && phone.length > 0) {

                // 6108107021
                let area = phone.substring(0,3)
                let pfx = phone.substring(3,6)
                let sfx = phone.substring(6)

                parsed = area + '-' + pfx + '-' + sfx

                //console.log("parsed: ", parsed)

            }
        }

        return parsed
                            
    }


}