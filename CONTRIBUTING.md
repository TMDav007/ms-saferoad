# How to Contribute

Thank you for taking the time to contribute to the project. The following is a set of guidelines for contributing to Safe Road -Backend

## Prerequisites

Before installation, make sure you have already installed the following tools:

-   Git
-   NodeJs

## Setup

1. Clone the project using the following command:

```
git clone https://github.com/sytyccco/saferoad-service.git
```

2. Navigate to the project directory

```
cd saferoad-service

cd auth (or to the service you will contribute) 
```

3. Install dependencies using this command

```
 npm install
```

4. Start development server

```
nodemon
```

Now, you are ready to start making changes.

5. Run `git branch` to confirm that you are on the dev branch. Then, pull the latest changes and create a new branch (note: use a self-descriptive name for your feature branch) by doing the following:

```
git checkout dev
git pull . dev
git checkout -b BE-<yourservice>-<my-changes>
```

6. Make your desired changes to any of files using your preferred editor.
   Once you're happy with your changes, add and commit them to your branch, and then push the changes.

```
git add .
git commit
git push -u origin BE-<yourservice>-<my-changes>
```

7. Create a pull request to have your changes merge to dev branch.



### Making pull request

1. When you submit a pull request, several tests are automatically run as GitHub Actions. If any of these tests fail, it is your responsibility to try and resolve the underlying issue(s). If you don't know how to resolve the underlying issue(s), you can ask for help.

2. If your pull request has merge conflicts with the main branch (GitHub checks for this automatically and notifies you), you are responsible for resolving them.


3. Use conventional commit messages for your changes.