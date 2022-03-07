import random from 'js-crypto-random';

function generatePassword() {
  return random.getRandomAsciiString(16);
}

export default generatePassword;
