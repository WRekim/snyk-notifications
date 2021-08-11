const https = require('https');

// Insert your own API token (in account settings).
// https://support.snyk.io/hc/en-us/articles/360004008258-Authenticate-the-CLI-with-your-account
const myApiToken = '' 

// Edit your notification settings (default set to turn off all).
// https://snyk.docs.apiary.io/#reference/users/user-organization-notification-settings/modify-org-notification-settings
const notificationSettings = {
    "new-issues-remediations": {
        "enabled": false,
        "issueSeverity": "high",
        "issueType": "none",
        "inherited": false
    },
    "project-imported": {
        "enabled": false,
        "inherited": false
    },
    "test-limit": {
        "enabled": false,
        "inherited": false
    },
    "weekly-report": {
        "enabled": false,
        "inherited": false
    }
};

getAllOrgs(modifyNotificationsForAll);

function getAllOrgs(callback) {
    const options = {
        hostname: 'snyk.io',
        port: 443,
        path: '/api/v1/user/me',
        method: 'GET',
        headers: {
            'Authorization': `token ${myApiToken}`
        }
    }
    get(options, (myDetails) => {
        const myOrgs = myDetails.orgs;
        callback(myOrgs);
    });
}

function modifyNotificationsForAll(orgs) {

    const payload = JSON.stringify(notificationSettings);

    orgs.forEach(org => {
        const options = {
            hostname: 'snyk.io',
            port: 443,
            path: `/api/v1/user/me/notification-settings/org/${org.id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length,
                'Authorization': `token ${myApiToken}`
            }
        }

        put(options, payload);
    });
}

function get(options, callback) {
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        let body = '';
        res.on('data', d => {
            body += d;
        });
        res.on('end', (chunk) => {
            if (chunk) {
                body += chunk;
            }
            if (callback) {
                callback(JSON.parse(body));
            }
        });
        res.on('error', (err) => {
            console.log(err);
        });
    })

    req.on('error', error => {
        console.error(error)
    });
    req.end();
}


function put(options, payload) {
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    })

    req.on('error', error => {
        console.error(error)
    });

    if (payload) {
        req.write(payload);
    }
    req.end();
}
