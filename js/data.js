/* ==========================================================================
   MERIDIAN — Data
   All content is centralized here so markup is generated once, consistently,
   from a single source of truth (no duplicated hand-written cards).
   ========================================================================== */

const IMG = {
  watch1: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
  watch2: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  watch3: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80',
  watch4: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80',
  watch5: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80',
  watch6: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80',
  watch7: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&w=900&q=80',
  watch8: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=80',
  watch9: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=900&q=80',
  watch10: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=900&q=80',
  watch11: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=900&q=80',
  watch12: 'https://unsplash.com/photos/silver-and-black-analog-watch-fgCnYUwK_E8',
  atelier1: 'https://images.unsplash.com/photo-1495996547021-3423bad5427a?auto=format&fit=crop&w=1000&q=80',
  atelier2: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
  workshop: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
  press: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=900&q=80',
};

const CATEGORIES = [
  { id:'diver', name:'Diver', icon:'water', count:24, img:IMG.watch2, desc:'Built for depth. Unidirectional bezels, screw-down crowns and 200m+ water resistance meet a sport-luxury silhouette that transitions from the reef to the boardroom without missing a beat.' },
  { id:'dress', name:'Dress', icon:'diamond', count:18, img:IMG.watch6, desc:'The thinnest cases in the collection, finished with domed crystals and hand-guilloché dials. Dress watches are built for the cuff of a tailored shirt and for evenings that matter.' },
  { id:'pilot', name:'Pilot', icon:'flight', count:15, img:IMG.watch4, desc:'Oversized, legible, and unmistakably aeronautic. Big-crown pilot watches borrow directly from 1940s cockpit instruments, reworked with modern movements and lume that actually lasts till dawn.' },
  { id:'chrono', name:'Chronograph', icon:'timer', count:21, img:IMG.watch1, desc:'Tri-compax layouts, column-wheel movements and tachymeter bezels for timing anything from a lap to a launch. Our chronographs are engineered first, styled second.' },
  { id:'gmt', name:'GMT & Travel', icon:'public', count:12, img:IMG.watch9, desc:'A second time zone at a glance. Independently adjustable hour hands and 24-hour bezels make these the watch of choice for people who live across more than one clock.' },
  { id:'minimal', name:'Minimalist', icon:'circle', count:16, img:IMG.watch8, desc:'No date window, no clutter — just two hands, a clean dial, and proportions tuned over dozens of prototypes. Minimalist watches for people who want time and nothing else.' },
  { id:'skeleton', name:'Skeleton', icon:'settings', count:9, img:IMG.watch10, desc:'The movement, unhidden. Openworked bridges and exposed gear trains turn the case into a small window onto genuine mechanical craft, finished by hand under a loupe.' },
  { id:'vintage', name:'Vintage-Inspired', icon:'history', count:13, img:IMG.watch3, desc:'Faithful reissues and modern reinterpretations of archive references, right down to the box-shaped crystals and faded tropical dials — with contemporary movements inside.' },
  { id:'ladies', name:'Ladies', icon:'favorite', count:19, img:IMG.watch6, desc:'Smaller cases, the same obsessive finishing. From petite dress pieces to full-lume sport models, built to the same tolerances as the rest of the line — nothing scaled down but the size.' },
  { id:'limited', name:'Limited Edition', icon:'workspace_premium', count:6, img:IMG.watch11, desc:'Numbered runs, rare dial treatments and materials we can only source in small batches. Once a limited edition sells out, it does not return to production.' },
];

