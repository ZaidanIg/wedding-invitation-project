const fs = require('fs');

let content = fs.readFileSync('src/components/layouts/ElegantSundanese.tsx', 'utf8');

const animProps = `initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.8 }}`;

// Replace elements that should be animated
content = content.replace(/<header\s+className="text-center/g, `<motion.header ${animProps} className="text-center`);
content = content.replace(/<\/header>/g, `</motion.header>`);

content = content.replace(/<article\s+className="relative w-full max-w-sm/g, `<motion.article ${animProps} className="relative w-full max-w-sm`);
content = content.replace(/<article\s+className="max-w-sm text-center/g, `<motion.article ${animProps} className="max-w-sm text-center`);
content = content.replace(/<article\s+className="w-full max-w-sm relative z-10"/g, `<motion.article ${animProps} className="w-full max-w-sm relative z-10"`);
content = content.replace(/<article\s+className="w-\[85%\] relative z-10"/g, `<motion.article ${animProps} className="w-[85%] relative z-10"`);

content = content.replace(/<\/article>/g, `</motion.article>`);

// Fix the gift cards
content = content.replace(/<li\s+key=\{gift\.id \|\| idx\}\s+className="relative overflow-hidden/g, `<motion.li key={gift.id || idx} ${animProps} className="relative overflow-hidden`);
content = content.replace(/<li\s+key=\{idx\}\s+className="m-0 p-0">/g, `<motion.li key={idx} ${animProps} className="m-0 p-0">`);

// Replace closing li for the ones we changed
// It's safer to just replace all </li> in GiftSection and EventSection with </motion.li> since we only changed those
content = content.replace(/<\/button>\n\s*<\/li>/g, `</button>\n          </motion.li>`); // Gift
content = content.replace(/<\/article>\n\s*<\/li>/g, `</article>\n              </motion.li>`); // Event

// Fix footer figure and container
content = content.replace(/<div\s+className="relative z-10 flex flex-col items-center"/g, `<motion.div ${animProps} className="relative z-10 flex flex-col items-center"`);
content = content.replace(/<figure\s+className="relative w-20 h-20 opacity-70 mb-6"/g, `<motion.figure animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="relative w-20 h-20 opacity-70 mb-6"`);
content = content.replace(/<\/figure>/g, `</motion.figure>`);

// In footer section
content = content.replace(/<h2 style=\{\{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' \}\} className="text-2xl sm:text-3xl leading-tight mb-1">\n\s*\{data\.groomName\}\n\s*<\/h2>\n\s*<p className="text-xl italic mb-1" style=\{\{ fontFamily: "'Playfair Display', serif", color: C\.goldBright \}\}>&amp;<\/p>\n\s*<h2 style=\{\{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' \}\} className="text-2xl sm:text-3xl leading-tight mb-8">\n\s*\{data\.brideName\}\n\s*<\/h2>\n\s*<p className="text-xs" style=\{\{ color: \`\$\{C\.goldBright\}80\` \}\}>\n\s*© \{new Date\(\)\.getFullYear\(\)\} · Sahinaja Wedding Invitation\n\s*<\/p>\n\s*<\/div>/g, 
  `<h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }} className="text-2xl sm:text-3xl leading-tight mb-1">\n          {data.groomName}\n        </h2>\n        <p className="text-xl italic mb-1" style={{ fontFamily: "'Playfair Display', serif", color: C.goldBright }}>&amp;</p>\n        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }} className="text-2xl sm:text-3xl leading-tight mb-8">\n          {data.brideName}\n        </h2>\n        <p className="text-xs" style={{ color: \`\${C.goldBright}80\` }}>\n          © {new Date().getFullYear()} · Sahinaja Wedding Invitation\n        </p>\n      </motion.div>`);

// Fix rotating mandala in love story
content = content.replace(/<div\s+className="absolute w-\[120%\] max-w-\[600px\] aspect-square opacity-\[0\.08\] pointer-events-none"\s+style=\{\{ top: '15%', right: '-50%' \}\}\s*>\s*<Image src=\{A\.mandala\} alt="Mandala Background" fill className="object-contain" unoptimized \/>\s*<\/div>/g, 
  `<motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute w-[120%] max-w-[600px] aspect-square opacity-[0.08] pointer-events-none" style={{ top: '15%', right: '-50%' }}><Image src={A.mandala} alt="Mandala Background" fill className="object-contain" unoptimized /></motion.div>`);

fs.writeFileSync('src/components/layouts/ElegantSundanese.tsx', content);
