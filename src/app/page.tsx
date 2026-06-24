'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type MenuItem = {
  name: string;
  category:
    | 'Chicken Starters'
    | 'Veg Starters'
    | 'Authentic Mandi Dishes'
    | 'Grilled Items'
    | 'Family Combos'
    | 'Beverages';
  price: string;
  description: string;
  popular?: boolean;
};

type Lead = {
  name: string;
  mobile: string;
  createdAt: string;
};

type Feedback = {
  name: string;
  mobile: string;
  rating: string;
  message: string;
  createdAt: string;
};

type Special = {
  name: string;
  description: string;
  price: string;
  offer: string;
};

const WHATSAPP_NUMBER = '918121213533';
const LEADS_KEY = 'majesty_leads';
const SPECIAL_KEY = 'majesty_today_special';
const FEEDBACK_KEY = 'majesty_feedback';
const LOYALTY_KEY = 'majesty_loyalty_points';

const defaultSpecial: Special = {
  name: 'Majesty Friday Mutton Mandi',
  description: 'Slow-cooked mutton mandi with premium aromatic rice and grilled onions.',
  price: '₹349/-',
  offer: 'Flat 10% off for family table bookings above 4 guests.',
};

const menuItems: MenuItem[] = [
  {
    name: 'Chilli Chicken',
    category: 'Chicken Starters',
    price: '₹240/-',
    description: 'Crispy chicken wok-tossed in spicy Indo-Chinese sauces.',
    popular: true,
  },
  {
    name: 'Chicken 65',
    category: 'Chicken Starters',
    price: '₹260/-',
    description: 'Classic deep-fried chicken bites with curry leaf seasoning.',
    popular: true,
  },
  {
    name: 'Chicken Majestic',
    category: 'Chicken Starters',
    price: '₹260/-',
    description: 'Creamy, spicy signature chicken strips with smoky finish.',
    popular: true,
  },
  {
    name: 'Dragon Chicken',
    category: 'Chicken Starters',
    price: '₹260/-',
    description: 'Sweet-spicy crunchy chicken with garlic and peppers.',
    popular: true,
  },
  {
    name: 'Ginger Chicken',
    category: 'Chicken Starters',
    price: '₹260/-',
    description: 'Fresh ginger-forward stir-fried chicken starter.',
  },
  {
    name: 'Chicken Lollipop',
    category: 'Chicken Starters',
    price: '₹240/-',
    description: 'Juicy drumettes marinated in house spice blend.',
    popular: true,
  },
  {
    name: 'Paneer 65',
    category: 'Veg Starters',
    price: '₹250/-',
    description: 'Golden-fried paneer cubes tossed in South Indian masala.',
    popular: true,
  },
  {
    name: 'Paneer Manchuria',
    category: 'Veg Starters',
    price: '₹250/-',
    description: 'Paneer in savory chilli-garlic Indo-Chinese glaze.',
  },
  {
    name: 'Babycorn Chilli',
    category: 'Veg Starters',
    price: '₹220/-',
    description: 'Crunchy babycorn sautéed with bell peppers and sauces.',
    popular: true,
  },
  {
    name: 'Traditional Chicken Mandi',
    category: 'Authentic Mandi Dishes',
    price: '₹300/-',
    description: 'Fragrant rice and tender chicken cooked in Arabian dum style.',
    popular: true,
  },
  {
    name: 'Traditional Mutton Mandi',
    category: 'Authentic Mandi Dishes',
    price: '₹350/-',
    description: 'Authentic bone-in mutton mandi rich with Arabian spices.',
    popular: true,
  },
  {
    name: 'Special Family Mandi Platter',
    category: 'Family Combos',
    price: '₹900/-',
    description: 'Large sharing platter ideal for family and group gatherings.',
    popular: true,
  },
  {
    name: 'Chicken Faham Grill',
    category: 'Grilled Items',
    price: '₹420/-',
    description: 'Chargrilled Arabian-style chicken with saffron glaze.',
  },
  {
    name: 'Mint Lime Cooler',
    category: 'Beverages',
    price: '₹90/-',
    description: 'Refreshing cooler to pair with rich mandi platters.',
  },
];

