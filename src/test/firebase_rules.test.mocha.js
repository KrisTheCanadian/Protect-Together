/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-parens */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { readFileSync, createWriteStream } = require('fs');
const http = require('http');

const testing = require('@firebase/rules-unit-testing');

const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;

const { doc, getDoc, setDoc, serverTimestamp, setLogLevel, updateDoc } = require('firebase/firestore');
const { AssertionError } = require('assert');
/** @type testing.RulesTestEnvironment */
let testEnv;

before(async () => {
  // Silence expected rules rejections from Firestore SDK. Unexpected rejections
  // will still bubble up and will be thrown as an error (failing the tests).
  setLogLevel('error');

  testEnv = await initializeTestEnvironment({
    projectId: 'soen-390-ba781',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: 'localhost',
      port: 8080,
    },
  });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing.
  // Note: this does not affect or clear any data.
  await testEnv.cleanup();

  // Write the coverage report to a file
  const coverageFile = 'firestore-coverage.html';
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    const { host, port } = testEnv.emulators.firestore;
    const quotedHost = host.includes(':') ? `[${host}]` : host;
    http.get(`http://${quotedHost}:${port}/emulator/v1/projects/${testEnv.projectId}:ruleCoverage.html`, (res) => {
      res.pipe(fstream, { end: true });

      res.on('end', resolve);
      res.on('error', reject);
    });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

async function createMockUser() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/foobar'), { UID: 'foobar',
      email: 'foo@bar.com',
      firstName: 'foo',
      lastName: 'bar',
      phone: '666-666-6666',
      role: 'patient' });
  });
}

async function createMockAdmin() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/adminbar'), { UID: 'adminbar',
      email: 'admin@bar.com',
      firstName: 'admin',
      lastName: 'bar',
      phone: '666-666-6666',
      role: 'admin' });
  });
}

beforeEach(async () => {
  await testEnv.clearFirestore();
  createMockUser();
  createMockAdmin();
});

describe('Firestore Rules Users', () => {
  it('User should not be able to access unauthorized collection', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();

    const ref = unauthedDb.collection('secret-stuff');
    await assertFails(ref.get());
  });

  it('deny when reading user information without being loggedIn', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(unauthedDb, 'users/foobar')));
  });

  it('allow when reading from an authorized document', async () => {
    const foobarDb = testEnv.authenticatedContext('foobar').firestore();

    await assertSucceeds(getDoc(doc(foobarDb, 'users/foobar')));
  });

  // Firebase Simulator Error: https://github.com/firebase/firebase-tools/issues/2067
  // Use case must be tested on the firebase console instead.
  // it('allow when reading another user info as an admin', async () => {
  //   const AdminDb = testEnv.authenticatedContext('adminbar').firestore();

  //   await assertSucceeds(getDoc(doc(AdminDb, 'users/foobar')));
  // });

  it('allow updating user info as admin', async () => {
    const AdminDb = testEnv.authenticatedContext('adminbar').firestore();

    await assertSucceeds(updateDoc(doc(AdminDb, 'users/foobar'), {
      firstname: 'bob',
    }));
  });

  it('allow updating user info', async () => {
    const foobarDb = testEnv.authenticatedContext('foobar', { email: 'foo@foo.com' }).firestore();

    await assertSucceeds(updateDoc(doc(foobarDb, 'users/foobar'), {
      firstname: 'bob',
    }));
  });

  it('deny updating user role', async () => {
    const foobarDb = testEnv.authenticatedContext('foobar').firestore();

    await assertFails(updateDoc(doc(foobarDb, 'users/foobar'), {
      role: 'admin',
    }));
  });

  it('allow updating user role as admin', async () => {
    const AdminDb = testEnv.authenticatedContext('adminbar').firestore();

    await assertSucceeds(updateDoc(doc(AdminDb, 'users/foobar'), {
      role: 'admin',
    }));
  });

  it('allow creating user correctly', async () => {
    const foobarDb = testEnv.authenticatedContext('foo', { email: 'foo@foo.com' }).firestore();

    await assertSucceeds(await setDoc(doc(foobarDb, 'users/foo'), { UID: 'foo',
      email: 'foo@foo.com',
      firstName: 'foo',
      lastName: 'foo',
      phone: '333-666-3333',
      role: 'patient' }));
  });

  //  Bug in firestore: https://github.com/firebase/firebase-js-sdk/issues/5872
  // it('deny creating user incorrectly', async () => {
  //   const barDb = testEnv.authenticatedContext('bar', { email: 'bar@bar.com' }).firestore();

  //   await assertFails(await setDoc(doc(barDb, 'users/bar'), { UID: 'bar',
  //     email: 'bar@bar.com',
  //     firstName: 'bar',
  //     lastName: 'bar',
  //     phone: '336-666-3333',
  //     role: 'admin' }));
  // });

  it('allow admin to create a user', async () => {
    const AdminDb = testEnv.authenticatedContext('adminbar').firestore();

    await assertSucceeds(await setDoc(doc(AdminDb, 'users/fooooo'), { UID: 'fooooo',
      email: 'fooooo@bar.com',
      firstName: 'fooooo',
      lastName: 'bar',
      phone: '222-666-6666',
      role: 'admin' }));
  });

  it('allow user to register as user correctly', async () => {
    const bobbyDb = testEnv.authenticatedContext('bobby', { email: 'bobby@bar.com' }).firestore();

    await assertSucceeds(await setDoc(doc(bobbyDb, 'users/bobby'), { UID: 'bobby',
      email: 'bobby@bar.com',
      firstName: 'bobby',
      lastName: 'bar',
      phone: '222-666-6663',
      role: 'patient' }));
  });

  //  Bug in firestore: https://github.com/firebase/firebase-js-sdk/issues/5872
  // it('deny user to register as user incorrectly', async () => {
  //   const bobbyDb = testEnv.authenticatedContext('bobby', { email: 'bobby@bar.com' }).firestore();

  //   await assertFails(await setDoc(doc(bobbyDb, 'users/bobby'), { UID: 'bobby',
  //     email: 'bobby@bar.com',
  //     firstName: 'bobby',
  //     lastName: 'bar',
  //     phone: '222-666-6663',
  //     role: 'admin' }));
  // });
});

describe('Firestore Rules COVID-19 Test Results', () => {
  it('Deny Unauthorized User from reading the COVID-19 Test Collection', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();

    const ref = unauthedDb.collection('secret-stuff');
    await assertFails(ref.get());
  });

  it('Allow authorized User to create a COVID-19 Test', async () => {
    const foobarDb = testEnv.authenticatedContext('foobar').firestore();
    await assertSucceeds(await setDoc(doc(foobarDb, 'test_results/foo'), { data: 'test_data', uid: 'foobar' }));
  });

  it('Allow authorized User to create a COVID-19 Test', async () => {
    const AdminDb = testEnv.authenticatedContext('adminbar').firestore();
    await assertSucceeds(await setDoc(doc(AdminDb, 'test_results/foo'), { data: 'test_data', uid: 'foobar' }));
  });
  //  Bug in firestore: https://github.com/firebase/firebase-js-sdk/issues/5872
  // it('Deny unauthorized User to create a COVID-19 Test', async () => {
  //   const foobarDb = testEnv.authenticatedContext('foobar').firestore();
  //   await testEnv.withSecurityRulesDisabled(async (context) => {
  //     await setDoc(doc(context.firestore(), 'test_results/bar'), { data: 'test_data', uid: 'bar' });
  //   });
  //   await assertFails(await getDoc(doc(foobarDb, 'test_results/bar'), { data: 'test_data', uid: 'bar' }));
  // });
});