const PRODUCTS = [
  { id:'p01', name:'Meridian Abyssal 200', category:'Diver', img:IMG.watch2, price:1290, oldPrice:1590, rating:4.8, reviews:214, stock:'in', badge:'sale', sku:'MRD-DV-200',
    desc:'A dedicated dive watch rated to 200m, with a unidirectional 120-click bezel and a fully lumed dial designed to stay legible in low light and low visibility alike.',
    features:['300m water resistance rated case','Unidirectional 120-click ceramic bezel','Full Super-LumiNova dial and hands','Screw-down crown and caseback'],
    specs:{ 'Case diameter':'41mm', 'Case material':'316L stainless steel', 'Movement':'MRD Cal. 200 automatic', 'Power reserve':'48 hours', 'Water resistance':'200m / 20 ATM', 'Crystal':'Domed sapphire, AR coated' },
    colors:[{n:'Ocean Blue',h:'#1e4a5f'},{n:'Onyx Black',h:'#141414'},{n:'Verdigris',h:'#3e5c50'}],
    sizes:['38mm','41mm','44mm'] },

  { id:'p02', name:'Meridian Aviator MK1', category:'Pilot', img:IMG.watch4, price:1480, oldPrice:null, rating:4.7, reviews:132, stock:'in', badge:'new', sku:'MRD-PL-MK1',
    desc:'An oversized pilot watch with a big onion crown and a matte dial built for instant legibility at altitude — or from across the room.',
    features:['46mm oversized case','Cathedral hands with extended lume','Anti-magnetic soft iron inner case','Vintage-inspired leather strap included'],
    specs:{ 'Case diameter':'44mm', 'Case material':'Brushed titanium', 'Movement':'MRD Cal. 7 automatic', 'Power reserve':'42 hours', 'Water resistance':'100m / 10 ATM', 'Crystal':'Flat sapphire' },
    colors:[{n:'Matte Black',h:'#161616'},{n:'Slate Grey',h:'#4b4f57'}],
    sizes:['42mm','44mm','46mm'] },

  { id:'p03', name:'Meridian Regatta Chrono', category:'Chronograph', img:IMG.watch1, price:2350, oldPrice:2650, rating:4.9, reviews:301, stock:'low', badge:'sale', sku:'MRD-CH-RG1',
    desc:'A column-wheel chronograph with a tri-compax layout and tachymeter scale, built to time everything from sailing starts to sprint splits.',
    features:['Column-wheel chronograph module','Tachymeter bezel','30-minute and 12-hour counters','Exhibition caseback'],
    specs:{ 'Case diameter':'42mm', 'Case material':'Stainless steel, polished + brushed', 'Movement':'MRD Cal. CH9 automatic', 'Power reserve':'52 hours', 'Water resistance':'100m / 10 ATM', 'Crystal':'Box-domed sapphire' },
    colors:[{n:'Panda White',h:'#e9e5da'},{n:'Reverse Panda',h:'#151515'}],
    sizes:['40mm','42mm'] },

  { id:'p04', name:'Meridian Voyager GMT', category:'GMT & Travel', img:IMG.watch9, price:1690, oldPrice:null, rating:4.6, reviews:98, stock:'in', badge:null, sku:'MRD-GT-VY1',
    desc:'A true GMT complication with an independently adjustable local hour hand, so you can track a second time zone without ever stopping the watch.',
    features:['Independent GMT hand','24-hour bi-directional bezel','Quick-set local hour','Ceramic bezel insert'],
    specs:{ 'Case diameter':'40mm', 'Case material':'316L stainless steel', 'Movement':'MRD Cal. GMT3 automatic', 'Power reserve':'50 hours', 'Water resistance':'150m / 15 ATM', 'Crystal':'Sapphire, box-domed' },
    colors:[{n:'Root Beer',h:'#6b3d24'},{n:'Blue/Red',h:'#1c3a63'}],
    sizes:['40mm'] },

  { id:'p05', name:'Meridian Line Two-Hand', category:'Minimalist', img:IMG.watch8, price:690, oldPrice:null, rating:4.5, reviews:76, stock:'in', badge:'new', sku:'MRD-MN-L2',
    desc:'Two hands, a sunbrushed dial, and proportions refined across eleven prototypes. Built for people who want to check the time, not decode it.',
    features:['No-date dial for visual balance','Sunbrushed dial finish','Interchangeable 20mm strap system','Slim 9.8mm case height'],
    specs:{ 'Case diameter':'38mm', 'Case material':'Stainless steel', 'Movement':'MRD Cal. Q2 quartz', 'Power reserve':'—', 'Water resistance':'50m / 5 ATM', 'Crystal':'Flat sapphire' },
    colors:[{n:'Warm Ivory',h:'#e9e2d3'},{n:'Ink Navy',h:'#141c2b'},{n:'Verdigris',h:'#3e5c50'}],
    sizes:['36mm','38mm'] },

  { id:'p06', name:'Meridian Calibre Skeleton', category:'Skeleton', img:IMG.watch10, price:2890, oldPrice:null, rating:4.9, reviews:64, stock:'low', badge:'limited', sku:'MRD-SK-C1',
    desc:'An openworked movement finished by hand under a loupe, with black-polished bridges and a skeletonized rotor visible from both sides of the case.',
    features:['Fully openworked movement','Hand-bevelled bridges','Sapphire dial and caseback','Limited to 300 pieces'],
    specs:{ 'Case diameter':'40mm', 'Case material':'Stainless steel, PVD', 'Movement':'MRD Cal. SK1 hand-wound', 'Power reserve':'70 hours', 'Water resistance':'30m / 3 ATM', 'Crystal':'Double sapphire' },
    colors:[{n:'Gunmetal',h:'#3a3d42'}],
    sizes:['40mm'] },

  { id:'p07', name:'Meridian Archive '+String.fromCharCode(8217)+'62', category:'Vintage-Inspired', img:IMG.watch3, price:1150, oldPrice:1350, rating:4.7, reviews:189, stock:'in', badge:'sale', sku:'MRD-VT-62',
    desc:'A faithful reinterpretation of our 1962 field reference, right down to the box crystal and faded tropical dial — with a modern automatic movement inside.',
    features:['Faded "tropical" dial finish','Box-shaped acrylic-look sapphire','Vintage lume tone (not reactive white)','20mm vintage-tapered strap'],
    specs:{ 'Case diameter':'37mm', 'Case material':'Stainless steel, polished', 'Movement':'MRD Cal. 3 automatic', 'Power reserve':'40 hours', 'Water resistance':'50m / 5 ATM', 'Crystal':'Box-domed sapphire' },
    colors:[{n:'Tropical Brown',h:'#7a5233'},{n:'Aged Cream',h:'#d8cdb2'}],
    sizes:['36mm','37mm'] },

  { id:'p08', name:'Meridian Petite Lune', category:'Ladies', img:IMG.watch6, price:1580, oldPrice:null, rating:4.8, reviews:112, stock:'in', badge:'new', sku:'MRD-LD-PL1',
    desc:'A moonphase complication scaled to a 32mm case, with a hand-guilloché dial and a diamond-set bezel option for evenings that call for a little more shine.',
    features:['Precision moonphase, accurate to 122 years','Hand-guilloché dial','Optional diamond-set bezel','Interchangeable satin strap'],
    specs:{ 'Case diameter':'32mm', 'Case material':'Stainless steel, polished', 'Movement':'MRD Cal. MP1 automatic', 'Power reserve':'38 hours', 'Water resistance':'30m / 3 ATM', 'Crystal':'Domed sapphire' },
    colors:[{n:'Mother of Pearl',h:'#e7e2da'},{n:'Midnight',h:'#161a2b'}],
    sizes:['28mm','32mm'] },

  { id:'p09', name:'Meridian Centennial LE', category:'Limited Edition', img:IMG.watch11, price:3450, oldPrice:null, rating:5.0, reviews:41, stock:'low', badge:'limited', sku:'MRD-LE-C100',
    desc:'Issued for our hundredth year, with a solid brass case that develops a unique patina over time, and a movement finished with a hand-engraved rotor.',
    features:['Solid brass case, ages uniquely with wear','Hand-engraved centennial rotor','Individually numbered 1–100','Presented in a walnut watch box'],
    specs:{ 'Case diameter':'39mm', 'Case material':'Solid brass', 'Movement':'MRD Cal. 100 automatic', 'Power reserve':'60 hours', 'Water resistance':'50m / 5 ATM', 'Crystal':'Sapphire, domed' },
    colors:[{n:'Aged Brass',h:'#9c7a3d'}],
    sizes:['39mm'] },

  { id:'p10', name:'Meridian Fieldmaster', category:'Pilot', img:IMG.watch7, price:940, oldPrice:1090, rating:4.6, reviews:157, stock:'in', badge:'sale', sku:'MRD-PL-FM1',
    desc:'A rugged field-and-flight hybrid with a matte sandwich dial, designed to shrug off knocks that would rattle something more delicate.',
    features:['Sandwich dial construction for depth of lume','Shock-resistant movement mount','Type-2 NATO strap included','Fixed coin-edge bezel'],
    specs:{ 'Case diameter':'40mm', 'Case material':'Stainless steel, sandblasted', 'Movement':'MRD Cal. 4 automatic', 'Power reserve':'44 hours', 'Water resistance':'100m / 10 ATM', 'Crystal':'Flat sapphire' },
    colors:[{n:'Olive Sandwich',h:'#4a4f3a'},{n:'Black Sandwich',h:'#181818'}],
    sizes:['38mm','40mm'] },

  { id:'p11', name:'Meridian Solstice Dress', category:'Dress', img:IMG.watch6, price:1890, oldPrice:null, rating:4.8, reviews:88, stock:'out', badge:null, sku:'MRD-DR-SL1',
    desc:'At 8.4mm thick, this is the slimmest case we produce — a hand-wound dress watch built specifically for the cuff of a formal shirt.',
    features:['8.4mm total case height','Hand-wound micro-rotor movement','Hand-applied faceted indices','Alligator-embossed calf strap'],
    specs:{ 'Case diameter':'38mm', 'Case material':'18k rose gold-plated steel', 'Movement':'MRD Cal. D1 hand-wound', 'Power reserve':'46 hours', 'Water resistance':'30m / 3 ATM', 'Crystal':'Domed sapphire' },
    colors:[{n:'Champagne',h:'#c9b183'},{n:'Slate',h:'#3d4147'}],
    sizes:['36mm','38mm'] },

  { id:'p12', name:'Meridian Trailhand GMT', category:'GMT & Travel', img:IMG.watch12, price:2050, oldPrice:2290, rating:4.7, reviews:73, stock:'low', badge:'sale', sku:'MRD-GT-TH1',
    desc:'A rugged GMT built around a fixed 24-hour bezel and a high-contrast dial, engineered for travelers who need a second time zone without babying their watch.',
    features:['Fixed 24-hour bezel','High-contrast tritium-tone lume','Titanium case for reduced weight','Quick-release strap system'],
    specs:{ 'Case diameter':'41mm', 'Case material':'Grade 5 titanium', 'Movement':'MRD Cal. GMT5 automatic', 'Power reserve':'50 hours', 'Water resistance':'100m / 10 ATM', 'Crystal':'Sapphire, flat' },
    colors:[{n:'Titanium Grey',h:'#5b5f63'},{n:'Black/Green',h:'#1c2a1e'}],
    sizes:['41mm'] },
];

