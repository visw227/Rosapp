

export function getTimeSelectionsForClient(startMinuteOfDay) {

    /*

    04:00 AM
    04:15 AM
    04:30 AM
    04:45 AM
    Etc…
    03:59 AM


    */

    let hours = []
    let mins = ["00","15","30","45"]
    let startHour = startMinuteOfDay / 60

    // create an array of hours starting with the client's business start of day
    for(let i = startHour; i < startHour+12; i++) {

        let ampm = "AM"
        let hour = i
        if(i > 12) {
            hour -= 12
        }
        if(i >= 12) {
            ampm = "PM"
        }

        mins.forEach(function(min){

            hours.push(hour + ":" + min + " " + ampm)

        })

    }


    // do the next 12 hours
    for(let i = startHour; i < startHour+12; i++) {

        let ampm = "PM"
        let hour = i
        if(i > 12) {
            hour -= 12
        }

        // make sure and start back over at AM as needed
        if(i >= 12) {
            ampm = "AM"
        }

        mins.forEach(function(min){

            hours.push(hour + ":" + min + " " + ampm)

        })

    }

    let endOfDay = (startHour -1) + ":59 AM"
    hours.push(endOfDay)

    // console.log("selectors: ", JSON.stringify(hours, null, 2))

    return hours

};