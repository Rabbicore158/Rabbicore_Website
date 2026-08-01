import fs from "fs";
import { buildPlaceholderSvg } from "../src/utils/placeholder.js";
import { saveImage } from "./image-writer.mjs";

function slugify(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Tip banks per category, each tip has a heading + two paragraphs of real, specific advice.
const bank = {
  "Living Room": [
    ["Layer Your Textures", "A room with only smooth surfaces reads flat no matter how nice the furniture is. Mix a woven jute rug, a nubby wool throw, and a smooth linen sofa so the eye has somewhere to travel.", "Aim for at least three distinct textures in any seating area, one soft, one nubby, one hard-surfaced like wood or ceramic. That contrast is what makes a neutral palette feel rich instead of boring."],
    ["Use Warm, Layered Lighting", "Overhead lighting alone makes a living room feel like an office. Add a floor lamp near the reading chair and a table lamp on the console for pools of warm light at different heights.", "Stick to bulbs in the 2700K–3000K range for a cozy, amber glow, and put your main fixtures on a dimmer if you can. It's the cheapest upgrade that makes the biggest difference at night."],
    ["Anchor the Room with a Rug", "An undersized rug is one of the most common living room mistakes. At minimum, the front legs of your sofa and chairs should rest on the rug so the seating area feels grounded rather than floating.", "For an open-plan space, size the rug to hold the entire conversation area, including side tables. It visually defines the living room as its own zone even without walls."],
    ["Add Natural Elements", "A single large plant does more for a room than three small ones scattered around. Choose one statement plant (a fiddle leaf fig or an olive tree) as a living sculpture in an empty corner.", "If you don't have a green thumb, a well-made faux olive branch arrangement in a ceramic vase gets you 90% of the visual warmth with none of the maintenance."],
    ["Choose a Warm Color Palette", "Cream, terracotta, and warm wood tones create an inviting base that's easy to accessorize around season after season. Save bold colors for pillows, art, and small objects you can swap out.", "If you're nervous about color, start with a 60-30-10 split: 60% neutral base (walls, sofa), 30% secondary tone (rug, curtains), 10% accent (pillows, art)."],
    ["Incorporate Candles or Warm Accents", "Small warm-toned objects (brass candle holders, amber glassware, a wooden bowl) catch the light and add richness without costing much or committing to anything permanent.", "Group objects in odd numbers (three or five) at varying heights on a coffee table or console for a curated, not cluttered, look."],
    ["Mix Vintage with Modern", "A room furnished entirely from one store often looks like a catalog page. One vintage or secondhand piece (an old trunk as a coffee table, a flea-market mirror) gives the space history and character.", "You don't need family heirlooms. A single thrifted piece refinished or left as-is next to newer furniture creates the collected-over-time feeling people pay designers for."],
    ["Add Personal Touches", "Framed photos, travel finds, and books you've actually read make a room feel lived-in rather than staged. Curate a small gallery wall instead of one large piece if you want to tell a story.", "Rotate a few personal objects seasonally, it costs nothing and keeps the space feeling fresh without a full redecorate."],
    ["Define Zones with Furniture Placement", "In an open floor plan, float your sofa away from the wall to create a distinct living room zone rather than lining every piece against the perimeter.", "Leave at least 30 inches of walking space around major furniture pieces so the room feels open rather than obstructed."],
    ["Balance Scale and Proportion", "A too-small sofa in a large room looks lost; an oversized sectional in a small room feels like it's swallowing the space. Measure your room before shopping, not after.", "As a rule of thumb, furniture should fill roughly two-thirds of a wall it's placed against, not the whole wall, and not a third of it."],
  ],
  "Bedroom": [
    ["Choose a Calming Color Palette", "Bedrooms benefit from muted, low-contrast colors (soft sage, warm greige, dusty blue) that don't compete for attention right before sleep.", "Test paint colors at night under your actual bedside lamp, since warm bulbs shift how a color reads compared to daylight."],
    ["Invest in Layered Bedding", "A flat duvet on a bare mattress never looks finished. Layer a fitted sheet, a duvet, a folded throw at the foot of the bed, and at least four pillows in varying sizes.", "Mix pillow textures (a linen euro sham, a knit lumbar, a smooth cotton standard) the same way you'd layer textures in a living room."],
    ["Get the Nightstand Height Right", "A nightstand should sit roughly level with the top of your mattress, give or take two inches. Too low and you're reaching down for your glasses; too high and it looks awkward next to the bed.", "Leave enough surface space for a lamp, a glass of water, and one personal object, resist turning it into extra storage overflow."],
    ["Add a Reading Nook", "Even a small unused corner can hold a single accent chair and a floor lamp, turning the bedroom into more than just a place to sleep.", "Position the chair near natural light during the day and add a dedicated reading lamp for the evening so the corner works around the clock."],
    ["Use a Rug to Soften the Floor", "Stepping onto cold hardwood every morning is a small but real discomfort. A rug that extends at least 18 inches beyond each side of the bed fixes that and grounds the furniture visually.", "For a budget option, two smaller runners on either side of the bed give the same barefoot comfort as one large area rug."],
    ["Declutter the Surfaces", "Nightstands and dressers covered in loose items make a bedroom feel chaotic no matter how nice the furniture is. A tray or small dish corrals daily items into one visually contained spot.", "A good rule: if a surface has more than five visible objects, it needs a basket, tray, or drawer to absorb the overflow."],
    ["Choose Blackout or Layered Curtains", "Light leaking around window edges disrupts sleep more than people realize. Mount curtain rods a few inches wider than the window frame so panels close with full coverage.", "Layering a sheer curtain behind a blackout panel gives you flexibility, soft daytime light, full darkness at night."],
    ["Add a Statement Headboard", "A headboard doesn't just look good, it visually completes the bed and gives you something to lean against while reading or scrolling in bed.", "An upholstered headboard in a durable, easy-to-clean fabric like performance velvet balances comfort with practicality."],
    ["Keep a Clear Path", "Leave at least 24 inches of clearance on each side of the bed and in front of dressers so the room functions well, not just photographs well.", "If space is tight, a bed with built-in storage drawers underneath reclaims closet-level storage without adding furniture footprint."],
    ["Bring in Scent and Sound", "A bedroom is a sensory space, not just a visual one. A simple diffuser or scented candle by the door creates an entry ritual that signals it's time to unwind.", "Choose one signature scent for the bedroom specifically, separate from the rest of the home, so it becomes a cue for rest."],
  ],
  "Kitchen": [
    ["Keep Counters Clear", "A kitchen with three items out on the counter feels calm; one with fifteen feels chaotic, even with identical square footage. Store daily-use small appliances in a cabinet or on a rolling cart.", "Keep only what you use every single day on the counter, everything else belongs behind a door, even if it means a slightly longer reach."],
    ["Organize with Open Shelving Sparingly", "Open shelves look great in photos but require real discipline, everything on display needs to be both useful and attractive.", "If you love the open-shelf look but not the maintenance, use it for a small section only, like above the coffee station, and keep the rest in closed cabinets."],
    ["Add a Runner Rug for Comfort", "Standing at the sink or stove for long stretches is easier on a cushioned runner than on hard tile or wood. Choose a low-pile, washable option for a kitchen specifically.", "Anti-fatigue mats with a woven top layer give you the comfort of cushioning without looking like a gym floor mat."],
    ["Style with a Fruit Bowl or Bread Board", "A simple bowl of lemons or a wooden board leaning against the backsplash adds color and life to a kitchen without any real effort.", "Rotate what's in the bowl seasonally (citrus in winter, stone fruit in summer) for an easy, free refresh."],
    ["Upgrade Your Hardware", "Cabinet knobs and pulls are one of the cheapest, highest-impact kitchen updates. Warm brass or matte black hardware can modernize builder-grade cabinets in an afternoon.", "Measure your existing hole spacing before ordering new pulls, most standard cabinets use either 3-inch or 4-inch spacing."],
    ["Use a Kitchen Island Cart for Flexibility", "If you don't have a built-in island, a rolling cart gives you extra counter space and storage that can move out of the way when you need the floor space back.", "Look for a cart with a butcher-block or stone top so it can double as prep space, not just storage."],
    ["Bring in Greenery Near the Window", "A small herb garden on the windowsill adds life and is genuinely useful, fresh basil or thyme within arm's reach of the stove.", "Choose a container with drainage and a saucer underneath; kitchen windowsills rarely forgive an overwatered pot."],
    ["Choose Timeless Over Trendy for Big Items", "Cabinet color and countertop material are expensive to change, so keep those neutral and save bold choices for things you can swap easily, like a backsplash tile or bar stools.", "If you want a trend, express it through pendant lighting or hardware, both are relatively inexpensive to update again in five years."],
    ["Add Under-Cabinet Lighting", "Task lighting under upper cabinets removes shadows from your countertop workspace and makes evening cooking noticeably easier.", "LED strip lighting on an adhesive backing is a renter-friendly option that requires no electrical work."],
    ["Keep a Dedicated Coffee or Tea Station", "Corralling mugs, a kettle, and coffee supplies into one small zone (even just a tray) keeps the rest of the kitchen from becoming a catch-all.", "A small tiered stand or shelf makes a coffee station feel intentional rather than like clutter that accumulated by accident."],
  ],
  "Bathroom": [
    ["Add a Towel Ladder", "A ladder-style towel rack holds more towels than a standard bar and adds a warm, spa-like visual element to a small bathroom.", "Lean it against a wall near the shower so towels are within reach the moment you step out."],
    ["Layer a Bath Mat with Texture", "A flat cotton mat works, but a chunky tufted or waffle-weave mat adds the same soft-underfoot comfort as a bedroom rug.", "Choose a machine-washable mat for the bathroom specifically, it needs more frequent washing than rugs elsewhere in the home."],
    ["Declutter the Vanity", "Bottles and tubes covering every inch of counter space make even a beautifully tiled bathroom look messy. A tray corrals daily items into one visually contained zone.", "Store backup supplies (extra toothpaste, spare soap) under the sink, not on the counter, and restock the tray as needed."],
    ["Upgrade the Mirror", "A builder-grade mirror is one of the easiest bathroom swaps. A framed or shaped mirror adds character without any plumbing or electrical work.", "Measure your existing mirror's mounting clips before shopping, many replacement mirrors use the same hanging hardware."],
    ["Add Warm-Toned Lighting", "Cool white bathroom lighting is unflattering and clinical. Swap bulbs to a warm white (2700–3000K) for a softer, more forgiving glow.", "Sconces mounted at eye level on either side of the mirror reduce shadows better than a single overhead fixture."],
    ["Use Storage Baskets for Open Shelves", "Open bathroom shelving looks curated when items are grouped in baskets by category (one for hair tools, one for skincare) rather than left loose.", "Woven baskets with handles double as decor and make it easy to pull everything down at once for cleaning."],
    ["Bring in a Plant That Tolerates Humidity", "Bathrooms with a window can support plants like pothos or ferns that actually benefit from the extra humidity.", "If your bathroom has no natural light, a faux plant in a textured ceramic pot gets you the same visual softness."],
    ["Coordinate Hardware Finishes", "Mismatched faucet, towel bar, and cabinet hardware finishes read as unfinished even in an otherwise nice bathroom.", "You don't have to replace the faucet to fix this, often just swapping the towel bar and cabinet pulls to match is enough."],
    ["Add a Shower Caddy or Corner Shelf", "Bottles lined up on the tub edge look cluttered. A hanging caddy or corner shelf keeps the shower itself visually clean.", "Choose a rust-resistant finish like brushed nickel or matte black specifically rated for wet environments."],
    ["Choose a Statement Shower Curtain", "In a rented bathroom where tile and fixtures can't change, the shower curtain is one of the biggest visual opportunities in the room.", "A weighted or lined curtain hangs straighter and looks more intentional than a basic unlined one."],
  ],
  "Dining Room": [
    ["Choose the Right Table Size", "Leave at least 36 inches of clearance between the table edge and the nearest wall or furniture so chairs can pull out comfortably.", "As a general rule, allow 24 inches of table width per seated guest for a comfortable, not cramped, place setting."],
    ["Layer Lighting Over the Table", "A single pendant centered over the table both lights the space properly and acts as the room's visual anchor.", "Hang the fixture 30–34 inches above the tabletop, low enough to feel intimate, high enough not to block sightlines across the table."],
    ["Mix Chair Styles", "An all-matching chair set is safe but can feel stiff. Pairing dining chairs with two different end chairs (a captain's chair or a bench) adds visual interest.", "If you mix styles, keep them in the same wood tone or finish family so the mix reads as intentional rather than mismatched."],
    ["Add a Table Runner Instead of a Tablecloth", "A runner shows off a nice wood table while still adding color and texture down the center.", "Choose a runner in a washable fabric if the table sees daily use, linen blends resist wrinkling and are easy to launder."],
    ["Use a Sideboard for Storage and Display", "A buffet or sideboard keeps table linens and serving pieces out of the kitchen while giving you a surface for a lamp or centerpiece.", "Leave the top of the sideboard no more than two-thirds full so it still functions as usable serving space during meals."],
    ["Create a Simple, Low Centerpiece", "A centerpiece taller than eye level blocks conversation across the table. Keep arrangements low and long rather than tall and round.", "A row of three small vases with a single stem each reads as more elegant than one large, top-heavy arrangement."],
    ["Ground the Space with a Rug", "An area rug under the dining table defines the space in an open floor plan the same way it does in a living room.", "Size the rug so it extends at least 24 inches beyond the table on all sides, enough room for chairs to stay on the rug when pulled out."],
    ["Add a China Cabinet for Everyday Charm", "Displaying everyday dishware in a glass-front cabinet turns storage into decor and keeps the sideboard from becoming overloaded.", "Group dishware by color rather than by set for a more curated, gallery-like display."],
    ["Choose Durable, Cleanable Fabrics", "Dining chairs get more wear and spills than almost any other seat in the house. Performance fabrics resist stains without sacrificing a soft look.", "Look for fabrics labeled for indoor/outdoor or performance use, they clean with just water and mild soap in most cases."],
    ["Keep a Bar Cart Nearby", "A small bar cart near the dining area makes entertaining easier without dedicating a whole cabinet to glassware and bottles.", "Choose a cart with a lower shelf for less-used items and keep the top shelf for what you reach for most often."],
  ],
  "Office": [
    ["Position the Desk Near Natural Light", "Facing a desk toward or beside a window, rather than directly against a wall, reduces eye strain and makes long work sessions feel less draining.", "If glare on a screen is an issue, position the desk perpendicular to the window rather than directly facing it."],
    ["Invest in a Supportive Chair", "A chair is the one piece of office furniture worth spending real money on, since it's used for hours every day.", "Look for adjustable seat height, lumbar support, and armrests that let your shoulders relax rather than hunch."],
    ["Corral Cords and Cables", "Loose cords under a desk are one of the fastest ways to make an otherwise nice office look chaotic.", "A cable tray mounted under the desk or a simple velcro cable sleeve solves 90% of visible cord clutter."],
    ["Add Closed Storage for Paperwork", "Open shelving looks nice for books and objects, but active paperwork needs a drawer or filing cabinet so it doesn't pile up visibly.", "Sort files into broad categories (active, reference, archive) rather than trying to create a precise system you won't maintain."],
    ["Personalize with Art and Objects", "A home office without any personality can feel sterile fast. One piece of art or a few meaningful objects make the space feel like yours.", "Choose art that energizes rather than soothes for a workspace, brighter colors and dynamic compositions work well here, unlike in a bedroom."],
    ["Use a Task Lamp for Focused Light", "Overhead lighting alone creates shadows on a work surface. A dedicated desk lamp fixes this and adds warmth in the evening.", "An adjustable-arm lamp lets you redirect light exactly where you're working, whether that's a keyboard or a notebook."],
    ["Keep the Desktop Nearly Empty", "A desk surface with only a laptop, a lamp, and one object photographs and functions better than one covered in supplies.", "Use a drawer organizer for pens, chargers, and small supplies so they're accessible but not visible."],
    ["Add a Bookcase for Both Storage and Style", "A bookcase gives you vertical storage in a home office where floor space is often limited, and doubles as a backdrop for video calls.", "Style shelves in odd-numbered groupings and leave some negative space, a fully packed bookcase reads as cluttered on camera."],
    ["Choose a Rug to Define the Zone", "In a shared or open room, a rug under the desk area visually separates the office zone from the rest of the space.", "A low-pile rug works best under a rolling chair, high-pile rugs make the chair harder to move."],
    ["Add a Cork or Pin Board", "A dedicated board for notes and reminders keeps sticky notes off the wall and monitor, which reads as clutter even when it's useful clutter.", "Frame the board or choose one in a wood tone that matches your desk so it reads as decor, not just a utility item."],
  ],
  "Outdoor": [
    ["Define the Space with an Outdoor Rug", "An outdoor rug under a patio seating area does the same grounding work outside that it does in a living room.", "Choose a polypropylene or similar synthetic rug rated for outdoor use so it can handle rain and UV exposure without fading fast."],
    ["Layer in String Lights", "String lights strung along a fence line or pergola extend how late you can comfortably use an outdoor space.", "Warm white LED bulbs use less power and run cooler than incandescent, letting you leave them on longer without worry."],
    ["Choose Weather-Resistant Cushions", "Regular indoor cushion fabric mildews and fades quickly outside. Look specifically for outdoor-rated foam and fabric.", "Store cushions in a deck box or bring them in during heavy rain even with weather-resistant fabric, it extends their life significantly."],
    ["Add Greenery in Varying Heights", "A mix of tall planters, medium pots, and low ground plants creates the layered look of a professionally landscaped patio.", "Group odd numbers of pots together rather than spacing them evenly for a more natural, less staged look."],
    ["Create a Focal Point", "A fire pit table or a single striking piece of outdoor furniture gives the eye somewhere to land and makes the space feel designed rather than just furnished.", "Position seating around the focal point in a loose circle or U-shape to encourage conversation."],
    ["Use a Pergola or Umbrella for Shade", "Shade isn't just about comfort, it also protects fabric and wood furniture from sun damage over time.", "A cantilever umbrella frees up floor space compared to a center-pole umbrella, useful for smaller patios."],
    ["Add a Bench for Flexible Seating", "A garden bench adds seating that doesn't require the storage or investment of a full outdoor sofa set.", "Choose a bench in a rot-resistant wood like teak or eucalyptus if it will stay outside year-round uncovered."],
    ["Incorporate a Water Feature or Wind Chime", "Small sensory details (the sound of water or wind chimes) make an outdoor space feel more immersive, not just visually complete.", "A small solar-powered fountain requires no wiring and can be moved easily if you rearrange the space."],
    ["Keep Pathways Clear", "Leave at least 36 inches of clear walking space along main routes through the yard or patio, even when adding more furniture and planters.", "Use low ground-level lighting along pathways for both safety and ambiance after dark."],
    ["Match Indoor and Outdoor Style", "A patio that echoes your indoor color palette feels like an extension of the home rather than an afterthought.", "Carry one or two signature colors from your indoor decor into your outdoor cushions or planters to tie the spaces together."],
  ],
  "Lighting": [
    ["Layer Three Types of Light", "A well-lit room combines ambient (overhead), task (reading/desk), and accent (small decorative) lighting rather than relying on one overhead fixture.", "Aim for at least one lamp for every seating area in a room, in addition to any overhead fixture."],
    ["Choose the Right Bulb Temperature", "Warm white (2700–3000K) suits living spaces and bedrooms; cooler, brighter light (3500–4000K) works better in kitchens and workspaces.", "Check the Kelvin rating on the bulb packaging, 'soft white' and 'daylight' aren't standardized enough to trust without checking the number."],
    ["Use Dimmers Where Possible", "A dimmer switch turns a single fixture into multiple lighting moods, from bright task light to low evening ambiance.", "Make sure any bulb you buy is explicitly labeled dimmable, not all LED bulbs are, and non-dimmable bulbs can flicker or buzz on a dimmer circuit."],
    ["Get Pendant Height Right", "A pendant hung too high loses its impact; hung too low, it blocks sightlines. Over a dining table, 30–34 inches above the surface is the standard range.", "For a kitchen island, aim for 28–32 inches between the bottom of the fixture and the countertop."],
    ["Add a Statement Fixture as a Focal Point", "One striking chandelier or pendant can do more to define a room's character than any other single object.", "If you're nervous about commitment, a statement fixture is one of the easiest things to swap again later, the wiring stays the same."],
    ["Balance Fixture Scale to the Room", "A too-small fixture looks lost on a high ceiling; a too-large one overwhelms a small room. Add the room's length and width in feet, that number in inches is a rough starting diameter for a central fixture.", "For a 12x14 room, that's a roughly 26-inch-diameter fixture as a starting point before adjusting for style and ceiling height."],
    ["Use Lamps to Soften Corners", "Dark corners make a room feel smaller than it is. A floor lamp in an empty corner both lights the space and gives it purpose.", "A tripod or arc floor lamp adds visual interest beyond its function, doing double duty as a decor piece."],
    ["Add Under-Shelf or Under-Cabinet Lighting", "Small LED strips under shelves or cabinets create a soft glow that adds warmth without being a primary light source.", "Battery-powered or plug-in strip lights are renter-friendly options that require no electrical work."],
    ["Choose Fixtures That Match Your Metal Finishes", "Mixing warm brass lighting with cool chrome hardware elsewhere in the room can feel disjointed.", "You don't need every metal in a room to match exactly, but pick one dominant warm or cool tone and let other finishes support it."],
    ["Don't Forget Outdoor Lighting", "Exterior lighting extends usable hours on a patio and adds safety and curb appeal after dark.", "Solar path lights are the easiest starting point since they require no wiring and can be repositioned as your landscaping changes."],
  ],
};

const meta = [
  { title: "15 Cozy Living Room Ideas to Make Your Space Warm and Inviting", cat: "Living Room", excerpt: "Simple, budget-friendly ways to turn any living room into a warm, welcoming space you actually want to spend time in." },
  { title: "Small Living Room Layouts That Actually Work", cat: "Living Room", excerpt: "Furniture arrangements and space-saving tricks for making a compact living room feel open and functional." },
  { title: "How to Style a Coffee Table Like a Designer", cat: "Living Room", excerpt: "A simple formula for coffee table styling that looks curated instead of cluttered, no design degree required." },
  { title: "Small Bedroom Ideas That Look Beautiful", cat: "Bedroom", excerpt: "Space-conscious ideas for making a small bedroom feel calm, organized, and larger than it actually is." },
  { title: "How to Build a Bedroom You Never Want to Leave", cat: "Bedroom", excerpt: "The layering, lighting, and texture choices that separate an ordinary bedroom from a genuinely restful one." },
  { title: "Guest Room Ideas That Feel Like a Boutique Hotel", cat: "Bedroom", excerpt: "Small, thoughtful details that make guests feel taken care of without a full room renovation." },
  { title: "Kitchen Organization Ideas for a Clutter-Free Space", cat: "Kitchen", excerpt: "Practical storage and styling ideas to keep a kitchen counter clear and genuinely usable every day." },
  { title: "Budget Kitchen Updates That Don't Involve Renovation", cat: "Kitchen", excerpt: "Hardware, lighting, and styling changes that refresh a kitchen's look without touching a single cabinet box." },
  { title: "How to Style Open Kitchen Shelving Without It Looking Messy", cat: "Kitchen", excerpt: "The rules that separate a beautifully styled open shelf from a chaotic one." },
  { title: "Minimal Bathroom Decor Ideas for a Spa-Like Feel", cat: "Bathroom", excerpt: "Small changes (texture, lighting, and decluttering) that make a standard bathroom feel like a retreat." },
  { title: "Small Bathroom Storage Ideas That Actually Fit", cat: "Bathroom", excerpt: "Real storage solutions for bathrooms too small for a full vanity overhaul." },
  { title: "Dining Room Ideas for Everyday and Entertaining", cat: "Dining Room", excerpt: "How to set up a dining room that works for a weeknight dinner and a holiday gathering alike." },
  { title: "How to Choose a Dining Table That Actually Fits Your Space", cat: "Dining Room", excerpt: "A practical, measurement-first approach to picking the right dining table size and shape." },
  { title: "Home Office Ideas for a Small Corner of Any Room", cat: "Office", excerpt: "How to build a functional home office setup even without a dedicated spare room." },
  { title: "How to Make a Home Office Feel Less Like a Cubicle", cat: "Office", excerpt: "Design choices that make a work-from-home setup feel warm, personal, and genuinely productive." },
  { title: "Patio Decorating Ideas for Every Budget", cat: "Outdoor", excerpt: "From a small apartment balcony to a full backyard patio, ideas that scale to whatever outdoor space you have." },
  { title: "How to Create a Cozy Backyard Evening Space", cat: "Outdoor", excerpt: "Lighting, seating, and layout ideas for an outdoor space that's just as inviting after sunset." },
  { title: "A Complete Guide to Layering Lighting in Any Room", cat: "Lighting", excerpt: "The three-layer lighting approach interior designers actually use, explained simply." },
  { title: "How to Choose the Right Pendant Light for Your Space", cat: "Lighting", excerpt: "Sizing, hanging height, and style considerations for picking a pendant that fits your room correctly." },
  { title: "Buying Guide: How to Choose a Sofa That Lasts", cat: "Living Room", excerpt: "What to actually look for in frame construction, cushion fill, and fabric before buying a sofa." },
  { title: "Buying Guide: Choosing the Right Area Rug Size", cat: "Living Room", excerpt: "A room-by-room guide to rug sizing so you never end up with one that's too small for the space." },
  { title: "Rustic Farmhouse Decor Ideas for a Warm, Lived-In Look", cat: "Kitchen", excerpt: "How to bring warm, farmhouse-inspired character into a kitchen without it feeling like a theme." },
];

const authors = ["RabbiCore Team", "Maya Chen", "Daniel Ortiz", "Priya Nair"];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function shuffle(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const faqBank = {
  "Living Room": [["How much does a full living room refresh cost?", "It depends heavily on scope, but a meaningful refresh using an existing sofa (new rug, lighting, art, and accessories) typically runs a few hundred dollars and can be done over a weekend."], ["What's the biggest mistake people make in a living room?", "Undersized rugs and furniture pushed entirely against the walls, leaving a dead, unused space in the middle of the room."], ["How do I make a rental living room feel personal?", "Focus on non-permanent changes (rugs, lighting, art, textiles, and plants) since none require landlord approval or a security deposit risk."]],
  "Bedroom": [["What size rug works best under a bed?", "A rug that extends at least 18–24 inches beyond each side of the bed, so your feet land on it when you get up."], ["How many pillows is too many on a bed?", "For a queen or king bed, four to six pillows including shams and one or two decorative accents is the sweet spot before it starts to feel like a hotel display."], ["What's the best lighting for a bedroom?", "Warm white bulbs (2700K) on a dimmer, paired with a bedside lamp for reading, rather than a single bright overhead fixture."]],
  "Kitchen": [["What's the cheapest kitchen update with the biggest impact?", "Swapping cabinet hardware and adding under-cabinet lighting, both are typically under a few hundred dollars combined and take a weekend."], ["Is open shelving actually practical?", "It's practical for a curated subset of dishware and decor, but most kitchens still need at least some closed storage for everyday clutter."], ["How do I keep counters clear long-term?", "Give every small appliance a specific home in a cabinet, and commit to putting it back after each use rather than leaving it out 'for convenience.'"]],
  "Bathroom": [["How do I make a small bathroom feel bigger?", "A large mirror, warm lighting, and a light, uncluttered color palette all help, along with keeping the counter as clear as possible."], ["What's the best material for bathroom storage?", "Moisture-resistant materials like teak, bamboo, or powder-coated metal hold up better than untreated wood or cardboard-based organizers."], ["How often should I replace a bath mat?", "Every 1–2 years with regular washing, sooner if it stops drying out fully between uses, which can lead to mildew."]],
  "Dining Room": [["How many chairs fit around a 6-foot table?", "Six comfortably, or up to eight with narrower chairs and no bulky armrests."], ["What height should a dining pendant hang at?", "30 to 34 inches above the tabletop is the standard comfortable range for most ceiling heights."], ["Do I need a rug under my dining table?", "It's optional but helps define the space in an open floor plan and protects flooring from chair scuffs."]],
  "Office": [["What's the most important piece of office furniture to invest in?", "The chair, it's used for hours daily and has the biggest impact on comfort and long-term posture."], ["How do I set up an office in a shared room?", "Use a rug and a room divider or bookcase to visually separate the work zone, and keep the desk facing away from high-traffic areas."], ["What lighting is best for video calls?", "A light source in front of you, roughly at eye level, rather than overhead or behind you, which causes shadows and silhouettes."]],
  "Outdoor": [["What fabric holds up best outside?", "Solution-dyed acrylic fabric resists fading and mildew far better than standard cotton or polyester blends."], ["Do I need to cover outdoor furniture?", "It extends the furniture's life significantly, especially cushions and fabric, even if the frame itself is weather-rated."], ["What's a low-maintenance way to add greenery outside?", "Self-watering planters or drought-tolerant plants like succulents and ornamental grasses need minimal upkeep."]],
  "Lighting": [["What Kelvin temperature should I use in a living room?", "2700–3000K for a warm, relaxed ambiance that most living spaces benefit from."], ["Are all LED bulbs dimmable?", "No, check the packaging specifically. Using a non-dimmable bulb on a dimmer switch can cause flickering or buzzing."], ["How many lumens do I need for a room?", "As a rough guide, multiply the room's square footage by 20 for ambient lighting, then split that across your fixtures."]],
};

let articles = [];

for (const [idx, m] of meta.entries()) {
  const rnd = seededRandom(idx * 31 + 5);
  const allTips = shuffle(bank[m.cat], rnd);
  const tips = allTips.slice(0, 9);
  const mistakes = allTips.slice(9).concat(allTips.slice(0, 1));
  const author = pick(authors, rnd);
  const date = new Date(2025, (idx * 3) % 12, 3 + ((idx * 7) % 25));
  const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const readMins = 7 + (idx % 5);

  const intro = `${m.excerpt} Whether you're starting from scratch or just want to refresh what you already have, these ${tips.length} ideas are practical, achievable in a weekend or less, and don't require a full renovation budget. We've pulled these recommendations from what actually holds up in real homes (not just what photographs well) so every idea below is something you can put into practice this week, in whatever order makes sense for your space and budget.`;

  const faqs = faqBank[m.cat];

  const sectionsMarkup = tips
    .map((t, i) => `## ${i + 1}. ${t[0]}\n\n${t[1]}\n\n${t[2]}\n`)
    .join("\n");

  const faqMarkup = faqs.map((f) => `**${f[0]}**\n\n${f[1]}\n`).join("\n");

  const mistakesMarkup = mistakes
    .slice(0, 3)
    .map((t) => `- **Skipping this:** ${t[0]} is easy to overlook, but ${t[1].charAt(0).toLowerCase()}${t[1].slice(1)}`)
    .join("\n");

  const shopSection = `Browse our full ${m.cat} collection for pieces that fit the ideas above, from statement furniture to the small finishing touches that tie a room together. Every item includes dimensions, materials, and real customer reviews so you can shop with confidence.`;

  const conclusion = `You don't need to tackle every idea on this list at once. Pick two or three that fit your space and budget this month, live with them, and layer in more over time, the best interiors are the ones that evolve gradually rather than arriving all at once. Small, consistent changes compound: a new rug this month, better lighting next month, and within a season the room looks intentionally designed rather than thrown together. ${shopSection}`;

  const content = `${intro}\n\n${sectionsMarkup}\n## Common Mistakes to Avoid\n\n${mistakesMarkup}\n\n## Frequently Asked Questions\n\n${faqMarkup}\n## Final Thoughts\n\n${conclusion}`;

  const wordCount = content.split(/\s+/).length;

  const heroSvg = buildPlaceholderSvg({ label: m.title, sub: m.cat, width: 1200, height: 700, seed: `article-${idx + 1}` });
  const heroImagePath = await saveImage(heroSvg, `articles/article-${idx + 1}.png`);

  articles.push({
    id: idx + 1,
    slug: slugify(m.title),
    title: m.title,
    category: m.cat,
    excerpt: m.excerpt,
    author,
    date: dateStr,
    dateISO: date.toISOString(),
    readTime: `${readMins} min read`,
    heroImage: heroImagePath,
    toc: tips.map((t, i) => `${i + 1}. ${t[0]}`).concat(["Frequently Asked Questions", "Final Thoughts"]),
    content,
    wordCount,
  });
}

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

fs.writeFileSync(
  new URL("../src/data/articles.js", import.meta.url),
  `// Auto-generated articles (${articles.length} articles)\nexport const articles = ${JSON.stringify(articles, null, 2)};\n`
);

console.log(`Generated ${articles.length} articles. Word counts:`, articles.map((a) => a.wordCount).join(", "));