const TESTIMONIALS = [
  { name:'Amara Osei', role:'Architect, Accra', avatar:'https://randomuser.me/api/portraits/women/68.jpg', rating:5, quote:'The Abyssal 200 has been on my wrist through three countries and two dive trips. It still looks new. That case finishing is not something I expected at this price.' },
  { name:'Daniel Whitfield', role:'Pilot, Toronto', avatar:'https://randomuser.me/api/portraits/men/32.jpg', rating:5, quote:'I fly for a living and the Aviator MK1 is the first watch I have owned that I can actually read at altitude without tilting my wrist toward the light.' },
  { name:'Priya Nair', role:'Product Designer, Bengaluru', avatar:'https://randomuser.me/api/portraits/women/44.jpg', rating:5, quote:'The Line Two-Hand is exactly the quiet, well-proportioned watch I had been looking for. It disappears into an outfit the way a good watch should.' },
  { name:'Marco Rinaldi', role:'Sommelier, Turin', avatar:'https://randomuser.me/api/portraits/men/76.jpg', rating:4, quote:'The Regatta Chrono pushers have a satisfying click that most watches twice the price do not manage. My only wish is a slightly shorter lug-to-lug.' },
  { name:'Freya Lindqvist', role:'Marine Biologist, Bergen', avatar:'https://randomuser.me/api/portraits/women/22.jpg', rating:5, quote:'I wear the Abyssal on every research dive. Two years in salt water and the bezel action is still as tight as day one.' },
  { name:'Tobias Reinholt', role:'Software Engineer, Berlin', avatar:'https://randomuser.me/api/portraits/men/51.jpg', rating:5, quote:'Customer service replaced a scratched crystal on my Voyager GMT within a week, no argument, no fee. That is rare in this price bracket.' },
  { name:'Chinwe Adeyemi', role:'Gallery Curator, Lagos', avatar:'https://randomuser.me/api/portraits/women/57.jpg', rating:4, quote:'The Petite Lune moonphase is genuinely accurate and the guilloché dial catches light beautifully under gallery spotlights. A quiet showstopper.' },
  { name:'Hiroshi Tanaka', role:'Watch Collector, Osaka', avatar:'https://randomuser.me/api/portraits/men/85.jpg', rating:5, quote:'I own pieces from several independent brands and the Calibre Skeleton holds its own in finishing. The hand-bevelled bridges are the real thing.' },
];

