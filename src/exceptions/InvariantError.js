const ClinetError = require('./ClientError');

class InvariantError extends ClinetError {
  constructor (message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;