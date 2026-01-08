const mk = (title, lead, subtitle, benefits, features, kpis) => ({ title, lead, subtitle, benefits, features, kpis })

export const industryContent = {
  restaurants: mk(
    'Restaurants',
    'Turn WhatsApp into your fastest ordering channel.',
    'Collect orders, manage menus, and confirm pickups or deliveries without phone chaos.',
    ['Reduce phone time and missed orders', 'Promote daily specials in minutes', 'Centralize order tracking and confirmations'],
    [{ title: 'Menu builder', description: 'Create and update menus with variants and add-ons.', icon: 'restaurant' }, { title: 'Order intake', description: 'Structured WhatsApp flow for items, quantity, and timing.', icon: 'chat' }, { title: 'Kitchen queue', description: 'Status updates from received to ready.', icon: 'schedule' }, { title: 'Delivery slots', description: 'Offer pickup windows and delivery zones.', icon: 'local_shipping' }],
    [{ label: 'Avg. response time', value: '-40%' }, { label: 'Repeat customers', value: '+25%' }, { label: 'Order errors', value: '-30%' }]
  ),
  cafes: mk(
    'Cafes',
    'Capture pre-orders and subscriptions over WhatsApp.',
    'Let regulars pre-order coffee and pastries, and manage weekly subscriptions.',
    ['Faster morning throughput', 'No lines for loyal customers', 'Simple subscription management'],
    [{ title: 'Pre-order links', description: 'Share one-tap pre-order links on status or Instagram.' }, { title: 'Subscriptions', description: 'Weekly bundles with pause and resume options.' }, { title: 'Pickup queue', description: 'Automated ready notifications.' }],
    [{ label: 'Wait time', value: '-35%' }, { label: 'Subscription uptake', value: '+18%' }, { label: 'NPS', value: '74' }]
  ),
  'home-based-food-business': mk(
    'Home-Based Food Business',
    'Sell batches and custom plates without a website.',
    'Simple WhatsApp-first storefront with order slots, deposits, and delivery coordination.',
    ['Launch in a day', 'No coding or hosting', 'Automate order coordination'],
    [{ title: 'Batch scheduling', description: 'Open and close order windows per batch.' }, { title: 'Deposits', description: 'Collect deposits for custom orders.' }, { title: 'Delivery coordination', description: 'Auto-send address and timing confirmations.' }],
    [{ label: 'Time to launch', value: '<24h' }, { label: 'Cancelations', value: '-22%' }, { label: 'Return rate', value: '+19%' }]
  ),
  'bakery-pastry': mk(
    'Bakery & Pastry',
    'Showcase seasonal items and take pre-orders.',
    'Manage pre-orders for cakes and pastries with customization and pickup scheduling.',
    ['Fewer back-and-forth messages', 'Streamlined customization', 'Clear pickup scheduling'],
    [{ title: 'Customization', description: 'Collect flavors, messages, sizes with validations.' }, { title: 'Pre-order calendar', description: 'Disable dates when capacity is full.' }, { title: 'Production notes', description: 'Relay confirmed specs to kitchen as tasks.' }],
    [{ label: 'Custom order time', value: '-28%' }, { label: 'On-time pickups', value: '+32%' }, { label: 'Upsells', value: '+15%' }]
  ),
  'catering-meal-subscription': mk(
    'Catering & Meal Subscription',
    'Automate recurring meal plans on WhatsApp.',
    'Simplify meal plan selection, delivery schedules, and payment reminders.',
    ['Reduce manual planning', 'Increase retention', 'Predictable operations'],
    [{ title: 'Plan selection', description: 'Weekly and monthly plans with dietary tags.' }, { title: 'Delivery schedule', description: 'Automated route and timing confirmations.' }, { title: 'Payment reminders', description: 'Smart nudges to keep plans active.' }],
    [{ label: 'Churn', value: '-17%' }, { label: 'Active plans', value: '+21%' }, { label: 'Ops time', value: '-35%' }]
  ),
  'hotel-bars-restaurants': mk(
    'Hotel Bars & Restaurants',
    'Consolidate outlet menus and guest messaging.',
    'A unified WhatsApp ordering experience across outlets, room-service, and events.',
    ['Unified branding', 'Centralized operations', 'Better guest experience'],
    [{ title: 'Multi-outlet menus', description: 'Switchable catalogs per outlet.' }, { title: 'Room-service flow', description: 'Capture room, timing, and payment method.' }, { title: 'Event preorders', description: 'QR-based ordering for events and banquets.' }],
    [{ label: 'Guest satisfaction', value: '+22%' }, { label: 'Order routing errors', value: '-40%' }, { label: 'Menu updates', value: 'Real-time' }]
  ),
  'grocer-butcher': mk(
    'Grocer & Butcher',
    'Accept mixed baskets with substitutes and weights.',
    'WhatsApp baskets with planned substitutes and weight-based pricing.',
    ['Reduce manual item matching', 'Transparent pricing', 'Fewer order edits'],
    [{ title: 'Substitutes', description: 'Set approved substitutes to reduce delays.' }, { title: 'Weight pricing', description: 'Capture weights and auto-calc totals.' }, { title: 'Delivery coordination', description: 'Driver handoff with address pin collection.' }],
    [{ label: 'Basket fill rate', value: '+16%' }, { label: 'Edit messages', value: '-27%' }, { label: 'Delivery accuracy', value: '+18%' }]
  ),
  'b2b-wholesale': mk(
    'B2B and Wholesale',
    'Streamline repeat orders and invoicing in WhatsApp.',
    'Contract pricing, order templates, and invoicing nudges for B2B buyers.',
    ['Fewer manual quotes', 'Faster reorders', 'Better cash collection'],
    [{ title: 'Buyer templates', description: 'Save buyer-specific order templates.' }, { title: 'Tiered pricing', description: 'Assign contract pricing per buyer.' }, { title: 'Invoice links', description: 'Send invoice links and reminders.' }],
    [{ label: 'Reorder time', value: '-42%' }, { label: 'Payments on time', value: '+24%' }, { label: 'Manual quoting', value: '-33%' }]
  ),

  ecommerce: mk(
    'Ecommerce', 'Convert chat into checkout.', 'Offer WhatsApp-first checkout that removes friction.',
    ['Increase conversion', 'Lower acquisition cost', 'Less cart abandonment'],
    [{ title: 'Chat-to-cart', description: 'Turn product chats into structured carts.' }, { title: 'Order tracking', description: 'Share tracking with smart status updates.' }, { title: 'Broadcast offers', description: 'Push segmented offers via WhatsApp.' }],
    [{ label: 'Conversion rate', value: '+12%' }, { label: 'CAC', value: '-10%' }, { label: 'Abandonment', value: '-18%' }]
  ),
  'fashion-apparel': mk(
    'Fashion & Apparel', 'Sell collections via chat commerce.', 'Size guides, lookbooks, and quick preorders.',
    ['Reduce sizing returns', 'Launch drops faster', 'Better chat conversions'],
    [{ title: 'Size guide', description: 'Collect sizing preferences upfront.' }, { title: 'Lookbook', description: 'Curate drops and share catalog links.' }, { title: 'Reserve and pay', description: 'Hold items for limited-time purchase.' }],
    [{ label: 'Return rate', value: '-15%' }, { label: 'Drop sell-through', value: '+20%' }, { label: 'Time to launch', value: '-30%' }]
  ),
  'pharmacies-health': mk(
    'Pharmacies & Health', 'Handle prescriptions and follow-ups securely.', 'WhatsApp intake with validation and reminders.',
    ['Reduce counter crowding', 'Better adherence', 'Private communication'],
    [{ title: 'Prescription intake', description: 'Secure doc upload and validations.' }, { title: 'Reminders', description: 'Refill and dosage reminders.' }, { title: 'Delivery slots', description: 'Offer pickup or delivery windows.' }],
    [{ label: 'Refill adherence', value: '+23%' }, { label: 'Queue time', value: '-35%' }, { label: 'Errors', value: '-28%' }]
  ),
  'mobile-electronics': mk(
    'Mobile Phone & Electronics', 'Convert inquiries into orders.', 'Catalog with warranty and delivery options.',
    ['Reduce price-only chats', 'Upsell accessories', 'Track deliveries'],
    [{ title: 'Bundles', description: 'Phone + accessories with upsell prompts.' }, { title: 'Warranty info', description: 'Attach terms and registration.' }, { title: 'Delivery tracking', description: 'Status updates for courier handoff.' }],
    [{ label: 'Accessory attach', value: '+28%' }, { label: 'Returns', value: '-12%' }, { label: 'Delivery SLA', value: '+18%' }]
  ),
  'digital-products-services': mk(
    'Digital Products & Services', 'Sell downloads and sessions via WhatsApp.', 'Automated delivery of licenses and attachments.',
    ['Instant fulfillment', 'Lower support load', 'More renewals'],
    [{ title: 'License delivery', description: 'Send keys and receipts automatically.' }, { title: 'Session booking', description: 'Time slots for consultations.' }, { title: 'Follow-up flows', description: 'Automated post-purchase guidance.' }],
    [{ label: 'Time to fulfill', value: 'Instant' }, { label: 'Renewals', value: '+19%' }, { label: 'Support tickets', value: '-25%' }]
  ),
  'popup-event-store': mk(
    'Popup and Event Store', 'Sell at events using chat links.', 'QR links to WhatsApp ordering with pickup points.',
    ['Fast event setup', 'No POS required', 'Easy stock updates'],
    [{ title: 'QR ordering', description: 'One QR per stall or product.' }, { title: 'Pickup points', description: 'Assign pickup locations and times.' }, { title: 'Stock counters', description: 'Auto-hide sold-out items.' }],
    [{ label: 'Setup time', value: '<1h' }, { label: 'Queue length', value: '-40%' }, { label: 'Sell-out control', value: '+30%' }]
  ),
  'personal-shopping': mk(
    'Personal Shopping', 'Run concierge sales in WhatsApp.', 'Curate lists and close orders with payment links.',
    ['High-touch experience', 'Track items and status', 'Better client retention'],
    [{ title: 'Curated lists', description: 'Share personalized collections.' }, { title: 'Hold & confirm', description: 'Reserve items with expiration.' }, { title: 'Invoice links', description: 'Send payment links and receipts.' }],
    [{ label: 'Close rate', value: '+22%' }, { label: 'Client retention', value: '+18%' }, { label: 'Manual tracking', value: '-35%' }]
  ),
  'jewelry-accessories': mk(
    'Jewelry & Accessories', 'Sell high-consideration items via chat.', 'Authenticity info, appointments, and secure invoicing.',
    ['Increase trust', 'Book showroom visits', 'Streamline invoicing'],
    [{ title: 'Certificates', description: 'Attach certificates and photos.' }, { title: 'Appointments', description: 'Book visits from WhatsApp.' }, { title: 'Secure invoicing', description: 'Send invoices with payment options.' }],
    [{ label: 'Appointment show-up', value: '+16%' }, { label: 'Close rate', value: '+14%' }, { label: 'Returns', value: '-10%' }]
  ),
  'religious-community': mk(
    'Religious & Community', 'Coordinate donations and events.', 'Share announcements and collect RSVPs and donations.',
    ['Better event attendance', 'Transparent funds', 'Community engagement'],
    [{ title: 'Announcements', description: 'Broadcast messages to segments.' }, { title: 'RSVPs', description: 'Collect attendance and reminders.' }, { title: 'Donation tracking', description: 'Track donations and send receipts.' }],
    [{ label: 'Event attendance', value: '+20%' }, { label: 'Donation volume', value: '+15%' }, { label: 'Admin time', value: '-25%' }]
  ),

  salon: mk('Salon', 'Fill appointments and sell care kits.', 'WhatsApp booking with service menus and reminders.', ['Reduce no-shows', 'Upsell kits', 'Automate reminders'], [{ title: 'Service menu', description: 'Prices and durations.' }, { title: 'Booking flow', description: 'Pick stylist and time.' }, { title: 'Reminders', description: 'Auto reminders and follow-ups.' }], [{ label: 'No-shows', value: '-32%' }, { label: 'Add-on sales', value: '+21%' }, { label: 'Rebooking', value: '+18%' }]),
  laundry: mk('Laundry', 'Automate pickup and delivery.', 'Order flow with pickup address, timing, and item notes.', ['Reduce manual coordination', 'Track orders', 'Improve SLA'], [{ title: 'Pickup scheduling', description: 'Address pin and timing.' }, { title: 'Item notes', description: 'Special care and quantities.' }, { title: 'Driver handoff', description: 'Status updates to customer.' }], [{ label: 'Pickup accuracy', value: '+24%' }, { label: 'Ops time', value: '-30%' }, { label: 'Repeat rate', value: '+17%' }]),
  'professional-services': mk('Professional Services', 'Capture leads and bookings.', 'Intake forms and scheduling with invoice links.', ['Faster qualification', 'Less back-and-forth', 'More bookings'], [{ title: 'Lead intake', description: 'Structured questions and attachments.' }, { title: 'Scheduling', description: 'Slots and reminders.' }, { title: 'Invoice links', description: 'Send invoices through WhatsApp.' }], [{ label: 'Lead to booking', value: '+19%' }, { label: 'Admin time', value: '-25%' }, { label: 'Payment on time', value: '+16%' }]),
  'pets-grooming': mk('Pets & Grooming', 'Book grooming and sell care plans.', 'Service selection with pet details and reminders.', ['Better scheduling', 'Reduce missed info', 'Increase plan renewals'], [{ title: 'Pet profiles', description: 'Breed, age, and notes.' }, { title: 'Grooming packages', description: 'Select package and extras.' }, { title: 'Reminders', description: 'Vaccination and plan renewals.' }], [{ label: 'Booking accuracy', value: '+22%' }, { label: 'Plan renewals', value: '+14%' }, { label: 'Wait time', value: '-28%' }]),
  'hotel-booking': mk('Hotel Booking', 'Convert inquiries into bookings.', 'WhatsApp quotes, room selection, and confirmations.', ['Faster quoting', 'Fewer drop-offs', 'Better guest comms'], [{ title: 'Room selection', description: 'Availability and rates.' }, { title: 'Quote flow', description: 'Auto-build quotes with options.' }, { title: 'Confirmation', description: 'Secure confirmation and reminders.' }], [{ label: 'Quote speed', value: '+35%' }, { label: 'Booking conversion', value: '+12%' }, { label: 'Guest satisfaction', value: '+18%' }]),
  education: mk('Education', 'Simplify admissions and payments.', 'Intake forms and reminders for fees and events.', ['Lower admin load', 'Better parent comms', 'Higher attendance'], [{ title: 'Admissions flow', description: 'Collect student data and docs.' }, { title: 'Fee reminders', description: 'Automated fee notifications.' }, { title: 'Event RSVPs', description: 'Share calendars and collect RSVPs.' }], [{ label: 'Admin time', value: '-30%' }, { label: 'Fee collection', value: '+16%' }, { label: 'Event attendance', value: '+14%' }]),
  'printing-services': mk('Printing Services', 'Quote and track print jobs.', 'WhatsApp intake for specs and file upload.', ['Fewer bad specs', 'Faster quotes', 'Tracked deliveries'], [{ title: 'Spec intake', description: 'Paper, size, finish, quantity.' }, { title: 'File upload', description: 'Secure file upload and checks.' }, { title: 'Delivery updates', description: 'Handoff to courier with status.' }], [{ label: 'Quote time', value: '-40%' }, { label: 'Revisions', value: '-22%' }, { label: 'On-time delivery', value: '+19%' }]),
  rental: mk('Rental', 'Automate inquiries and bookings.', 'Inventory calendar and WhatsApp confirmations.', ['Reduce manual checks', 'Avoid double bookings', 'Faster approvals'], [{ title: 'Inventory calendar', description: 'Availability and pricing.' }, { title: 'Deposit flow', description: 'Collect deposits and agreements.' }, { title: 'Reminders', description: 'Pickup/return reminders.' }], [{ label: 'Double bookings', value: '-28%' }, { label: 'Approval speed', value: '+26%' }, { label: 'Return on time', value: '+18%' }]),
  'tour-travel-services': mk('Tour & Travel Services', 'Convert chat into itineraries.', 'Package selection and booking via WhatsApp.', ['Fewer drop-offs', 'Better upsells', 'Simplified comms'], [{ title: 'Package selection', description: 'Filter by dates and budget.' }, { title: 'Itinerary builder', description: 'Share itineraries and revisions.' }, { title: 'Booking confirmations', description: 'Confirm and send vouchers.' }], [{ label: 'Upsell rate', value: '+20%' }, { label: 'Time to book', value: '-32%' }, { label: 'CSAT', value: '4.6/5' }]),
  ticketing: mk('Ticketing', 'Sell tickets via chat links.', 'WhatsApp links and QR codes for entry.', ['Fast setup', 'Track attendance', 'Reduce fraud'], [{ title: 'Ticket links', description: 'One link per event.' }, { title: 'QR codes', description: 'Generate QR for check-in.' }, { title: 'Attendance dashboard', description: 'Live check-in stats.' }], [{ label: 'Setup time', value: '<1h' }, { label: 'Check-in speed', value: '+35%' }, { label: 'Fraud', value: '-30%' }])
}

export function getIndustryContent(slug) {
  return industryContent[slug] || null
}
