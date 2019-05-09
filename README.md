# Weather Power-Up for Trello

A small sample Power-Up for Trello that shows weather data on cards. It
piggyback's on the locations that can be added to cards using the
[Map Power-Up](https://trello.com/power-ups/5ad892c30b141641d32919bf/map).

If a card has a location set on it, this Power-Up will automatically show
current weather data on the front and back of the card.

## Setup Prerequisites

We developed this Power-Up live on a YouTube stream which you can find here:
https://www.youtube.com/watch?v=dLCkcQnwAQk

### NodeJS

We use [NodeJS](https://nodejs.org) to build our Power-Up. Currently, this
project expects that you are running version 12.x

We recommend you use a tool called [nvm](https://github.com/nvm-sh/nvm) to help
you manage your versions of node. If you have it installed, you can simply run
`nvm i` in this directory to install the right version of node.

### Yarn

We use [Yarn](https://yarnpkg.com) to install and manage our dependencies. Once
you've got Yarn installed, in this directory, you can run `yarn install` to
setup your dependencies locally.

### OpenWeatherMap

This Power-Up relies on the awesome [OpenWeatherMap](https://openweathermap.org/)
project. You'll need to [sign up](https://home.openweathermap.org/users/sign_up)
for your own free account to use their API. Once you have an account grab your
[API key](https://home.openweathermap.org/api_keys) as you'll need to set that
as an environment variable wherever you are building your Power-Up as `APP_ID`.

In Netlify you can set environment variables at the site level:
`Settings > Build & deploy > Environment > Environment variables`

### Hosting

We need a place to host our Power-Up. For the purposes of this example we
recommend [Netlify](https://www.netlify.com/) which has an excellent free plan.

If you fork this repository, you can point your Netlify site at your forked
version of the repository.

1. Click `New site from Git`
2. Find and select your version of this repository
3. Your "Build command" should be `yarn build`
4. Your "Publish directory" should be `dist`
5. Click `Deploy site` and your Power-Up will build and have a Netlify address

## Resources

Trello has a whole [Developers Site](https://developers.trello.com/) with
various guides and documentation.

You can jump right to
[Power-Ups Documentation](https://developers.trello.com/reference#power-ups-intro)
