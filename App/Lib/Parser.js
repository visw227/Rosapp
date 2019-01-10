
export function parseName(name) {

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
                        
}

export function parsePhone(phone) {

    let parsed = phone

    //console.log("parsing phone: ", phone)
    
    if(phone && phone.length > 0) {

        // 6108107021
        let area = phone.substring(0,3)
        let pfx = phone.substring(3,6)
        let sfx = phone.substring(6)

        parsed = area + '-' + pfx + '-' + sfx

        //console.log("parsed: ", parsed)

    }

    return parsed
                        
}
