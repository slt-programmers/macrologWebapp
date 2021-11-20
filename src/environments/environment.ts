// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  backend: 'localhost:8090',
  origin: 'http://localhost:4200',
  stravaUrl: 'http://www.strava.com/oauth/authorize?approval_prompt=force&scope=activity:read_all&response_type=code&state=STRAVACONNECT'
};
