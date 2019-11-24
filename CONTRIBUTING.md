# Contribution guide

## Contribute to Aleph

Aleph uses a combination of [A-Frame components](https://aframe.io/docs/0.9.0/core/component.html) and [StencilJS Web Components](https://stenciljs.com/docs/component).

[Redux](https://redux.js.org) is used to manage state, with reactively-rendered A-Frame custom elements.

### Installing dependencies

Before you can build Aleph, we assume the following list of software is already installed in your system

- Git
- Node 8 or higher
- Npm 6.0 or higher

### Fork repository

In order to contribute to Aleph, you must have a github account so you can push code and create a new Pull Request (PR).

Once you are all setup, following the Github's guide of how to fork a repository: https://guides.github.com/activities/forking/

### Build Aleph

```bash
# Clone your Github repository:
git clone https://github.com/<github username>/aleph.git

# Go to the aleph directory:
cd aleph

# Install npm dependencies
npm install

# Run dev server
npm start
```

### Development Workflow

#### 1. Run Dev Server

```bash
# Move to the aleph folder
cd aleph

# Run dev server
npm start
```

You should be able to navigate to `http://localhost:3333` which will show you the aleph demo page.

**IMPORTANT**

Leave the dev server running in the background while you make changes. The dev server listen for changes and automatically recompile Aleph for you.


#### 2. Open `aleph` folder in your IDE

Stencil components live inside the `aleph/src/components` folder.

A-Frame components live inside the `aleph/src/aframe/components` folder.

Each A-Frame component has a stencil [functional component](https://stenciljs.com/docs/functional-components) wrapper in `aleph/src/functional-components/aframe`

#### 3. Run test suite

Before commiting your changes make sure tests are passing:

```
npm run test
```

#### 4. Create a branch and commit

```bash
# Create a git branch
git checkout -b my-improvement

# Add changes
git add .

# Create commit
git commit -m "fix(component): message"
```

Create a PR:
https://guides.github.com/activities/forking/


### Summary

```bash
# Clone repo
git clone git@github.com:aleph-viewer/aleph.git

# Move to aleph folder
cd aleph

# Install npm dependencies
npm i

# Run dev server
npm start

# Run test suite
npm run test
```
