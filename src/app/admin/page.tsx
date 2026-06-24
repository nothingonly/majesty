'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Lead = {
  name: string;
  mobile: string;
  createdAt: string;
};

const LEADS_KEY = 'majesty_leads';
const templates = ['Ramadan Mubarak', 'Eid Wishes', 'Sankranti Wishes', 'Diwali Wishes'];

const sanitizePhone = (value: string) => value.replace(/\D/g, '');

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LEADS_KEY) ?? '[]') as Lead[];
    setLeads(saved);
  }, []);

  const greetingText = useMemo(
    () => customMessage.trim() || `${selectedTemplate}! Warm greetings from Majesty Mandi House.`,
    [customMessage, selectedTemplate],
  );

  return (
    <main className="min-h-screen bg-[#2a0f0e] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-[#f4cf7a]">← Back to Website</Link>
        <h1 className="mt-4 text-3xl font-bold text-[#f4cf7a]">Festival WhatsApp Greeting System</h1>
        <p className="mt-2 text-white/80">View saved leads and generate WhatsApp festival greetings instantly.</p>

        <section className="mt-8 rounded-2xl border border-[#e2b95e]/40 bg-[#381614] p-6">
          <h2 className="text-xl font-semibold">Greeting Builder</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="rounded-lg border border-white/20 bg-[#2a0f0e] p-3">
              {templates.map((template) => (
                <option key={template} value={template}>{template}</option>
              ))}
            </select>
            <input
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="rounded-lg border border-white/20 bg-[#2a0f0e] p-3"
              placeholder="Optional custom greeting"
            />
          </div>
          <p className="mt-3 rounded-lg border border-white/20 bg-[#2a0f0e] p-3 text-sm text-[#f7deb0]">Preview: {greetingText}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e2b95e]/40 bg-[#381614] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Saved Leads ({leads.length})</h2>
          </div>

          <div className="mt-4 grid gap-4">
            {leads.length === 0 && (
              <p className="rounded-lg border border-white/20 bg-[#2a0f0e] p-4 text-white/80">No leads saved yet. Leads from popup will appear here.</p>
            )}

            {leads.map((lead) => {
              const phone = sanitizePhone(lead.mobile);
              const message = encodeURIComponent(`Dear ${lead.name}, ${greetingText}`);
              const link = `https://wa.me/91${phone}?text=${message}`;

              return (
                <article key={`${lead.mobile}-${lead.createdAt}`} className="rounded-xl border border-white/20 bg-[#2a0f0e] p-4 md:flex md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <p className="text-sm text-white/80">{lead.mobile}</p>
                    <p className="text-xs text-white/60">{new Date(lead.createdAt).toLocaleString()}</p>
                  </div>
                  <a href={link} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-lg bg-[#e2b95e] px-4 py-2 font-semibold text-[#2a0f0e] md:mt-0">
                    Send WhatsApp Greeting
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
