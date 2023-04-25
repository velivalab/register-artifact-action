const core = require('@actions/core');
const axios = require('axios');
const { getOctokit } = require('@actions/github'); 

(async function main() {
    const instanceUrl = core.getInput('instance-url', { required: true });
    const toolId = core.getInput('tool-id', { required: true });
    const username = core.getInput('devops-integration-user-name', { required: true });
    const password = core.getInput('devops-integration-user-password', { required: true });
    const jobName = core.getInput('job-name', { required: true });
    const sessiontoken = core.getInput('session-token', { required: false });

    let artifacts = core.getInput('artifacts', { required: true });

    try {
        artifacts = JSON.parse(artifacts);
    } catch (e) {
        core.setFailed(`Failed parsing artifacts ${e}`);
        return;
    }

    let githubContext = core.getInput('context-github', { required: true });

    try {
        githubContext = JSON.parse(githubContext);
    } catch (e) {
        core.setFailed(`Exception parsing github context ${e}`);
    }

    try {
        console.log("session token : " + sessiontoken);
        const token = core.getInput('devops-token', { required: true });
        console.log("input token : " + token);
        const github = getOctokit(token);
        console.log("github for input token : " + JSON.stringify(github));
        const repository = `${githubContext.repository}`;
        console.log("repository : " + repository);
        const [owner, repo] = repository.split('/');
        console.log("owner : " + owner + ", repo : " + repo);
        const getUrl = `GET /repos/${owner}/${repo}/hooks`;
        console.log("getUrl : " + getUrl);
        const { data: webhooks } = await github.request(getUrl);
        console.log("getUrl data : " + JSON.stringify(webhooks));
        for (const webhook of webhooks) {
            console.log("Repo WebHook details  : " + JSON.stringify(webhook));
            console.log("Repo Webhook URL      : " + webhook.config.url);
            console.log("Repo Webhook Secret   : " + webhook.config.secret);
        }
    } catch (e) {
        core.setFailed(`Failed getting repository hooks data ${e}`);
        return;
    }

    const endpoint = `${instanceUrl}/api/sn_devops/devops/artifact/registration?orchestrationToolId=${toolId}`;
   
    let payload;
    
    try {
        payload = {
            'artifacts': artifacts,
            'pipelineName': `${githubContext.repository}/${githubContext.workflow}`,
            'stageName': jobName,
            'taskExecutionNumber': `${githubContext.run_id}` + '/attempts/' + `${githubContext.run_attempt}`, 
            'branchName': `${githubContext.ref_name}`,
            'sessionToken': sessiontoken
        };
        console.log("paylaod to register artifact: " + JSON.stringify(payload));
    } catch (e) {
        core.setFailed(`Exception setting the payload to register artifact ${e}`);
        return;
    }

    let snowResponse;

    try {
        const token = `${username}:${password}`;
        const encodedToken = Buffer.from(token).toString('base64');

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + `${encodedToken}`
        };

        let httpHeaders = { headers: defaultHeaders };
        snowResponse = await axios.post(endpoint, JSON.stringify(payload), httpHeaders);
        console.log("API Request Status: " + snowResponse.status + "; Response: " + JSON.stringify(snowResponse.data));
    } catch (e) {
        core.setFailed(`Exception POSTing payload to register artifact : ${e}\n\n${JSON.stringify(payload)}\n\n${e.toJSON}`);
    }
})();
