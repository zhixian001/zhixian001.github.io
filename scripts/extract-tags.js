const path = require('path');
const fs = require('fs');
const YAML = require('yaml');

const BLOG_REPO_DIRNAME = 'zhixian001.github.io';
const POST_DIRNAME = '_posts';

async function findBlogRootDirectory() {
  const splittedPWD = process.env.PWD.split(BLOG_REPO_DIRNAME);

  if (splittedPWD.length <= 1) {
    throw new Error(`Cannot find blog root : ${BLOG_REPO_DIRNAME}`);
  }

  return path.join(splittedPWD[0], BLOG_REPO_DIRNAME);
}

async function scanPostFiles(rootDirectoryAbsolutePath) {
  const postDirectoryScanResult = await fs.promises.readdir(path.join(rootDirectoryAbsolutePath, POST_DIRNAME));

  return postDirectoryScanResult
    .filter(filename => filename.toLowerCase().endsWith('.md'))
    .map(filename => path.join(rootDirectoryAbsolutePath, POST_DIRNAME, filename));
}

async function parsePostYAMLHeader(postFileAbsolutePath) {
  const blogPostMarkdownText = await fs.promises.readFile(postFileAbsolutePath, { encoding: 'utf-8' });

  const [__, yamlHeaderText, ...___] = blogPostMarkdownText.split('---\n');

  return YAML.parse(yamlHeaderText);
}

/**
 *
 * @param {string[]} postFiles
 * @returns
 */
async function makePostMetadataMap(postFiles) {
  const metadataMap = new Map();

  await Promise.all(postFiles.map(async postFile => {
    const metadata = await parsePostYAMLHeader(postFile);

    metadataMap.set(postFile, metadata);
  }));

  return metadataMap;
}

(async () => {
  // read metadata
  const rootDir = await findBlogRootDirectory();
  const postFiles = await scanPostFiles(rootDir);
  const postsMetadataMap = await makePostMetadataMap(postFiles);


  // process data
  const tagMap = new Map();

  postsMetadataMap.forEach((metadata, filepath) => {
    metadata.tags.forEach(tag => {
      tagMap.set(
        tag,
        [...(tagMap.get(tag) ?? []), filepath]
      );
    });
  });

  console.table(tagMap);
})();