const TEAM = [
  { name:'Elena Marchetti', role:'Founder & Creative Director', bio:'Trained in Geneva as a dial-maker before founding Meridian to make serious watchmaking accessible outside the traditional maisons.', photo:'https://randomuser.me/api/portraits/women/65.jpg', socials:['linkedin','instagram'] },
  { name:'Julien Faure', role:'Head of Movements', bio:'Spent a decade at a Swiss complications atelier before joining Meridian to lead in-house calibre development.', photo:'https://randomuser.me/api/portraits/men/41.jpg', socials:['linkedin','x'] },
  { name:'Sana Kader', role:'Lead Industrial Designer', bio:'Shapes every case profile by hand in wax before it ever reaches CAD, chasing proportions that read well from across a room.', photo:'https://randomuser.me/api/portraits/women/33.jpg', socials:['instagram','behance'] },
  { name:'Marcus Webb', role:'Director of Quality Assurance', bio:'Runs every reference through a 200-point inspection before it ships, and rejects more prototypes than he approves.', photo:'https://randomuser.me/api/portraits/men/22.jpg', socials:['linkedin'] },
];

const BLOG = [
  { title:'Why We Still Regulate Every Movement by Hand', cat:'Craft', author:'Julien Faure', date:'Jun 14, 2026', img:IMG.watch1, excerpt:'Automated timing machines can catch the obvious faults. The subtle ones still need a trained ear and a steady hand.',
    content:['Most modern movements pass through a timing machine that flags deviations in beat rate within seconds. It is fast, consistent, and catches perhaps eighty percent of what matters.','The remaining twenty percent is where regulation becomes a craft rather than a checklist. A trained regulator listens for irregularities in the escapement that a graph will not clearly show, and makes adjustments in increments smaller than the timing machine can meaningfully display.','Every Meridian movement leaves the workshop with a hand-signed regulation card. It is a small piece of paper, but it represents roughly forty minutes of a person\u2019s undivided attention.'] },
  { title:'The Case for a 200m Rating on a Watch You Will Never Dive', cat:'Design', author:'Sana Kader', date:'Jun 2, 2026', img:IMG.watch2, excerpt:'Over-engineering water resistance is not about diving. It is about the gasket tolerances that come along with it.',
    content:['A 30m rating is nominally "splash resistant." A 200m rating requires thicker gaskets, a screw-down crown, and a caseback torqued to a specific spec every time the watch is opened.','Those same tolerances are what keep moisture out during a humid commute, a hand-wash, or a rainstorm you did not see coming. The dive rating is a proxy for a build quality that pays off in ordinary life.','We rate every sport watch to at least 100m for exactly this reason, even on references that will spend their life in board meetings rather than under water.'] },
  { title:'Reading a Chronograph Tachymeter in Under a Minute', cat:'Guides', author:'Elena Marchetti', date:'May 22, 2026', img:IMG.watch1, excerpt:'The scale around the edge of your chronograph is not decoration. Here is what it is actually measuring.',
    content:['Start the chronograph as an object passes a fixed point, and stop it when that object covers a known distance, typically one kilometre or one mile.','The number the seconds hand lands on around the tachymeter scale reads directly in units per hour, so a stopped time of 30 seconds gives a reading of 120.','It works for anything with a fixed reference distance, which is why the complication has outlived its original use in period rally cars.'] },
  { title:'What Actually Happens Inside a 48-Hour Power Reserve', cat:'Craft', author:'Julien Faure', date:'May 10, 2026', img:IMG.watch9, excerpt:'The mainspring is doing more than storing energy. It is trying to release it as evenly as possible for two straight days.',
    content:['A fully wound mainspring delivers noticeably more torque in its first hours than its last, which is why unregulated movements historically ran fast when freshly wound and slow near depletion.','Modern barrel geometry and a well-tuned escapement flatten that torque curve so the rate stays consistent across the full reserve, not only in the middle of it.','We test every calibre at full wind, half wind, and near-depletion, and only approve movements that hold within specification across all three states.'] },
  { title:'A Short History of the Field Watch', cat:'Heritage', author:'Elena Marchetti', date:'Apr 9, 2026', img:IMG.watch7, excerpt:'The proportions we still use today were decided by military procurement documents, not designers.', 
    content:['Early 20th-century field watches were shaped by legibility specifications written for soldiers reading the time under stress, at a glance, often at night.','That is where the oversized numerals, high-contrast dials, and fixed wire lugs come from — none of it was originally a stylistic choice.','Our Archive \u201962 borrows those proportions directly from a period reference, adjusted only for a slightly larger modern movement.'] },
  { title:'Why Skeleton Movements Cost More to Finish', cat:'Craft', author:'Julien Faure', date:'Mar 30, 2026', img:IMG.watch10, excerpt:'Removing metal from a movement means every remaining surface is now visible, and has to be finished accordingly.',
    content:['In a closed movement, unfinished internal surfaces are simply never seen. Skeletonizing removes that cover.','Every bridge edge that remains has to be bevelled, every visible screw head polished, and every exposed gear train kept free of tool marks.','The finishing hours roughly double compared with an equivalent solid-bridge movement, which is reflected directly in the price of the Calibre Skeleton.'] },
  { title:'How We Choose Strap Leather', cat:'Materials', author:'Sana Kader', date:'Mar 12, 2026', img:IMG.watch3, excerpt:'A strap is the part of the watch that touches you the most. We spend more time on it than most brands admit.',
    content:['We source vegetable-tanned calf leather from tanneries that disclose their tanning process, avoiding chrome tanning for anything that sits directly against skin.','Straps are hand-cut and edge-painted in small batches rather than die-stamped in bulk, which is slower but avoids the slightly frayed edge you see on mass-produced straps.','Every strap ships with a spare set of spring bars, because we would rather you replace a bar than force a strap change with the wrong tool.'] },
  { title:'The Moonphase Complication, Explained Simply', cat:'Guides', author:'Elena Marchetti', date:'Feb 18, 2026', img:IMG.watch6, excerpt:'A moonphase disc does not track the actual moon. It tracks an approximation, and the quality of that approximation varies a lot.',
    content:['A standard moonphase disc completes one rotation roughly every 29.5 days, matching the lunar cycle, but most discs are geared to a rounded fraction that drifts over time.','A "precision" moonphase like the one in the Petite Lune uses a more accurate gear ratio, which only requires manual correction roughly once every 122 years instead of every 2.5 years.','It is a small mechanical detail that most owners will never personally need to correct, but it reflects how tightly the rest of the movement is toleranced.'] },
  { title:'Caring for a Watch You Actually Wear Every Day', cat:'Guides', author:'Marcus Webb', date:'Jan 30, 2026', img:IMG.watch5, excerpt:'Daily wear is the best thing you can do for a mechanical watch. Here is how to not undo that benefit by accident.',
    content:['Mechanical watches benefit from regular wear because consistent motion keeps lubricants distributed evenly across the movement.','Avoid setting the date between roughly 9pm and 3am on watches with a date complication, since the date-change mechanism is mid-engagement during that window and forcing it can damage the gearing.','Have the water resistance gaskets checked roughly every 24 months, even if the watch has never been submerged — gaskets degrade with age regardless of use.'] },
];

