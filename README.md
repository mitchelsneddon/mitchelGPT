# MitchelGPT - Microsoft Teams Bot

MitchelGPT is a Microsoft Teams bot that allows users to send messages to OpenAI via Teams. Built on the Basic Bot Teams Toolkit, MitchelGPT provides users with detailed responses and assistance, leveraging the power of OpenAI's GPT-3.5 model.

## Overview

MitchelGPT can be used in various scenarios, such as:

- Providing technical support and information.
- Offering creative ideas and strategic guidance.
- Interacting with users to answer questions and carry out conversations.

A bot interaction can be a quick Q&A or a complex conversation, providing secure access to cloud services and corporate resources.

## Get Started with MitchelGPT

> **Prerequisites**
>
> To run MitchelGPT on your local machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 16, 18
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teams-toolkit-cli)
> - Additional packages:
>   - `npm install react-axios`
>   - `npm install @azure/data-tables`
>   - `npm install @azure/storage-blob`

1. Select the Teams Toolkit icon on the left in the VS Code toolbar.
2. Press F5 to start debugging, which launches your app in the Teams App Test Tool using a web browser. Select **Debug in Test Tool (Preview)**.
3. The browser will open the Teams App Test Tool.
4. You will receive a welcome message from the bot and can start interacting with it by sending messages.

**Congratulations**! You are now running an application that can interact with users in the Teams App Test Tool.

![MitchelGPT](https://github.com/OfficeDev/TeamsFx/assets/9698542/bdf87809-7dd7-4926-bff0-4546ada25e4b)

## What's Included in the Template

| Folder       | Contents                                     |
| ------------ | -------------------------------------------- |
| `.vscode`    | VSCode files for debugging                   |
| `appPackage` | Templates for the Teams application manifest |
| `env`        | Environment files                            |
| `infra`      | Templates for provisioning Azure resources   |

The following files can be customized and demonstrate an example implementation to get you started.

| File          | Contents                               |
| ------------- | -------------------------------------- |
| `teamsBot.ts` | Handles business logics for MitchelGPT |
| `index.ts`    | Sets up and configures MitchelGPT      |

The following are Teams Toolkit specific project files. You can [visit a complete guide on GitHub](https://github.com/OfficeDev/TeamsFx/wiki/Teams-Toolkit-Visual-Studio-Code-v5-Guide#overview) to understand how Teams Toolkit works.

| File                    | Contents                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `teamsapp.yml`          | This is the main Teams Toolkit project file. The project file defines two primary things: Properties and configuration Stage definitions. |
| `teamsapp.local.yml`    | This overrides `teamsapp.yml` with actions that enable local execution and debugging.                                                     |
| `teamsapp.testtool.yml` | This overrides `teamsapp.yml` with actions that enable local execution and debugging in Teams App Test Tool.                              |

## Extend MitchelGPT

The following documentation will help you extend MitchelGPT:

- [Add or manage the environment](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-multi-env)
- [Create multi-capability app](https://learn.microsoft.com/microsoftteams/platform/toolkit/add-capability)
- [Add single sign-on to your app](https://learn.microsoft.com/microsoftteams/platform/toolkit/add-single-sign-on)
- [Access data in Microsoft Graph](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk#microsoft-graph-scenarios)
- [Use an existing Microsoft Entra application](https://learn.microsoft.com/microsoftteams/platform/toolkit/use-existing-aad-app)
- [Customize the Teams app manifest](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-preview-and-customize-app-manifest)
- Host your app in Azure by [provisioning cloud resources](https://learn.microsoft.com/microsoftteams/platform/toolkit/provision) and [deploying the code to the cloud](https://learn.microsoft.com/microsoftteams/platform/toolkit/deploy)
- [Collaborate on app development](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-collaboration)
- [Set up the CI/CD pipeline](https://learn.microsoft.com/microsoftteams/platform/toolkit/use-cicd-template)
- [Publish the app to your organization or the Microsoft Teams app store](https://learn.microsoft.com/microsoftteams/platform/toolkit/publish)
- [Develop with Teams Toolkit CLI](https://aka.ms/teams-toolkit-cli/debug)
- [Preview the app on mobile clients](https://github.com/OfficeDev/TeamsFx/wiki/Run-and-debug-your-Teams-application-on-iOS-or-Android-client)

## Code Overview

The MitchelGPT bot is built using several key components:

- **Azure Clients Initialization**: The `TableClient` and `BlobServiceClient` are initialized to handle storage operations in Azure.
- **Message Handling**: The `onMessage` method processes incoming messages. It checks for specific commands such as setting the temperature or resetting the conversation, and it interacts with the OpenAI API to generate responses.
- **Welcome Message**: The `onMembersAdded` method sends a welcome message to new members when they join the conversation.
- **Utility Functions**: Functions for saving, retrieving, and clearing conversation history are defined to manage data in Azure Table Storage.
