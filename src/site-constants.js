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
const version = '16.8.3';
=======
const urlRoot = 'https://reactjs.org';
const version = '16.8.4';
>>>>>>> b50fe64c1e88489022eddf2cfff0995778827f84
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
