const {appendFile, exists, readFile, writeFile} = require('fs-extra');

const HEADER_COMMENT = `## Created with gatsby-transformer-versions-yaml`;

module.exports = async function writeRedirectsFile(redirects, publicFolder) {
  if (!redirects.length) {
    return null;
  }

  const FILE_PATH = publicFolder(`_redirects`);

  // Map redirect data to the format Netlify expects
  // https://www.netlify.com/docs/redirects/
  redirects = redirects.map(redirect => {
    const {
      fromPath,
      isPermanent,
      redirectInBrowser, // eslint-disable-line no-unused-vars
      toPath,
      ...rest
    } = redirect;

    // The order of the first 3 parameters is significant.
    // The order for rest params (key-value pairs) is arbitrary.
    const pieces = [
      fromPath,
      toPath,
      isPermanent ? 301 : 302, // Status
    ];

    for (let key in rest) {
      const value = rest[key];

      if (typeof value === `string` && value.indexOf(` `) >= 0) {
        console.warn(
          `Invalid redirect value "${value}" specified for key "${key}". ` +
            `Values should not contain spaces.`,
        );
      } else {
        pieces.push(`${key}=${value}`);
      }
    }

    return pieces.join(`  `);
  });

  let appendToFile = false;

  // Websites may also have statically defined redirects
  // In that case we should append to them (not overwrite)
  // Make sure we aren't just looking at previous build results though
  const fileExists = await exists(FILE_PATH);
  if (fileExists) {
    const fileContents = await readFile(FILE_PATH);
    if (fileContents.indexOf(HEADER_COMMENT) < 0) {
      appendToFile = true;
    }
  }

  const data = `${HEADER_COMMENT}\n\n${redirects.join(`\n`)}`;

  return appendToFile
    ? appendFile(FILE_PATH, `\n\n${data}`)
    : writeFile(FILE_PATH, data);
};
