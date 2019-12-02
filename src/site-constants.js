/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://ja.reactjs.org';
const version = '16.10.2';
=======
const urlRoot = 'https://reactjs.org';
const version = '16.12.0';
>>>>>>> e0a0ec3dad47804d0b41d4a7bb81841638dc79dd
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
