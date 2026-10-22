/* PataBook — एक ही जगह की सेटिंग।
   नीचे की खाली जगहें भरें। जो खाली रहेगा वह पेज पर "जल्द जोड़ा जाएगा" दिखेगा — कोई नकली जानकारी नहीं दिखाई जाती।
   यहाँ कभी कोई Secret / service_role key न डालें (यह फाइल सबको दिखती है)। */
window.PB_SITE = {
  /* संपर्क (Contact Us, Privacy, Terms में दिखेगा) */
  owner: '',            // मालिक / कंपनी का नाम, जैसे 'XYZ Enterprises'
  email: '',            // संपर्क email
  phone: '',            // संपर्क मोबाइल (10 अंक)
  address: '',          // पूरा पता
  grievanceName: '',    // शिकायत अधिकारी (Grievance Officer) का नाम
  grievanceEmail: '',   // शिकायत अधिकारी का email (खाली हो तो ऊपर वाला email)
  city: 'Gandhidham, Kutch, Gujarat',
  updated: '13 October 2026',

  /* AI Poster: 'PataBook AI' Worker का पता (जैसे 'https://patabook-ai.XXXX.workers.dev'). खाली रहे तो AI बटन नहीं दिखेगा। */
  aiUrl: 'https://patabook-ai.tejwani512.workers.dev',

  /* Mobile OTP Worker (Fast2SMS). STAGING: नीचे staging Worker का पता है।
     Production में यह पता तभी बदलें जब staging के सारे tests पास हों। खाली रहे तो Mobile OTP बटन नहीं दिखेगा। */
  otpUrl: 'https://patabook-admin-otp-staging.tejwani512.workers.dev'

};
