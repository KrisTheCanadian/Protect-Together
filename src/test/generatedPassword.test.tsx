/* eslint-disable import/extensions */
import generatePassword from '../utils/generatePassword';

test('random temporary password is generated', () => {
  const password = generatePassword();
  expect(password).not.toBeNull();
});
