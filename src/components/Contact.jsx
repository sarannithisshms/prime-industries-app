import React, { useState } from 'react';

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5c0 8.28 6.72 15 15 15l3-4-6-3-2 2a12 12 0 01-6-6l2-2-3-6z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'Fabrication quote', message: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Tell us a little about the enquiry';
    return e;
  }

  // function handleSubmit(ev) {
  //   ev.preventDefault();
  //   const e = validate();
  //   setErrors(e);
  //   if (Object.keys(e).length > 0) return;
  //   // No backend is wired up here — replace this with a real API/email call.
  //   setStatus('sent');
  // }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
  
    // 1. Replace with your company's actual receiving email address
    const recipientEmail = 'primefabindustries@gmail.com'; 
  
    // 2. Define the email subject line
    const subject = encodeURIComponent(`New Enquiry from ${form.name}`);
  
    // 3. Construct the email body text
    const bodyText = 
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone || 'N/A'}\n\n` +
      `Message:\n${form.message}`;
  
    const body = encodeURIComponent(bodyText);
  
    // 4. Trigger the user's default email application
    window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, '_blank');
    // 5. Update UI state to display the success message
    setStatus('sent');
  }

  return (
    <section id="contact" className="border-t border-[var(--line)] bg-[var(--bg-panel)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="font-mono-data text-xs tracking-widest text-[var(--accent)] mb-3">GET IN TOUCH</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1] mb-6">Request a fabrication quote.</h2>
          <p className="text-[var(--text-dim)] mb-8 max-w-md">
            Send drawings, spec sheets or a part list — or just tell us what you're trying to source. A member of the
            team will follow up with lead time and pricing.
          </p>

          {status === 'sent' ? (
            <div className="border border-[var(--accent)] bg-[rgba(249,115,22,0.08)] rounded-sm p-5">
              <p className="font-display font-semibold text-lg mb-1">Enquiry received</p>
              <p className="text-sm text-[var(--text-dim)]">
                Thanks, {form.name.split(' ')[0] || 'there'} — we'll be in touch shortly at {form.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-dim)] block mb-1.5" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="field-input w-full rounded-sm px-3 py-2.5 text-sm"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-xs text-[var(--accent)] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs text-[var(--text-dim)] block mb-1.5" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="field-input w-full rounded-sm px-3 py-2.5 text-sm"
                    placeholder="Phone number "
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-dim)] block mb-1.5" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="field-input w-full rounded-sm px-3 py-2.5 text-sm"
                  placeholder="you@company.com"
                />
                {errors.email && <p className="text-xs text-[var(--accent)] mt-1">{errors.email}</p>}
              </div>
              {/* <div>
                <label className="text-xs text-[var(--text-dim)] block mb-1.5" htmlFor="type">
                  Enquiry type
                </label>
                <select id="type" value={form.type} onChange={(e) => update('type', e.target.value)} className="field-input w-full rounded-sm px-3 py-2.5 text-sm">
                  <option>Fabrication quote</option>
                  <option>CNC spare parts</option>
                  <option>Laser equipment</option>
                  <option>General enquiry</option>
                </select>
              </div> */}
              <div>
                <label className="text-xs text-[var(--text-dim)] block mb-1.5" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows="4"
                  className="field-input w-full rounded-sm px-3 py-2.5 text-sm resize-none"
                  placeholder="Part details, quantities, drawings you can share, timeline…"
                />
                {errors.message && <p className="text-xs text-[var(--accent)] mt-1">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary px-6 py-3 rounded-sm text-sm w-full sm:w-auto">
                Send enquiry
              </button>
            </form>
          )}
        </div>

        <div className="lg:pl-8 lg:border-l lg:border-[var(--line)]">
          <h3 className="font-display font-semibold text-xl mb-5">Workshop details</h3>
          <ul className="space-y-5 text-sm">
            <li className="flex gap-3 text-[var(--text-dim)]">
              <span className="text-[var(--accent)] mt-0.5">
                <IconPin />
              </span>
              <span>
                SF No 4/195D,Kasigoundenpudur Road Sulur,Annanagar Kalagal
                <br />
                Coimbatore – 641402, Tamilnadu
              </span>
            </li>
            <li className="flex gap-3 text-[var(--text-dim)]">
              <span className="text-[var(--accent)] mt-0.5">
                <IconPhone />
              </span>
              <span>+91 990409 17376</span>
            </li>
            <li className="flex gap-3 text-[var(--text-dim)]">
              <span className="text-[var(--accent)] mt-0.5">
                <IconMail />
              </span>
              <span>primefabindustries@gmail.com</span>
            </li>
            <li className="flex gap-3 text-[var(--text-dim)]">
              <span className="text-[var(--accent)] mt-0.5">
                <IconClock />
              </span>
              <span>Mon – Sat, 9:00 AM – 6:00 PM</span>
            </li>
          </ul>
          {/* <p className="text-xs text-[var(--text-dim)] mt-8 font-mono-data">
            NOTE: address, phone and email above are placeholders — swap in the real details.
          </p> */}
        </div>
      </div>
    </section>
  );
}
