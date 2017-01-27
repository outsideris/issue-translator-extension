import { expect } from 'chai';

import { normalizeMarkdownSyntax, extractImagesAndLinks, restoreImagesAndLinks } from '../src/translate'

describe('normalizeMarkdownSyntax', () => {
  it('should remove in link, [] ()', () => {
    const text = 'FYI - [@ofrobots] (0) [여기] (1)에 따라 이전 디버그 구현은 V8 5.8까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('FYI - [@ofrobots](0) [여기](1)에 따라 이전 디버그 구현은 V8 5.8까지 지연되었습니다.');
  });

  it('should add a whitespace in a list of a blockquote', () => {
    const text = '> *Chris가 마지막으로 발표 한 버전은 2015 년 4 월 1 일 v1.8.1이었습니다.';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('> * Chris가 마지막으로 발표 한 버전은 2015 년 4 월 1 일 v1.8.1이었습니다.');
  });

  it('should fix broken attribute of tags', () => {
    const text = '<g-emoji alias = "+ 1"fallback-src = "https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png"ios-version = "6.0">< g-emoji>';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('<g-emoji alias = "+ 1" fallback-src = "https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png" ios-version = "6.0">< g-emoji>');
  });

  it('should remove a whitespace in a closing HTML tag', () => {
    const text = '</ g-emoji>';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('</g-emoji>');
  });

  it('should add a whiteapace for headings', () => {
    const text = '#title';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('# title');
  });

  it('should add a whiteapace for heading h6', () => {
    const text = '######title';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('###### title');
  });

  it('should remove a whiteapace between **', () => {
    const text = 'FYI - 이전 디버그 구현은 V8 ** 5.8 **까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('FYI - 이전 디버그 구현은 V8 **5.8**까지 지연되었습니다.');
  });

  it('should remove a whiteapace between __', () => {
    const text = 'FYI - 이전 디버그 구현은 V8 __ 5.8 __까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('FYI - 이전 디버그 구현은 V8 __5.8__까지 지연되었습니다.');
  });

  it('should remove a whiteapace between ~~', () => {
    const text = 'FYI - 이전 디버그 구현은 V8 ~~5.8 ~~까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('FYI - 이전 디버그 구현은 V8 ~~5.8~~까지 지연되었습니다.');
  });

  it('should fix broken HTML closing tags', () => {
    const text = '</ g - emoji>';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('</g-emoji>');
  });

  it('should replace non-breaking spaces with normal spaces', () => {
    const text = '* the last release * the last release';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('* the last release * the last release');
  });

  it('should replace dobule backtick with single backtick', () => {
    const text = '* the last ``release`';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('* the last `release`');
  });
});

describe('extractImagesAndLinks', () => {
  it('should replace images with placeholder and keep the images', () => {
    const text = '[![screen shot 2016-10-18 at 21 11 31](https://images.png)](https://images.png)' +
                 ' and [![screen shot 2016-10-19 at 21 11 31](https://images.png)](https://images.png)';
    const {replacedMarkdownText, images} = extractImagesAndLinks(text);
    expect(replacedMarkdownText).to.equal('[chrome-extension-it4g-img0](chrome-extension-it4g-link0)' +
                                          ' and [chrome-extension-it4g-img1](chrome-extension-it4g-link1)');
    expect(images).to.have.lengthOf(2);
    expect(images[0]).to.equal('![screen shot 2016-10-18 at 21 11 31](https://images.png)');
    expect(images[1]).to.equal('![screen shot 2016-10-19 at 21 11 31](https://images.png)');
  });

  it('should replace url in links with index and keep the links', () => {
    const text = `info: [nodejs/node-v0.x-archive#7533](https://github.com/nodejs/node-v0.x-archive/pull/7533)` +
                 ` and [here](https://github.com)`;
    const {replacedMarkdownText, links} = extractImagesAndLinks(text);
    expect(replacedMarkdownText).to.equal('info: [nodejs/node-v0.x-archive#7533](chrome-extension-it4g-link0)' +
                                          ' and [here](chrome-extension-it4g-link1)');
    expect(links).to.have.lengthOf(2);
    expect(links[0]).to.equal('https://github.com/nodejs/node-v0.x-archive/pull/7533');
    expect(links[1]).to.equal('https://github.com');
  });
});

describe('restoreImagesAndLinks', () => {
  it('should restore images from saved images', () => {
    const text = 'chrome-extension-it4g-img0 and chrome-extension-it4g-img1';
    const images = ['![img1](https://images.png)', '![image 2](http://img.png)'];
    const result = restoreImagesAndLinks(text, undefined, images);
    expect(result).to.equal('![img1](https://images.png) and ![image 2](http://img.png)');
  });

  it('should restore images from saved images', () => {
    const text = 'info: [nodejs/node-v0.x-archive#7533](chrome-extension-it4g-link0) and [here](chrome-extension-it4g-link1)';
    const links = ['https://github.com/nodejs/pull/7533', 'https://github.com'];
    const result = restoreImagesAndLinks(text, links);
    expect(result).to.equal('info: [nodejs/node-v0.x-archive#7533](https://github.com/nodejs/pull/7533)' +
                            ' and [here](https://github.com)');
  });
});