const FAQS = [
  { cat:'Orders', q:'How long does shipping take?', a:'Standard shipping arrives within 3–5 business days domestically and 7–12 business days internationally. Expedited options are available at checkout.' },
  { cat:'Orders', q:'Can I change or cancel my order after placing it?', a:'Orders can be changed or cancelled within 60 minutes of placement by contacting support. After that window, the order has typically already entered fulfilment.' },
  { cat:'Orders', q:'Do you ship internationally?', a:'Yes, we ship to over 60 countries. Import duties and taxes, where applicable, are calculated and shown at checkout rather than billed separately on arrival.' },
  { cat:'Orders', q:'Is my payment information secure?', a:'All payments are processed through PCI-DSS compliant providers. We never store full card numbers on our own servers.' },
  { cat:'Returns', q:'What is your return policy?', a:'Unworn watches in original packaging can be returned within 30 days of delivery for a full refund. Worn or altered items are not eligible for return.' },
  { cat:'Returns', q:'How do I start a return or exchange?', a:'Start a return from your account order history, or contact support with your order number. We provide a prepaid return label for domestic orders.' },
  { cat:'Returns', q:'When will I receive my refund?', a:'Refunds are issued to the original payment method within 5–7 business days of us receiving the returned item.' },
  { cat:'Product', q:'What does the water resistance rating actually mean?', a:'Ratings such as 100m or 200m reflect controlled laboratory testing, not a literal diving depth. We recommend the crown always be pushed in before any water exposure.' },
  { cat:'Product', q:'How accurate are your automatic movements?', a:'Our in-house automatic calibres are regulated to within -4/+6 seconds per day, tested across multiple positions before leaving the workshop.' },
  { cat:'Product', q:'Do I need to wind an automatic watch?', a:'Automatic movements wind themselves through wrist motion. If a watch has been unworn for more than 48 hours, a few manual crown rotations will get it started.' },
  { cat:'Product', q:'What strap sizes are compatible with my watch?', a:'Lug widths are listed on each product page under Specifications. Most models use a standard 20mm or 22mm strap with quick-release spring bars.' },
  { cat:'Warranty', q:'What warranty comes with a Meridian watch?', a:'Every watch includes a 3-year international movement warranty covering manufacturing defects, plus lifetime access to our servicing network at preferential rates.' },
  { cat:'Warranty', q:'Does the warranty cover accidental damage?', a:'The manufacturer warranty covers defects in materials and workmanship, not accidental damage such as cracked crystals from impact. Optional accident protection is available at checkout.' },
  { cat:'Warranty', q:'How do I register my warranty?', a:'Warranties are activated automatically at purchase using your order confirmation — no separate registration card is required.' },
  { cat:'Service', q:'How often should a mechanical watch be serviced?', a:'We recommend a full service every 4–5 years for automatic movements, primarily to replace lubricants that degrade over time regardless of wear.' },
];
