var environment = {};

environment.staging = {
    'port':3000,
    'envName':'staging'
};

environment.production={
    'port':5000,
    'envName':'production'
};

var executionEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';
var environmentToExport = typeof(environment[executionEnv]) == 'object' ? environment[executionEnv] : environment.staging;

module.exports = environmentToExport;
