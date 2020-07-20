const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://updateprofile-dtpiyl.firebaseio.com"
});

const { SessionsClient } = require('dialogflow');

exports.dialogFlowGateway = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const { queryInput, sessionId } = request.body;

        const sessionClient = new SessionsClient({ credentials: serviceAccount });
        const session = sessionClient.sessionPath('updateprofile', sessionId);

        const responses = await sessionClient.detectIntent({ session, queryInput });

        const result = responses[0].queryResult;

        response.send(result);

        const { WebHookClient } = require('dialogflow-fulfillment');

        exports.dialogFlowWebhook = functions.https.onRequest((request, response) => {
            const agent = new WebHookClient({ request, response });

            console.log(JSON.stringify(request.body));

            function welcome(agent) {
                agent.add(`Welcome to my agent!`);
            }

            function fallback(agent) {
                agent.add(`Sorry, can you try again ?`);
            }

            async function userOnBoardingHandler(agent) {
                const db = admin.firestore();
                const profile = db.collection('users').doc('felipe');

                const { name, color } = result.parameters;

                await profile.set({ name, color });
                agent.add(`Welcome aboard my friend!`);
            }


            let intentMap = new Map();
            intentMap.set('Default Welcome Intent', welcome);
            intentMap.set('Default Fallback Intent', fallback);
            intentMap.set('UserOnBoarding', userOnBoardingHandler);

        });

    });

});


