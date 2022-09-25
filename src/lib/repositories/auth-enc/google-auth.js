//@ts-check

class GoogleAuth {
    constructor(){
        const {OAuth2Client} = require('google-auth-library');
        this.OAuth2Client = OAuth2Client;
        
    }

    verify = async (CLIENT_ID, token) => {
        const client = new this.OAuth2Client(CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
}

module.exports = GoogleAuth;