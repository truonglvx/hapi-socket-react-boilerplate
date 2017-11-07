import Nes from 'nes/client';
import Axios from 'axios';

const socketPrefix = 'todos';

const createNotification = (title, options) => {
    const notification = new Notification(title, options);
  
    setTimeout(notification.close.bind(notification), 2500);
};

const notifyOfChanges = (message) => {
    const title = message ? message.title : 'All Todos Deleted!';
    const options = {
        body: message ? message.body : '',
        icon: message ? 
            'https://raw.githubusercontent.com/google/material-design-icons/master/places/2x_web/ic_ac_unit_black_36dp.png' :
            'https://raw.githubusercontent.com/google/material-design-icons/master/alert/2x_web/ic_add_alert_black_48dp.png',
    };

    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
        /*eslint-disable */
        console.log('This browser does not support desktop notification');
        /*eslint-enable */
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
        createNotification(title, options);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission((permission) => {
            // If the user accepts, let's create a notification
            if (permission === 'granted') {
                createNotification(title, options);
            }
        });
    }
};

export default function subscribeToTodos(callback) {
    const client = new Nes.Client('wss://localhost:3000');

    client.connect((error) => {
        const handler = (updates, flags) => {
            if (error) {
                /*eslint-disable */
                console.error(error);
                /*eslint-enable */
            }

            if (flags) {
                /*eslint-disable */
                console.log(flags);
                /*eslint-enable */
            }

            notifyOfChanges(updates[0]);
            callback(updates);
        };

        client.subscribe(`/${socketPrefix}`, handler, (err) => {
            if (err) {
                /*eslint-disable */
                console.log(err);
                /*eslint-enable */
            }
        });

        Axios.get(`/${socketPrefix}`)
            .then((response) => {
                callback(response.data);
            })
            .catch((getError) => {
                /*eslint-disable */
                console.log(getError);
                /*eslint-enable */
            });
    });
}
