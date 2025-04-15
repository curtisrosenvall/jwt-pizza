# Curiosity Report: Automating Deployment with CI/CD

## Introduction

For my curiosity report, I decided to explore a topic we learned about in Deliverable 7: Continuous Integration and Continuous Deployment (CI/CD). Prior to this class, my startup in the ecommerce space had been using a manual deployment process, where we wrote code locally and then transferred files to our virtual machine hosted on Azure. This approach was time-consuming and error-prone, so I decided to implement a more efficient workflow.

![Deliverable 7](https://github.com/curtisrosenvall/jwt-pizza/blob/main/curiosityReport/7.png)


## What I Learned

I learned how to connect my Azure virtual machine to GitHub using secrets and the Azure CLI. This allowed me to set up an automated development environment and GitHub Actions workflow that deploys code directly to my virtual machine whenever changes are pushed to specific branches.

## Implementation

### Setting Up GitHub Secrets

To securely connect to my Azure VM, I added the following secrets to my GitHub repository:

- `AZURE_VM_HOST`: The IP address of my Azure VM
- `AZURE_VM_USERNAME`: The username for SSH access
- `AZURE_VM_SSH_KEY`: The private SSH key for authentication
- `AZURE_VM_PORT`: The SSH port

### CI Workflow

I created a GitHub Actions workflow file (`.github/workflows/ci.yml`) that:

1. Triggers on pushes to main/dev branches or pull requests to main
2. Checks out the code
3. Sets up Node.js
4. Installs dependencies
5. Builds the project
6. Deploys to the Azure VM using SSH
7. Creates backups of the previous deployment
8. Restarts the application using PM2

```yaml
name: Deploy to Azure VM
on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  
jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    
    - name: Install dependencies
      run: |
        npm ci
    
    - name: Build project
      run: |
        npm run build
    
    - name: Deploy to Azure VM
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.AZURE_VM_HOST }}
        username: ${{ secrets.AZURE_VM_USERNAME }}
        key: ${{ secrets.AZURE_VM_SSH_KEY }}
        port: ${{ secrets.AZURE_VM_PORT }}
        script: |
          # Create backup of current deployment
          timestamp=$(date +%Y%m%d_%H%M%S)
          if [ -d /path/to/app ]; then
            mkdir -p /path/to/backups
            cp -R /path/to/app /path/to/backups/app_$timestamp
          fi
          
          # Prepare deployment directory
          mkdir -p /path/to/app
          
          # Deploy the new code
          cd /path/to/app
          
          # Clean directory but keep important files/folders
          find . -not -path "./node_modules*" -not -path "./.env*" -delete
          
          # Create temp directory for new files
          mkdir -p /tmp/deploy_temp
          
          # Copy deployment files
          echo "Copying new deployment files..."
          scp -r ${{ github.workspace }}/dist/* /tmp/deploy_temp
          cp -R /tmp/deploy_temp/* /path/to/app/
          rm -rf /tmp/deploy_temp
          
          # Install any dependencies if needed
          cd /path/to/app
          npm ci --production
          
          # Restart the application
          pm2 restart app || pm2 start app.js --name app

```
## Taking what I learned and applying it

In class we learned how to do all this using AWS, so taking that knowledge and transfering it over to Azure wasnt too hard. They are basically the same they just use different names for things.

## Conclusion

This whole CI/CD setup has been a game-changer for our workflow! No more tedious manual file transfers - now our code zips straight from GitHub to our Azure VM automatically. It's saved us tons of time, cut down on those frustrating deployment errors, and made it way easier for everyone on the team to work together.

I'm pretty stoked about the skills I picked up from this little project. I can now set up these automated workflows for any app we build in the future. Plus, I've gotten much more comfortable with GitHub Actions, SSH deployment, and managing cloud stuff in general. Definitely worth the effort to figure it all out!
