# Contributing to Azure Communication Services Sample Apps

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

  - [Sample App Purpose](#purpose)
  - [Code of Conduct](#coc)
  - [Issues and Bugs](#issue)
  - [Feature Requests](#feature)
  - [Submission Guidelines](#submit)

## <a name="purpose"></a>Sample App Purpose

Sample apps are built to help showcase the capabilities of Azure Communication Services.
This app uses all best practices and follows limitations related to the service.
As you contribute make sure to follow service guidelines or your work might not be accepted.
The app is built on top of the existing Azure Communication Services SDKs, and will not diverge from the capabilities offered by the SDK.
This means that if the feature desired is not supported on the SDK, please don't try to hack it into the sample.

## <a name="coc"></a> Code of Conduct

Help us keep this project open and inclusive. Please read and follow our [Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

## <a name="issue"></a> Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by
[submitting an issue](.github/ISSUE_TEMPLATE/report-a-bug.md) to the GitHub Repository. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Want a Feature?

You can *request* a new feature by [submitting an issue](.github/ISSUE_TEMPLATE/request-a-feature.md) to the GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.

- **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

- Search the repository (https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.

* Make your changes in a new git fork
* Commit your changes using a descriptive commit message
* Push your fork to GitHub
* In GitHub, create a pull request
* If the reviwers suggest changes then:
  - Make the required updates.
  - Rebase your fork and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase main -i
    git push -f
    ```

That's it! Thank you for your contribution!
