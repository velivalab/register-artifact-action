# ServiceNow DevOps Register Artifact GitHub Action

This custom action needs to be added at step level in a job to register artifact details in ServiceNow instance.

# Usage
## Step 1: Prepare values for setting up your secrets for Actions
- credentials (username and password for a ServiceNow devops integration user)
- instance URL for your ServiceNow dev, test, prod, etc. environments
- tool_id of your GitHub tool created in ServiceNow DevOps

## Step 2: Configure Secrets in your GitHub Ogranization or GitHub repository
On GitHub, go in your organization settings or repository settings, click on the _Secrets > Actions_ and create a new secret.

Create secrets called 
- `SN_DEVOPS_USER`
- `SN_DEVOPS_PASSWORD`
- `SN_INSTANCE_URL` your ServiceNow instance URL, for example **https://test.service-now.com**
- `SN_ORCHESTRATION_TOOL_ID` only the **sys_id** is required for the GitHub tool created in your ServiceNow instance

## Step 3: Configure the GitHub Action if need to adapt for your needs or workflows
```yaml
registerartifact:
    name: Register Artifact
    runs-on: ubuntu-latest
    steps:
      - name: Register Artifact Step
        uses: velivalab/servicenow-devops-register-artifact@v1
        with:
          devops-integration-user-name: ${{ secrets.SN_DEVOPS_USER }}
          devops-integration-user-password: ${{ secrets.SN_DEVOPS_PASSWORD }}
          instance-url: ${{ secrets.SN_INSTANCE_URL }}
          tool-id: ${{ secrets.SN_ORCHESTRATION_TOOL_ID }}
          context-github: ${{ toJSON(github) }}
          job-name: 'Register Artifact'
          artifacts: '[{"name": "com:customactiondemo","version": "1.${{ github.run_number }}","semanticVersion": "1.${{ github.run_number }}.0","repositoryName": "${{ github.repository }}"}]'
```
The values for secrets should be setup in Step 1. Secrets should be created in Step 2.

## Inputs

### `devops-integration-user-name`

**Required**  DevOps Integration Username to ServiceNow instance. 

### `devops-integration-user-password`

**Required**  DevOps Integration User Password to ServiceNow instance. 

### `instance-url`

**Required**  URL of ServiceNow instance to send register artifact notification. 

### `tool-id`

**Required**  Orchestration Tool Id for GitHub created in ServiceNow DevOps

### `context-github`

**Required**  Github context contains information about the workflow run details.

### `job-name`

**Required**  Display name of the job given for attribute _name_ in which _steps_ have been added for register artifact custom action.

### `artifacts`

**Required**  The list of artifacts to be registered in ServiceNow instance. Each artifact is a JSON object surrounded by curly braces _{}_ containing key-value pair separated by a comma _,_. A key-value pair consists of a key and a value separated by a colon _:_. The keys supported in key-value pair are _name_, _version_, _semanticVersion_, _repositoryName_ key-value pair separated by comma surrounded by curly braces {}. For example, '[{"name": "com:firstrepo","version": "1.${{ github.run_number }}","semanticVersion": "1.${{ github.run_number }}.0","repositoryName": "${{ github.repository }}"}]'

## Outputs
No outputs produced.

## License
Scripts and documentation in this project are released under the [MIT license](LICENSE).
