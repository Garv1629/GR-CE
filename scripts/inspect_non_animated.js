const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const nonAnimated = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const tagRegex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = tagRegex.exec(content)) !== null) {
    const [fullMatch, tag, attrs, innerHtml] = match;
    const classMatch = attrs.match(/class=["']([^"']*)["']/i);
    const className = classMatch ? classMatch[1] : '';
    const isAnimatedButton = className.includes('animated-button');

    const isButtonTag = tag.toLowerCase() === 'button';
    const isCtaLink = /(?:btn|cta|button|whiteBt|signIn|accountBt|readmore)/i.test(className);

    if ((isButtonTag || isCtaLink) && !isAnimatedButton) {
      const textOnly = innerHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      const idMatch = attrs.match(/id=["']([^"']*)["']/i);

      nonAnimated.push({
        file,
        tag,
        id: idMatch ? idMatch[1] : '',
        className,
        href: hrefMatch ? hrefMatch[1] : '',
        text: textOnly
      });
    }
  }
});

nonAnimated.forEach((item, idx) => {
  console.log(`[${idx+1}] ${item.file} <${item.tag}> id="${item.id}" class="${item.className}" text="${item.text}" href="${item.href}"`);
});
