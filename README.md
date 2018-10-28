# MinimalistMoney

Personal Finances Progressive Web App using Angular6 and firebase
https://victorcarvalhosp.github.io/minimalist-money-angular-6/

## Progress to v0.1
- [X] Landing Page
- [X] Register User
- [X] Login
- [X] Create accounts
- [X] Create categories
- [X] Add income
- [X] Add outcome



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## How to deploy to github pages

This project uses angular-cli-ghpages, so to deploy a new version you need to do:

`ng build --prod --base-href "https://<GIT_USERNAME>.github.io/<REPOSITORY_NAME>/"`
and after:
`npx ngh --dir=dist/<PROJECT_NAME>`

In my case:
`ng build --prod --base-href "https://victorcarvalhosp.github.io/minimalist-money-angular-6/"`
and after `npx ngh --dir=dist/minimalist-money`
