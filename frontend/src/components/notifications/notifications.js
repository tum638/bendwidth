import React from "react"

export default function SendNotifications() {
    //request permission to send notifications
   function askNotificationPermission() {
        if (!("Notification" in window)) {
            //check if browser supports notifications
            alert("This browser does not support notifications")
        } else if (Notification.permission === "granted") {
            //check if notification permission has been granted. If so, create a notification
            const notificationText = "You have a new request for a study session"
            new Notification("Call Request", {body: notificationText});
            
        }
         else{
            Notification.requestPermission().then((permission) => {
                //if the user accepts, create a notification
                if (permission === "granted") {
                    new Notification("Notifications enabled!")
                }
            })
        }
   }    

    return (
        <div>
            <button class="notificationPermissionBtn" id="enable" onClick={askNotificationPermission}> Enable Notifications </button>
        </div>
    )       
}       