const categories: Array<MenuItem['category'] | 'All'> = [
  'All',
  'Chicken Starters',
  'Veg Starters',
  'Authentic Mandi Dishes',
  'Grilled Items',
  'Family Combos',
  'Beverages',
];

const gallery = [
  { src: '/inner view.jpg', alt: 'Restaurant interior and group seating' },
  { src: '/dinning place 1.jpg', alt: 'Family dining space' },
  { src: '/chicken juicy mandi.png', alt: 'Signature mandi rice and chicken' },
  { src: '/chilli chicken.png', alt: 'Indo-Chinese starter dish' },
  { src: '/chicken faham mandi.png', alt: 'Grilled chicken specialty' },
  { src: '/fish platter mandi.png', alt: 'Family sharing platter' },
];

const reviews = [
  'Best Mandi in Hanamkonda! The rice is incredibly fragrant and meat is tender.',
  'Excellent chicken starters and generous portions. Great value for ₹200-400.',
  'Perfect ambiance for family gatherings and weekend dinners with friends.',
  'The authentic Arabian flavors make this place stand out.',
];

const openWhatsApp = (text: string) => {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
};

export default function Home() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');
  const [special, setSpecial] = useState<Special>(() => {
    if (typeof window === 'undefined') {
      return defaultSpecial;
    }
    return JSON.parse(localStorage.getItem(SPECIAL_KEY) ?? JSON.stringify(defaultSpecial)) as Special;
  });
  const [specialEditorOpen, setSpecialEditorOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return 0;
    }
    return Number(localStorage.getItem(LOYALTY_KEY) ?? '0');
  });

  const [leadForm, setLeadForm] = useState({ name: '', mobile: '' });
  const [preOrder, setPreOrder] = useState({ name: '', mobile: '', details: '', pickupTime: '' });
  const [feedbackForm, setFeedbackForm] = useState({ name: '', mobile: '', rating: '5', message: '' });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLeadPopup(true), 15000);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch = category === 'All' || item.category === category;
      const queryMatch = `${item.name} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const menuUrl = typeof window === 'undefined' ? '' : `${window.location.origin}/#menu`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl || 'https://example.com')}`;

  const saveSpecial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(SPECIAL_KEY, JSON.stringify(special));
    setSpecialEditorOpen(false);
  };

  const saveLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextLead: Lead = { ...leadForm, createdAt: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem(LEADS_KEY) ?? '[]') as Lead[];
    localStorage.setItem(LEADS_KEY, JSON.stringify([nextLead, ...current]));
    setLeadForm({ name: '', mobile: '' });
    setShowLeadPopup(false);
  };

  const saveFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFeedback: Feedback = { ...feedbackForm, createdAt: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? '[]') as Feedback[];
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify([nextFeedback, ...current]));
    setFeedbackForm({ name: '', mobile: '', rating: '5', message: '' });
    window.alert('Thank you! Your feedback has been saved.');
  };

  const submitPreOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = `Pre-Order Pickup Request\nName: ${preOrder.name}\nMobile: ${preOrder.mobile}\nOrder: ${preOrder.details}\nPickup Time: ${preOrder.pickupTime}`;
    openWhatsApp(message);
  };

  const updateLoyalty = (nextPoints: number) => {
    const normalized = Math.max(0, nextPoints);
    setLoyaltyPoints(normalized);
    localStorage.setItem(LOYALTY_KEY, String(normalized));
  };

  const printQr = () => {
    const popup = window.open('', '_blank', 'width=500,height=700');
    if (!popup) {
      return;
    }
    popup.document.write(`
      <html>
        <head><title>Majesty QR Menu</title></head>
        <body style="font-family: Arial; text-align:center; padding-top:30px;">
          <h2>Majesty Mandi House - QR Menu</h2>
          <img src="${qrCodeUrl}" alt="QR Menu" style="width:280px;height:280px;" />
          <p>Scan to open the latest menu.</p>
          <script>window.print()</script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <main className="bg-[#2a0f0e] text-white">
      {showLeadPopup && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/70 px-4">
          <form onSubmit={saveLead} className="w-full max-w-md rounded-2xl border border-[#e2b95e] bg-[#3a1615] p-6">
            <h2 className="text-2xl font-semibold text-[#f4cf7a]">Exclusive Family Discounts</h2>
            <p className="mt-2 text-sm text-white/80">Get Exclusive Family Discounts and Weekend Mandi Offers</p>
            <input required value={leadForm.name} onChange={(e) => setLeadForm((s) => ({ ...s, name: e.target.value }))} className="mt-4 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Name" />
            <input required value={leadForm.mobile} onChange={(e) => setLeadForm((s) => ({ ...s, mobile: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Mobile Number" />
            <div className="mt-4 flex gap-3">
              <button type="submit" className="flex-1 rounded-lg bg-[#e2b95e] px-4 py-2 font-semibold text-[#2a0f0e]">Unlock Offers</button>
              <button type="button" onClick={() => setShowLeadPopup(false)} className="rounded-lg border border-white/30 px-4 py-2">Later</button>
            </div>
          </form>
        </div>
      )}

      <section className="relative overflow-hidden border-b border-[#5f2d20] bg-gradient-to-b from-[#4b1715] via-[#2a0f0e] to-[#2a0f0e] px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#f4cf7a]">Prasad&apos;s Mäjësty Mändi</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">Majesty Mandi House</h1>
            <p className="mt-4 text-lg text-white/80">Taste the Legacy: Authentic Arabian Mandi in Hanamkonda</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="rounded-lg bg-[#e2b95e] px-5 py-3 font-semibold text-[#2a0f0e]">View Menu</a>
              <button onClick={() => openWhatsApp('Hello Majesty Mandi House, I would like to place an order or reserve a table.')} className="rounded-lg border border-[#e2b95e] px-5 py-3 font-semibold text-[#f4cf7a]">Order on WhatsApp</button>
              <button onClick={() => openWhatsApp('Hello Majesty Mandi House, I would like to reserve a table.')} className="rounded-lg border border-white/40 px-5 py-3">Reserve Table</button>
            </div>
          </div>
          <div className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-[#e2b95e]/40">
            <Image src="/fish platter mandi.png" alt="Majesty Mandi platter" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-semibold text-[#f4cf7a]">About Us</h2>
        <p className="mt-4 leading-8 text-white/85">
          Majesty Mandi House brings authentic Arabian-style mandi preparations, fragrant rice, tender meat dishes, and rich spices to Greater Warangal. We serve generous sharing platters, grilled specialties, and Indo-Chinese starters in a warm, family-friendly dining space.
        </p>
        <p className="mt-4 leading-8 text-white/85">
          With comfortable seating, welcoming hospitality, and flavors rooted in traditional techniques, we are a favorite choice for family outings, friends groups, mandi lovers, and working professionals.
        </p>
      </section>

      <section className="mx-auto max-w-6xl rounded-2xl border border-[#e2b95e]/40 bg-[#381614] px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#f4cf7a]">Today&apos;s Special</h2>
            <h3 className="mt-3 text-xl font-semibold">{special.name}</h3>
            <p className="mt-2 text-white/85">{special.description}</p>
            <p className="mt-2 text-lg font-semibold text-[#f4cf7a]">{special.price}</p>
            <p className="mt-1 text-sm text-[#f7deb0]">{special.offer}</p>
          </div>
          <button onClick={() => setSpecialEditorOpen((state) => !state)} className="rounded-lg border border-[#e2b95e] px-4 py-2 text-sm">Admin Edit</button>
        </div>

        {specialEditorOpen && (
          <form onSubmit={saveSpecial} className="mt-6 grid gap-3 md:grid-cols-2">
            <input value={special.name} onChange={(e) => setSpecial((s) => ({ ...s, name: e.target.value }))} className="rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Dish Name" required />
            <input value={special.price} onChange={(e) => setSpecial((s) => ({ ...s, price: e.target.value }))} className="rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Price" required />
            <input value={special.offer} onChange={(e) => setSpecial((s) => ({ ...s, offer: e.target.value }))} className="rounded-lg border border-white/20 bg-[#2a0f0e] p-3 md:col-span-2" placeholder="Special Offer" required />
            <textarea value={special.description} onChange={(e) => setSpecial((s) => ({ ...s, description: e.target.value }))} className="rounded-lg border border-white/20 bg-[#2a0f0e] p-3 md:col-span-2" placeholder="Description" required />
            <button type="submit" className="rounded-lg bg-[#e2b95e] px-5 py-3 font-semibold text-[#2a0f0e] md:col-span-2">Save Special</button>
          </form>
        )}
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-semibold text-[#f4cf7a]">Full Menu</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {categories.map((value) => (
            <button key={value} onClick={() => setCategory(value)} className={`rounded-full border px-4 py-2 text-sm ${category === value ? 'border-[#f4cf7a] bg-[#f4cf7a] text-[#2a0f0e]' : 'border-white/30'}`}>
              {value}
            </button>
          ))}
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes..." className="mt-4 w-full rounded-lg border border-white/20 bg-[#3a1615] p-3" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredMenu.map((item) => (
            <article key={item.name} className="rounded-xl border border-white/20 bg-[#3a1615] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm text-[#f7deb0]">{item.category}</p>
                </div>
                {item.popular && <span className="rounded-full bg-[#e2b95e] px-3 py-1 text-xs font-semibold text-[#2a0f0e]">Popular</span>}
              </div>
              <p className="mt-3 text-white/80">{item.description}</p>
              <p className="mt-3 text-lg font-semibold text-[#f4cf7a]">{item.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-3xl font-semibold text-[#f4cf7a]">Photo Gallery</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((image, index) => (
            <button key={image.src} onClick={() => setLightboxIndex(index)} className="relative h-40 overflow-hidden rounded-xl border border-white/20 text-left md:h-56">
              <Image src={image.src} alt={image.alt} fill className="object-cover transition duration-500 hover:scale-110" />
            </button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[115] grid place-items-center bg-black/85 p-4">
          <div className="relative h-[70vh] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].alt} fill className="object-contain" />
            <button onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1">✕</button>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold text-[#f4cf7a]">Customer Reviews</h2>
          <span className="rounded-full bg-[#e2b95e] px-4 py-2 font-semibold text-[#2a0f0e]">⭐ 4.4 Stars (1.3K Reviews)</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review} className="rounded-xl border border-white/20 bg-[#3a1615] p-5">“{review}”</article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 md:grid-cols-2">
        <form onSubmit={submitPreOrder} className="rounded-2xl border border-[#e2b95e]/40 bg-[#381614] p-6">
          <h2 className="text-2xl font-semibold text-[#f4cf7a]">Online Pre-Order for Pickup</h2>
          <input required value={preOrder.name} onChange={(e) => setPreOrder((s) => ({ ...s, name: e.target.value }))} className="mt-4 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Customer Name" />
          <input required value={preOrder.mobile} onChange={(e) => setPreOrder((s) => ({ ...s, mobile: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Mobile Number" />
          <textarea required value={preOrder.details} onChange={(e) => setPreOrder((s) => ({ ...s, details: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Order Details" />
          <input required value={preOrder.pickupTime} onChange={(e) => setPreOrder((s) => ({ ...s, pickupTime: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Pickup Time" />
          <button type="submit" className="mt-4 w-full rounded-lg bg-[#e2b95e] px-5 py-3 font-semibold text-[#2a0f0e]">Submit Order on WhatsApp</button>
        </form>

        <div className="rounded-2xl border border-[#e2b95e]/40 bg-[#381614] p-6">
          <h2 className="text-2xl font-semibold text-[#f4cf7a]">Majesty Rewards</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-white/90">
            <li>Every 10th Mandi Free</li>
            <li>Birthday Combo Discount</li>
            <li>Festival Offers</li>
            <li>Exclusive Family Group Deals</li>
          </ul>
          <p className="mt-5 text-sm text-[#f7deb0]">Digital Points Tracker: {loyaltyPoints} / 10</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-[#e2b95e]" style={{ width: `${Math.min(loyaltyPoints * 10, 100)}%` }} />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => updateLoyalty(loyaltyPoints + 1)} className="rounded-lg border border-[#e2b95e] px-4 py-2">Add Point</button>
            <button onClick={() => updateLoyalty(loyaltyPoints >= 10 ? loyaltyPoints - 10 : loyaltyPoints)} className="rounded-lg border border-white/30 px-4 py-2">Redeem 10</button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 md:grid-cols-2">
        <form onSubmit={saveFeedback} className="rounded-2xl border border-white/20 bg-[#3a1615] p-6">
          <h2 className="text-2xl font-semibold text-[#f4cf7a]">Customer Feedback</h2>
          <input required value={feedbackForm.name} onChange={(e) => setFeedbackForm((s) => ({ ...s, name: e.target.value }))} className="mt-4 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Name" />
          <input required value={feedbackForm.mobile} onChange={(e) => setFeedbackForm((s) => ({ ...s, mobile: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Mobile Number" />
          <select value={feedbackForm.rating} onChange={(e) => setFeedbackForm((s) => ({ ...s, rating: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3">
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <textarea required value={feedbackForm.message} onChange={(e) => setFeedbackForm((s) => ({ ...s, message: e.target.value }))} className="mt-3 w-full rounded-lg border border-white/20 bg-[#2a0f0e] p-3" placeholder="Feedback Message" />
          <button type="submit" className="mt-4 w-full rounded-lg bg-[#e2b95e] px-5 py-3 font-semibold text-[#2a0f0e]">Submit Feedback</button>
        </form>

        <div className="rounded-2xl border border-white/20 bg-[#3a1615] p-6">
          <h2 className="text-2xl font-semibold text-[#f4cf7a]">Printable QR Menu</h2>
          <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-white/20 bg-[#2a0f0e] p-4">
            <Image src={qrCodeUrl} alt="QR code for menu" width={220} height={220} unoptimized />
            <div className="flex flex-wrap justify-center gap-3">
              <a href={qrCodeUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#e2b95e] px-4 py-2">Download QR</a>
              <button onClick={printQr} className="rounded-lg border border-white/30 px-4 py-2">Print QR</button>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/80">Scan to open live menu quickly.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl rounded-2xl border border-[#e2b95e]/40 bg-[#381614] px-4 py-8">
        <h2 className="text-2xl font-semibold text-[#f4cf7a]">Contact & Hours</h2>
        <p className="mt-3 text-white/90">H. No: 5-11-245, 2nd Floor KSR Plaza, Above Arvind Store, Kishanapura, Naimnagar, Hanamkonda, Warangal-506001, Telangana</p>
        <p className="mt-2 text-white/90">Phone / WhatsApp: 8121213533</p>
        <p className="mt-2 text-white/90">Instagram: @Majestyhanamkonda</p>
        <p className="mt-2 text-white/90">Monday – Friday: 12:00 PM – 11:00 PM</p>
        <p className="text-white/90">Saturday – Sunday: 11:00 AM – 11:30 PM</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold text-[#f4cf7a]">Google Maps</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/20">
          <iframe
            title="Majesty Mandi House Location"
            src="https://maps.google.com/maps?q=Kishanapura,%20Naimnagar,%20Hanamkonda,%20Warangal-506001,%20Telangana&z=15&output=embed"
            width="100%"
            height="360"
            loading="lazy"
            className="w-full"
          />
        </div>
      </section>

      <footer className="border-t border-[#5f2d20] bg-[#1f0a09] px-4 py-10 text-sm text-white/85">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-base font-semibold text-[#f4cf7a]">Quick Links</h3>
            <div className="mt-2 space-y-1">
              <a href="#menu" className="block">Menu</a>
              <a href="#" className="block">Reserve Table</a>
              <Link href="/admin" className="block">Festival Greetings Admin</Link>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f4cf7a]">Social</h3>
            <p className="mt-2">Instagram: @Majestyhanamkonda</p>
            <p>WhatsApp: 8121213533</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f4cf7a]">Contact</h3>
            <p className="mt-2">Hanamkonda, Warangal-506001, Telangana</p>
            <p>© {new Date().getFullYear()} Majesty Mandi House. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
