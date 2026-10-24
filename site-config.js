/* PataBook — एक ही जगह की सेटिंग।
   नीचे की खाली जगहें भरें। जो खाली रहेगा वह पेज पर "जल्द जोड़ा जाएगा" दिखेगा — कोई नकली जानकारी नहीं दिखाई जाती।
   यहाँ कभी कोई Secret / service_role key न डालें (यह फाइल सबको दिखती है)। */
window.PB_SITE = {
  /* संपर्क (Contact Us, Privacy, Terms में दिखेगा) */
  owner: 'Tarun Tejwani',            // मालिक / कंपनी का नाम, जैसे 'XYZ Enterprises'
  email: 'patabook.in@gmail.com',            // संपर्क email
  phone: '',            // संपर्क मोबाइल (10 अंक)
  address: 'Apnanagar, Gandhidham, Kutch, Gujarat – 370201',          // पूरा पता
  grievanceName: 'Tarun Tejwani',    // शिकायत अधिकारी (Grievance Officer) का नाम
  grievanceEmail: 'patabook.in@gmail.com',   // शिकायत अधिकारी का email (खाली हो तो ऊपर वाला email)
  city: 'Gandhidham, Kutch, Gujarat',
  updated: '24 October 2026',

  /* AI Poster: 'PataBook AI' Worker का पता (जैसे 'https://patabook-ai.XXXX.workers.dev'). खाली रहे तो AI बटन नहीं दिखेगा। */
  aiUrl: 'https://patabook-ai.tejwani512.workers.dev',

  /* Mobile OTP Worker (Fast2SMS). STAGING: नीचे staging Worker का पता है।
     Production में यह पता तभी बदलें जब staging के सारे tests पास हों। खाली रहे तो Mobile OTP बटन नहीं दिखेगा। */
  otpUrl: 'https://patabook-admin-otp-staging.tejwani512.workers.dev',

  /* "मैं रोबोट नहीं हूँ" जाँच (Cloudflare Turnstile) की Site Key — यह public होती है। Secret Key सिर्फ Worker में। */
  turnstileKey: '0x4AAAAAAFh2ET1CgatdIOGP',

  /* 💼 ₹499 Vacancy plan: अभी बंद (24 Oct 2026 — Play Store billing नियम की वजह से)। false रहने तक vacancy.html / jobs.html नहीं खुलते।
     मुफ़्त "Vacancy available" स्विच (मेरी दुकान) इससे अलग है और चालू रहता है। */
  jobs: false

};
