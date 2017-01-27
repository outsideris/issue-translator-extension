import { expect } from 'chai';

import { normalizeMarkdownSyntax } from '../src/translate'

describe('normalizeMarkdownSyntax ', () => {
  it('should remove in link, [] ()', () => {
    const text = 'FYI - [@ofrobots] (0) [여기] (1)에 따라 이전 디버그 구현은 V8 5.8까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text, ['0', '1'], []);
    expect(result).to.equal('FYI - [@ofrobots](0) [여기](1)에 따라 이전 디버그 구현은 V8 5.8까지 지연되었습니다.');
  });

  it('should add a whitespace in a list of a blockquote', () => {
    const text = '> *Chris가 마지막으로 발표 한 버전은 2015 년 4 월 1 일 v1.8.1이었습니다.';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('> * Chris가 마지막으로 발표 한 버전은 2015 년 4 월 1 일 v1.8.1이었습니다.');
  });

  it('should fix broken attribute of tags', () => {
    const text = '<g-emoji alias = "+ 1"fallback-src = "https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png"ios-version = "6.0">< g-emoji>';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('<g-emoji alias = "+ 1" fallback-src = "https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png" ios-version = "6.0">< g-emoji>');
  });

  it('should remove a whitespace in a closing HTML tag', () => {
    const text = '</ g-emoji>';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('</g-emoji>');
  });

  it('should add a whiteapace for headings', () => {
    const text = '#title';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('# title');
  });

  it('should add a whiteapace for heading h6', () => {
    const text = '######title';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('###### title');
  });

  it('should remove a whiteapace between **', () => {
    const text = 'FYI - 이전 디버그 구현은 V8 ** 5.8 **까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('FYI - 이전 디버그 구현은 V8 **5.8**까지 지연되었습니다.');
  });

  it('should remove a whiteapace between __', () => {
    const text = 'FYI - 이전 디버그 구현은 V8 __ 5.8 __까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('FYI - 이전 디버그 구현은 V8 __5.8__까지 지연되었습니다.');
  });

  it('should remove a whiteapace between ~~', () => {
    const text = 'FYI - 이전 디버그 구현은 V8 ~~5.8 ~~까지 지연되었습니다.';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('FYI - 이전 디버그 구현은 V8 ~~5.8~~까지 지연되었습니다.');
  });

  it('should fix broken HTML closing tags', () => {
    const text = '</ g - emoji>';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('</g-emoji>');
  });

  it('should replace non-breaking spaces with normal spaces', () => {
    const text = '* the last release * the last release';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('* the last release * the last release');
  });

  it('should replace dobule backtick with single backtick', () => {
    const text = '* the last ``release`';
    const result = normalizeMarkdownSyntax(text, [], []);
    expect(result).to.equal('* the last `release`');
  });
});
