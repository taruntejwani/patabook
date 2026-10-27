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
  updated: '26 October 2026',

  /* AI Poster: 'PataBook AI' Worker का पता (जैसे 'https://patabook-ai.XXXX.workers.dev'). खाली रहे तो AI बटन नहीं दिखेगा। */
  aiUrl: 'https://patabook-ai.tejwani512.workers.dev',
  /* 🤖 "AI से जोड़ें" (दुकान जोड़ते समय): patabook-ai Worker में /extract डालकर Deploy करने के बाद ही true करें। */
  aiExtract: true,

  /* Mobile OTP Worker (Fast2SMS). STAGING: नीचे staging Worker का पता है।
     Production में यह पता तभी बदलें जब staging के सारे tests पास हों। खाली रहे तो Mobile OTP बटन नहीं दिखेगा। */
  otpUrl: 'https://patabook-admin-otp-staging.tejwani512.workers.dev',

  /* "मैं रोबोट नहीं हूँ" जाँच (Cloudflare Turnstile) की Site Key — यह public होती है। Secret Key सिर्फ Worker में। */
  turnstileKey: '0x4AAAAAAFh2ET1CgatdIOGP',

  /* 💼 ₹499 Vacancy plan: अभी बंद (24 Oct 2026 — Play Store billing नियम की वजह से)। false रहने तक vacancy.html / jobs.html नहीं खुलते।
     मुफ़्त "Vacancy available" स्विच (मेरी दुकान) इससे अलग है और चालू रहता है। */
  jobs: false,

  /* 💎 Premium (sql-23): Admin से दिया जाता है (मुफ़्त / नकद)। true = Premium दुकानें ऊपर, निशान, gallery, 30 दिन रिपोर्ट, Vacancy डालना।
     premiumReq: दुकानदार "मेरी दुकान" से Premium की request भेज सके — Google Play पेमेंट चालू होने तक false रखें। */
  premium: true,
  /* 💳 Google Play से Member plan खरीदना: 'patabook-pay' Worker का पता (जैसे 'https://patabook-pay.XXXX.workers.dev').
     खाली रहे तो खरीदने का बटन नहीं दिखता। Worker में Google key + Supabase service_role secret डालने और Play Console में products बनाने के बाद ही भरें। */
  payUrl: '',
  /* 🏪 दुकान Verification (sql-32): वही 'patabook-pay' Worker (/verify-shop)। खाली = My Shop में verify वाला box नहीं और plan पर रोक नहीं।
     sql-32 चलाने + Worker का नया code deploy + GEMINI_API_KEY secret डालने के बाद भरें। */
  verifyUrl: 'https://patabook-pay.tejwani512.workers.dev',
  premiumReq: false

};
