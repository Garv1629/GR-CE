const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const regex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
let m;
let i = 0;
while ((m = regex.exec(content)) !== null) {
  const [full, tag, attrs, inner] = m;
  const isCta = /(?:btn|cta|button|whiteBt|signIn|accountBt)/i.test(attrs);
  if (isCta) {
    i++;
    const isAnim = attrs.includes('animated-button');
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`[${i}] <${tag}> anim=${isAnim} class="${(attrs.match(/class=["']([^"']*)["']/)||['',''])[1]}" text="${text}"`);
  }
}
