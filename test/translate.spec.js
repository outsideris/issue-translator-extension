import { expect } from 'chai';

import { normalizeMarkdownSyntax, extractImagesAndLinks,
         restoreImagesAndLinks, stripTags } from '../src/translate'

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

  it('should remove a whiteapace between unmatched **', () => {
    const text = '**What does this PR do? ** and ** what ** is';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('**What does this PR do?** and **what** is');
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

  it('should remove whitespaces in a link placeholder', () => {
    const text = '[here](🆕0)';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('[here](🆕0)');
  });

  it('should remove whitespaces in a image placeholder', () => {
    const text = '[here](🔀0)';
    const result = normalizeMarkdownSyntax(text);
    expect(result).to.equal('[here](🔀0)');
  });
});

describe('extractImagesAndLinks', () => {
  it('should replace images with placeholder and keep the images', () => {
    const text = '[![screen shot 2016-10-18 at 21 11 31](https://images.png)](https://images.png)' +
                 ' and [![screen shot 2016-10-19 at 21 11 31](https://images.png)](https://images.png)';
    const {replacedMarkdownText, images} = extractImagesAndLinks(text);
    expect(replacedMarkdownText).to.equal('[🔀0](🆕0)' +
                                          ' and [🔀1](🆕1)');
    expect(images).to.have.lengthOf(2);
    expect(images[0]).to.equal('![screen shot 2016-10-18 at 21 11 31](https://images.png)');
    expect(images[1]).to.equal('![screen shot 2016-10-19 at 21 11 31](https://images.png)');
  });

  it('should replace url in links with index and keep the links', () => {
    const text = `info: [nodejs/node-v0.x-archive#7533](https://github.com/nodejs/node-v0.x-archive/pull/7533)` +
                 ` and [here](https://github.com)`;
    const {replacedMarkdownText, links} = extractImagesAndLinks(text);
    expect(replacedMarkdownText).to.equal('info: [nodejs/node-v0.x-archive#7533](🆕0)' +
                                          ' and [here](🆕1)');
    expect(links).to.have.lengthOf(2);
    expect(links[0]).to.equal('https://github.com/nodejs/node-v0.x-archive/pull/7533');
    expect(links[1]).to.equal('https://github.com');
  });

  it('should replace complex url in links with index', () => {
    const text = `[here](http://www.timeanddate.com/worldclock?msg=Node.js+Foundation(CTC)+Meeting+2017-01-18)`;
    const {replacedMarkdownText, links} = extractImagesAndLinks(text);
    expect(replacedMarkdownText).to.equal('[here](🆕0)');
    expect(links).to.have.lengthOf(1);
    expect(links[0]).to.equal('http://www.timeanddate.com/worldclock?msg=Node.js+Foundation(CTC)+Meeting+2017-01-18');
  });

  it('should replace just url in links with index', () => {
    const text = `[https://github.com](https://github.com)`;
    const {replacedMarkdownText, links} = extractImagesAndLinks(text);
    expect(replacedMarkdownText).to.equal('[https://github.com](🆕0)');
    expect(links).to.have.lengthOf(1);
    expect(links[0]).to.equal('https://github.com');
  });
});

describe('restoreImagesAndLinks', () => {
  it('should restore images from saved images', () => {
    const text = '🔀0 and 🔀1';
    const images = ['![img1](https://images.png)', '![image 2](http://img.png)'];
    const result = restoreImagesAndLinks(text, undefined, images);
    expect(result).to.equal('![img1](https://images.png) and ![image 2](http://img.png)');
  });

  it('should restore images from saved images', () => {
    const text = 'info: [nodejs/node-v0.x-archive#7533](🆕0) and [here](🆕1)';
    const links = ['https://github.com/nodejs/pull/7533', 'https://github.com'];
    const result = restoreImagesAndLinks(text, links);
    expect(result).to.equal('info: [nodejs/node-v0.x-archive#7533](https://github.com/nodejs/pull/7533)' +
                            ' and [here](https://github.com)');
  });

  it('should handle broken link syntax', () => {
    const text = 'see #4330 (🆕0)is';
    const links = ['https://github.com/nodejs/pull/7533'];
    const result = restoreImagesAndLinks(text, links);
    expect(result).to.equal('see #4330 (https://github.com/nodejs/pull/7533 )is');
  });
});

describe('stripTags', () => {
  it('should remove <g-emoji> tags', () => {
    const text = '</p>EventEmitters with Observables <g-emoji alias="+1" ' +
                 'fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png" ' +
                 'ios-version="6.0">👍</g-emoji></p>';
    const result = stripTags(text);
    expect(result).to.equal('</p>EventEmitters with Observables 👍</p>');
  });
});
