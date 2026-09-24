import { SupportedLanguage } from '../types/meteo';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  views: {
    precipitationMap: string;
    regimeIntelligence: string;
    districtRisk: string;
    skillVerification: string;
  };
  liveBadge: string;
  nwpCycle: string;
  nextRun: string;
  leadTimes: {
    t0: string;
    t24: string;
    t48: string;
    t72: string;
    t96: string;
    t120: string;
  };
  regimes: {
    active_monsoon: string;
    break_monsoon: string;
    monsoon_depression: string;
    orographic_surge: string;
    western_disturbance: string;
  };
  riskTiers: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
  };
  riskTierDesc: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
  };
  mapControls: {
    layerSplit: string;
    rawNwp: string;
    aiCorrected: string;
    difference: string;
    windVectors: string;
    zoomIn: string;
    zoomOut: string;
    resetView: string;
    play: string;
    pause: string;
    sliderHint: string;
  };
  districtModal: {
    forecastSummary: string;
    rawVsCorrected: string;
    divergenceDelta: string;
    extremeProbabilities: string;
    heavy: string;
    veryHeavy: string;
    extremelyHeavy: string;
    downloadBulletin: string;
    synopticContext: string;
    close: string;
  };
  whatIfModal: {
    title: string;
    subtitle: string;
    shear850: string;
    troughLat: string;
    mslpGrad: string;
    vortexIndex: string;
    simulateBreak: string;
    simulateDepression: string;
    simulateSurge: string;
    resetOperational: string;
    detectedRegime: string;
  };
  verification: {
    title: string;
    subtitle: string;
    rmse: string;
    mae: string;
    csi: string;
    far: string;
    reliability: string;
    contingencyTable: string;
  };
  riskCenter: {
    searchPlaceholder: string;
    allDistricts: string;
    highRiskOnly: string;
    vulnerableZones: string;
    sortRainfall: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appTitle: 'VayuDrishti // National Monsoon Forecast System',
    appSubtitle: 'High-Resolution Calibrated Rainfall Analysis',
    views: {
      precipitationMap: 'Rain Map',
      regimeIntelligence: 'Current Weather Pattern',
      districtRisk: 'District Rain Alerts',
      skillVerification: 'Forecast Accuracy Score',
    },
    liveBadge: 'LIVE WEATHER',
    nwpCycle: 'Weather Model Run: 06:00 UTC',
    nextRun: 'Next Update In',
    leadTimes: {
      t0: 'Now',
      t24: 'Day 1 (+24h)',
      t48: 'Day 2 (+48h)',
      t72: 'Day 3 (+72h)',
      t96: 'Day 4 (+96h)',
      t120: 'Day 5 (+120h)',
    },
    regimes: {
      active_monsoon: 'Heavy Monsoon Rain',
      break_monsoon: 'Rain Break (Dry Spell)',
      monsoon_depression: 'Low Pressure Storm',
      orographic_surge: 'Mountain Rain',
      western_disturbance: 'Northern Hill Showers',
    },
    riskTiers: {
      green: 'Green · Normal',
      yellow: 'Yellow · Be Aware',
      orange: 'Orange · Be Prepared',
      red: 'Red · Danger: Stay Safe',
    },
    riskTierDesc: {
      green: 'Normal weather. No rain disruption expected.',
      yellow: 'Moderate rain showers. Keep an umbrella ready.',
      orange: 'Heavy downpours expected. Low-lying roads may flood.',
      red: 'Dangerous flooding rain. Avoid travel and stay indoors.',
    },
    mapControls: {
      layerSplit: 'Compare Forecasts',
      rawNwp: 'Standard NWP (GFS)',
      aiCorrected: 'Calibrated Forecast',
      difference: 'Calibration Delta',
      windVectors: 'Wind Flow',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      resetView: 'Center map',
      play: 'Play rain forecast',
      pause: 'Pause',
      sliderHint: 'Slide to compare Standard NWP with Terrain-Calibrated Forecast',
    },
    districtModal: {
      forecastSummary: 'District Weather Summary',
      rawVsCorrected: 'Standard NWP vs Calibrated Forecast',
      divergenceDelta: 'Calibration Delta',
      extremeProbabilities: 'Rainfall Hazard Outlook',
      heavy: 'Heavy Rain (>64 mm)',
      veryHeavy: 'Very Heavy Rain (>115 mm)',
      extremelyHeavy: 'Flood Danger (>204 mm)',
      downloadBulletin: 'Emergency Weather Alert',
      synopticContext: 'Meteorological Synopsis',
      close: 'Done',
    },
    whatIfModal: {
      title: 'Weather Simulator',
      subtitle: 'Adjust synoptic parameters to evaluate forecast response',
      shear850: 'Monsoon Wind Strength',
      troughLat: 'Rain Belt Position (North / South)',
      mslpGrad: 'Storm Pressure Drop',
      vortexIndex: 'Coastal Cloud Swirl',
      simulateBreak: 'Try Rain Break',
      simulateDepression: 'Try Low Pressure Storm',
      simulateSurge: 'Try Mountain Rain',
      resetOperational: 'Back to Today’s Weather',
      detectedRegime: 'Current Weather Pattern',
    },
    verification: {
      title: 'Forecast Accuracy Score',
      subtitle: 'Systematic verification against 4,200+ AWS telemetry stations over 5 monsoon cycles',
      rmse: 'Average Forecast Error (lower is better)',
      mae: 'Daily Difference (lower is better)',
      csi: 'Storm Detection Score (higher is better)',
      far: 'False Alarms (lower is better)',
      reliability: 'Forecast Trust Score',
      contingencyTable: 'Rain Category Scores',
    },
    riskCenter: {
      searchPlaceholder: 'Search any district or state...',
      allDistricts: 'All Districts',
      highRiskOnly: 'High Alert Districts Only',
      vulnerableZones: 'Mountain & Coastal Areas',
      sortRainfall: 'Sort by Rain Amount',
    },
  },
  hi: {
    appTitle: 'वायुदृष्टि — स्मार्ट वर्षा पूर्वानुमान',
    appSubtitle: 'भारत के लिए एआई-सुधारित सटीक मानसूनी बारिश पूर्वानुमान',
    views: {
      precipitationMap: 'वर्षा मानचित्र',
      regimeIntelligence: 'आज का मौसम पैटर्न',
      districtRisk: 'जिला वर्षा अलर्ट',
      skillVerification: 'पूर्वानुमान सटीकता स्कोर',
    },
    liveBadge: 'लाइव मौसम',
    nwpCycle: 'मॉडल अपडेट: 06:00 UTC',
    nextRun: 'अगला अपडेट',
    leadTimes: {
      t0: 'अभी (वर्तमान)',
      t24: 'कल (+24घंटे)',
      t48: 'परसों (+48घंटे)',
      t72: '3 दिन बाद (+72घंटे)',
      t96: '4 दिन बाद (+96घंटे)',
      t120: '5 दिन बाद (+120घंटे)',
    },
    regimes: {
      active_monsoon: 'तेज़ मानसूनी बारिश',
      break_monsoon: 'बारिश ब्रेक (सूखा दौर)',
      monsoon_depression: 'कम दबाव का तूफ़ान',
      orographic_surge: 'पहाड़ी बारिश (माउंटेन रेन)',
      western_disturbance: 'उत्तरी पहाड़ी बौछारें',
    },
    riskTiers: {
      green: 'हरा · कोई समस्या नहीं',
      yellow: 'पीला · सतर्क रहें',
      orange: 'नारंगी · तैयार रहें',
      red: 'लाल · ख़तरा: सुरक्षित रहें',
    },
    riskTierDesc: {
      green: 'सामान्य सुहावना मौसम। बारिश से कोई परेशानी नहीं।',
      yellow: 'हल्की से मध्यम बारिश संभव। छाता साथ रखें।',
      orange: 'भारी बारिश की संभावना। सड़कों पर पानी भर सकता है।',
      red: 'अति भारी वर्षा व बाढ़ का ख़तरा। घरों के अंदर रहें।',
    },
    mapControls: {
      layerSplit: 'पूर्वानुमान तुलना',
      rawNwp: 'पुराना मॉडल पूर्वानुमान',
      aiCorrected: 'एआई-सुधारित बारिश',
      difference: 'सुधार अंतर',
      windVectors: 'हवा की दिशा',
      zoomIn: 'ज़ूम इन',
      zoomOut: 'ज़ूम आउट',
      resetView: 'केंद्र में लाएं',
      play: 'मौसम एनिमेट करें',
      pause: 'रोकें',
      sliderHint: 'पुराने मॉडल और एआई सुधार की तुलना के लिए स्लाइडर आगे-पीछे करें',
    },
    districtModal: {
      forecastSummary: 'जिला मौसम सारांश',
      rawVsCorrected: 'पुराना मॉडल बनाम एआई-सुधारित बारिश',
      divergenceDelta: 'बारिश अंतर',
      extremeProbabilities: 'भारी बारिश की संभावना',
      heavy: 'भारी बारिश (>64 मिमी)',
      veryHeavy: 'बहुत भारी बारिश (>115 मिमी)',
      extremelyHeavy: 'अति भारी बारिश / बाढ़ (>204 मिमी)',
      downloadBulletin: 'आपातकालीन मौसम अलर्ट',
      synopticContext: 'यहाँ बारिश क्यों हो रही है?',
      close: 'बंद करें',
    },
    whatIfModal: {
      title: 'मौसम सिम्युलेटर',
      subtitle: 'मौसम की स्थितियां बदलकर देखें आज का पैटर्न कैसे बदलता है',
      shear850: 'मानसूनी हवा की गति',
      troughLat: 'वर्षा पट्टी की स्थिति (उत्तर / दक्षिण)',
      mslpGrad: 'तूफानी हवा का दबाव',
      vortexIndex: 'तटीय बादलों का भंवर',
      simulateBreak: 'बारिश ब्रेक का परीक्षण',
      simulateDepression: 'कम दबाव के तूफान का परीक्षण',
      simulateSurge: 'पहाड़ी बारिश का परीक्षण',
      resetOperational: 'आज के वास्तविक मौसम पर लौटें',
      detectedRegime: 'वर्तमान मौसम पैटर्न',
    },
    verification: {
      title: 'पूर्वानुमान सटीकता स्कोर',
      subtitle: '5 वर्षों में 4,200+ मौसम केंद्रों पर पुराने मॉडल से तुलना',
      rmse: 'औसत त्रुटि (कम बेहतर)',
      mae: 'दैनिक अंतर',
      csi: 'तूफ़ान पकड़ने का स्कोर (अधिक बेहतर)',
      far: 'गलत अलर्ट दर (कम बेहतर)',
      reliability: 'पूर्वानुमान भरोसा स्कोर',
      contingencyTable: 'श्रेणीवार स्कोर',
    },
    riskCenter: {
      searchPlaceholder: 'जिला या राज्य खोजें...',
      allDistricts: 'सभी ज़िले',
      highRiskOnly: 'केवल हाई अलर्ट ज़िले',
      vulnerableZones: 'पहाड़ी व तटीय संवेदनशील क्षेत्र',
      sortRainfall: 'बारिश की मात्रा अनुसार',
    },
  },
  bn: {
    appTitle: 'বায়ুদৃষ্টি — স্মার্ট বৃষ্টির পূর্বাভাস',
    appSubtitle: 'ভারতের জন্য এআই-সংশোধিত নির্ভুল বর্ষার পূর্বাভাস',
    views: {
      precipitationMap: 'বৃষ্টির মানচিত্র',
      regimeIntelligence: 'আজকের আবহাওয়া প্যাটার্ন',
      districtRisk: 'জেলা বৃষ্টি সতর্কতা',
      skillVerification: 'পূর্বাভাস নির্ভুলতা স্কোর',
    },
    liveBadge: 'লাইভ আবহাওয়া',
    nwpCycle: 'মডেল আপডেট: 06:00 UTC',
    nextRun: 'পরবর্তী আপডেট',
    leadTimes: {
      t0: 'এখন (বর্তমান)',
      t24: 'আগামীকাল (+24ঘণ্টা)',
      t48: 'পরশু (+48ঘণ্টা)',
      t72: '৩ দিন পর (+72ঘণ্টা)',
      t96: '৪ দিন পর (+96ঘণ্টা)',
      t120: '৫ দিন পর (+120ঘণ্টা)',
    },
    regimes: {
      active_monsoon: 'ভারী বর্ষা বৃষ্টি',
      break_monsoon: 'বৃষ্টির বিরতি (শুষ্ক দিন)',
      monsoon_depression: 'নিম্নচাপ ঝড়',
      orographic_surge: 'পাহাড়ি বৃষ্টি',
      western_disturbance: 'উত্তরের পাহাড়ি বৃষ্টি',
    },
    riskTiers: {
      green: 'সবুজ · কোনো সমস্যা নেই',
      yellow: 'হলুদ · সতর্ক থাকুন',
      orange: 'কমলা · প্রস্তুত থাকুন',
      red: 'লাল · বিপদ: নিরাপদ থাকুন',
    },
    riskTierDesc: {
      green: 'স্বাভাবিক আবহাওয়া। বৃষ্টির কোনো সমস্যা নেই।',
      yellow: 'মাঝারি বৃষ্টি হতে পারে। ছাতা সাথে রাখুন।',
      orange: 'ভারী বৃষ্টির সম্ভাবনা। রাস্তায় জল জমতে পারে।',
      red: 'বিপজ্জনক অতি ভারী বৃষ্টি। বাড়িতে সুরক্ষিত থাকুন।',
    },
    mapControls: {
      layerSplit: 'পূর্বাভাস তুলনা',
      rawNwp: 'পুরোনো মডেল পূর্বাভাস',
      aiCorrected: 'এআই-সংশোধিত বৃষ্টি',
      difference: 'বৃষ্টির পার্থক্য',
      windVectors: 'বাতাসের দিক',
      zoomIn: 'জুম ইন',
      zoomOut: 'জুম আউট',
      resetView: 'মাঝখানে আনুন',
      play: 'অ্যানিমেশন চালু করুন',
      pause: 'থামান',
      sliderHint: 'পুরোনো মডেল ও এআই সংশোধনের তুলনা করতে স্লাইডার সরান',
    },
    districtModal: {
      forecastSummary: 'জেলার আবহাওয়া সারাংশ',
      rawVsCorrected: 'পুরোনো মডেল বনাম এআই-সংশোধিত বৃষ্টি',
      divergenceDelta: 'বৃষ্টির পার্থক্য',
      extremeProbabilities: 'ভারী বৃষ্টির সম্ভাবনা',
      heavy: 'ভারী বৃষ্টি (>64 মিমি)',
      veryHeavy: 'অতি ভারী বৃষ্টি (>115 মিমি)',
      extremelyHeavy: 'বন্যা সতর্কতা (>204 মিমি)',
      downloadBulletin: 'জরুরি আবহাওয়া সতর্কতা',
      synopticContext: 'এখানে কেন বৃষ্টি হচ্ছে?',
      close: 'সম্পন্ন',
    },
    whatIfModal: {
      title: 'আবহাওয়া সিমুলেটর',
      subtitle: 'বাতাস ও মেঘ পরিবর্তন করে দেখুন আবহাওয়া প্যাটার্ন কীভাবে বদলায়',
      shear850: 'বর্ষার বাতাসের গতি',
      troughLat: 'বৃষ্টির বলয়ের অবস্থান (উত্তর / দক্ষিণ)',
      mslpGrad: 'বায়ুর চাপ পরিবর্তন',
      vortexIndex: 'উপকূলীয় মেঘের ঘূর্ণি',
      simulateBreak: 'বৃষ্টির বিরতি পরীক্ষা',
      simulateDepression: 'নিম্নচাপ ঝড়ের পরীক্ষা',
      simulateSurge: 'পাহাড়ি বৃষ্টির পরীক্ষা',
      resetOperational: 'আজকের আবহাওয়ায় ফিরুন',
      detectedRegime: 'বর্তমান আবহাওয়া প্যাটার্ন',
    },
    verification: {
      title: 'পূর্বাভাস নির্ভুলতা স্কোর',
      subtitle: '৫ বছরে ৪,২০০+ আবহাওয়া স্টেশনে পুরোনো মডেলের সাথে তুলনা',
      rmse: 'গড় পূর্বাভাস ত্রুটি',
      mae: 'দৈনিক পার্থক্য',
      csi: 'ঝড় শনাক্তকরণ স্কোর',
      far: 'ভুল সতর্কতা অনুপাত',
      reliability: 'পূর্বাভাস বিশ্বাসযোগ্যতা',
      contingencyTable: 'বিভাগীয় স্কোর',
    },
    riskCenter: {
      searchPlaceholder: 'জেলা বা রাজ্য খুঁজুন...',
      allDistricts: 'সকল জেলা',
      highRiskOnly: 'শুধু হাই অ্যালার্ট জেলা',
      vulnerableZones: 'পাহাড়ি ও উপকূলীয় এলাকা',
      sortRainfall: 'বৃষ্টির পরিমাণ অনুসারে',
    },
  },
  ta: {
    appTitle: 'வாயுத்ருஷ்டி — ஸ்மார்ட் மழை முன்னறிவிப்பு',
    appSubtitle: 'இந்தியாவுக்கான AI-திருத்தப்பட்ட துல்லியமான பருவமழை முன்னறிவிப்பு',
    views: {
      precipitationMap: 'மழை வரைபடம்',
      regimeIntelligence: 'இன்றைய வானிலை முறை',
      districtRisk: 'மாவட்ட மழை எச்சரிக்கைகள்',
      skillVerification: 'முன்னறிவிப்பு துல்லிய மதிப்பெண்',
    },
    liveBadge: 'நேரலை வானிலை',
    nwpCycle: 'மாதிரி புதுப்பிப்பு: 06:00 UTC',
    nextRun: 'அடுத்த புதுப்பிப்பு',
    leadTimes: {
      t0: 'தற்போது',
      t24: 'நாளை (+24 மணி)',
      t48: 'நாளை மறுநாள் (+48 மணி)',
      t72: '3 நாட்கள் கழித்து (+72 மணி)',
      t96: '4 நாட்கள் கழித்து (+96 மணி)',
      t120: '5 நாட்கள் கழித்து (+120 மணி)',
    },
    regimes: {
      active_monsoon: 'தீவிர பருவமழை',
      break_monsoon: 'மழை இடைவேளை (வறண்ட நாட்கள்)',
      monsoon_depression: 'காற்றழுத்த தாழ்வு புயல்',
      orographic_surge: 'மலைப்பகுதி மழை',
      western_disturbance: 'வடக்கு மலைப்பகுதி மழை',
    },
    riskTiers: {
      green: 'பச்சை · எந்தப் பிரச்சனையும் இல்லை',
      yellow: 'மஞ்சள் · கவனமாக இருக்கவும்',
      orange: 'ஆரஞ்சு · தயாராக இருக்கவும்',
      red: 'சிவப்பு · ஆபத்து: பாதுகாப்பாக இருக்கவும்',
    },
    riskTierDesc: {
      green: 'இயல்பான வானிலை. மழையால் பாதிப்பில்லை.',
      yellow: 'மிதமான மழை பெய்யக்கூடும். குடை வைத்திருக்கவும்.',
      orange: 'கனமழை பெய்ய வாய்ப்புள்ளது. சாலைகளில் வெள்ளம் தேங்கலாம்.',
      red: 'மிக ஆபத்தான கனமழை. வீட்டிற்குள் பாதுகாப்பாக இருக்கவும்.',
    },
    mapControls: {
      layerSplit: 'ஒப்பீடு',
      rawNwp: 'பழைய மாதிரி கணிப்பு',
      aiCorrected: 'AI-திருத்தப்பட்ட மழை',
      difference: 'மழை வித்தியாசம்',
      windVectors: 'காற்று திசை',
      zoomIn: 'பெரிதாக்கு',
      zoomOut: 'சிறிதாக்கு',
      resetView: 'மையப்படுத்து',
      play: 'இயக்கு',
      pause: 'நிறுத்து',
      sliderHint: 'பழைய கணிப்பு மற்றும் AI திருத்தத்தை ஒப்பிட ஸ்லைடரை நகர்த்தவும்',
    },
    districtModal: {
      forecastSummary: 'மாவட்ட வானிலை சுருக்கம்',
      rawVsCorrected: 'பழைய மாதிரி vs AI-திருத்தப்பட்ட மழை',
      divergenceDelta: 'மழை வித்தியாசம்',
      extremeProbabilities: 'கனமழை வாய்ப்பு',
      heavy: 'கனமழை (>64 மி.மீ)',
      veryHeavy: 'மிகக் கனமழை (>115 மி.மீ)',
      extremelyHeavy: 'வெள்ள அபாயம் (>204 மி.மீ)',
      downloadBulletin: 'அவசர வானிலை எச்சரிக்கை',
      synopticContext: 'இங்கே ஏன் மழை பெய்கிறது?',
      close: 'முடிந்தது',
    },
    whatIfModal: {
      title: 'வானிலை சிமுலேட்டர்',
      subtitle: 'காற்று மற்றும் மேகங்களை மாற்றி இன்றைய வானிலை முறையை சோதிக்கவும்',
      shear850: 'பருவமழை காற்றின் வேகம்',
      troughLat: 'மழை மேக பகுதி (வடக்கு / தெற்கு)',
      mslpGrad: 'காற்றழுத்த வீழ்ச்சி',
      vortexIndex: 'கடற்கரை மேக சுழல்',
      simulateBreak: 'மழை இடைவேளை சோதனை',
      simulateDepression: 'புயல் சோதனை',
      simulateSurge: 'மலைப்பகுதி மழை சோதனை',
      resetOperational: 'இன்றைய வானிலைக்கு திரும்பவும்',
      detectedRegime: 'தற்போதைய வானிலை முறை',
    },
    verification: {
      title: 'முன்னறிவிப்பு துல்லிய மதிப்பெண்',
      subtitle: '5 ஆண்டுகளில் 4,200+ நிலையங்களுடன் பழைய மாதிரியை ஒப்பிடுதல்',
      rmse: 'சராசரி பிழை (குறைவாக இருப்பது நன்று)',
      mae: 'தினசரி வித்தியாசம்',
      csi: 'புயல் கண்டறிதல் மதிப்பெண்',
      far: 'தவறான எச்சரிக்கை விகிதம்',
      reliability: 'நம்பகத்தன்மை மதிப்பெண்',
      contingencyTable: 'வகைப்படுத்தப்பட்ட மதிப்பெண்கள்',
    },
    riskCenter: {
      searchPlaceholder: 'மாவட்டம் அல்லது மாநிலத்தை தேடுங்கள்...',
      allDistricts: 'அனைத்து மாவட்டங்கள்',
      highRiskOnly: 'அதி தீவிர எச்சரிக்கை மாவட்டங்கள் மட்டும்',
      vulnerableZones: 'மலை மற்றும் கடற்கரை பகுதிகள்',
      sortRainfall: 'மழை அளவின்படி வரிசைப்படுத்து',
    },
  },
  te: {
    appTitle: 'వాయుదృష్టి — స్మార్ట్ వర్షపాత అంచనా',
    appSubtitle: 'భారతదేశం కోసం AI-సరిచేసిన ఖచ్చితమైన రుతుపవన వర్షపాత అంచనా',
    views: {
      precipitationMap: 'వర్షపాత పటం',
      regimeIntelligence: 'నేటి వాతావరణ సరళి',
      districtRisk: 'జిల్లా వర్ష హెచ్చరికలు',
      skillVerification: 'అంచనా ఖచ్చితత్వ స్కోరు',
    },
    liveBadge: 'ప్రత్యక్ష వాతావరణం',
    nwpCycle: 'మోడల్ అప్‌డేట్: 06:00 UTC',
    nextRun: 'తదుపరి అప్‌డేట్',
    leadTimes: {
      t0: 'ఇప్పుడు (ప్రస్తుతం)',
      t24: 'రేపు (+24గం)',
      t48: 'ఎల్లుండి (+48గం)',
      t72: '3 రోజుల తర్వాత (+72గం)',
      t96: '4 రోజుల తర్వాత (+96గం)',
      t120: '5 రోజుల తర్వాత (+120గం)',
    },
    regimes: {
      active_monsoon: 'తీవ్ర రుతుపవన వర్షం',
      break_monsoon: 'వర్ష విరామం (పొడి వాతావరణం)',
      monsoon_depression: 'అల్పపీడన తుఫాను',
      orographic_surge: 'పర్వత ప్రాంత వర్షం',
      western_disturbance: 'ఉత్తర పర్వత జల్లులు',
    },
    riskTiers: {
      green: 'ఆకుపచ్చ · ఇబ్బంది లేదు',
      yellow: 'పసుపు · గమనించండి',
      orange: 'నారింజ · సిద్ధంగా ఉండండి',
      red: 'ఎరుపు · ప్రమాదం: సురక్షితంగా ఉండండి',
    },
    riskTierDesc: {
      green: 'సాధారణ ఆహ్లాదకర వాతావరణం. వర్ష సమస్య లేదు.',
      yellow: 'మోస్తరు వర్షం పడే అవకాశం ఉంది. గొడుగు సిద్ధంగా ఉంచుకోండి.',
      orange: 'భారీ వర్షం పడవచ్చు. రోడ్లపై నీరు నిలిచే అవకాశం ఉంది.',
      red: 'ప్రమాదకరమైన భారీ వర్షం మరియు వరదలు. ఇళ్లలోనే సురక్షితంగా ఉండండి.',
    },
    mapControls: {
      layerSplit: 'అంచనాల పోలిక',
      rawNwp: 'పాత మోడల్ అంచనా',
      aiCorrected: 'AI-సరిచేసిన వర్షం',
      difference: 'వర్ష తేడా',
      windVectors: 'గాలి దిశ',
      zoomIn: 'జూమ్ ఇన్',
      zoomOut: 'జూమ్ అవుట్',
      resetView: 'కేంద్రంలోకి మార్చు',
      play: 'ప్లే చేయండి',
      pause: 'ఆపండి',
      sliderHint: 'పాత మోడల్ మరియు AI సవరణను పోల్చడానికి స్లైడర్ జరపండి',
    },
    districtModal: {
      forecastSummary: 'జిల్లా వాతావరణ సారాంశం',
      rawVsCorrected: 'పాత మోడల్ vs AI-సరిచేసిన వర్షం',
      divergenceDelta: 'వర్ష తేడా',
      extremeProbabilities: 'భారీ వర్షపాత సంభావ్యత',
      heavy: 'భారీ వర్షం (>64 మి.మీ)',
      veryHeavy: 'చాలా భారీ వర్షం (>115 మి.మీ)',
      extremelyHeavy: 'వరద హెచ్చరిక (>204 మి.మీ)',
      downloadBulletin: 'అత్యవసర వాతావరణ హెచ్చరిక',
      synopticContext: 'ఇక్కడ ఎందుకు వర్షం పడుతోంది?',
      close: 'పూర్తయింది',
    },
    whatIfModal: {
      title: 'వాతావరణ సిమ్యులేటర్',
      subtitle: 'గాలి మరియు మేఘాల మార్పులను పరీక్షించి నేటి వాతావరణ సరళిని గమనించండి',
      shear850: 'రుతుపవన గాలి వేగం',
      troughLat: 'వర్ష మేఘాల ప్రాంతం (ఉత్తరం / దక్షిణం)',
      mslpGrad: 'తుఫాను పీడన క్షీణత',
      vortexIndex: 'తీరప్రాంత మేఘాల సుడిగుండం',
      simulateBreak: 'వర్ష విరామం ప్రయోగం',
      simulateDepression: 'తుఫాను ప్రయోగం',
      simulateSurge: 'పర్వత ప్రాంత వర్ష ప్రయోగం',
      resetOperational: 'నేటి వాతావరణానికి తిరిగి రండి',
      detectedRegime: 'ప్రస్తుత వాతావరణ సరళి',
    },
    verification: {
      title: 'అంచనా ఖచ్చితత్వ స్కోరు',
      subtitle: '5 సంవత్సరాలలో 4,200+ కేంద్రాల ద్వారా పాత మోడల్స్‌తో పోలిక',
      rmse: 'సగటు అంచనా లోపం (తక్కువగా ఉంటే మంచిది)',
      mae: 'రోజువారీ వ్యత్యాసం',
      csi: 'తుఫాను గుర్తింపు స్కోరు (ఎక్కువగా ఉంటే మంచిది)',
      far: 'తప్పుడు హెచ్చరికల రేటు (తక్కువగా ఉంటే మంచిది)',
      reliability: 'అంచనా విశ్వసనీయత',
      contingencyTable: 'కేటగిరీ వారీ స్కోర్లు',
    },
    riskCenter: {
      searchPlaceholder: 'జిల్లా లేదా రాష్ట్రాన్ని వెతకండి...',
      allDistricts: 'అన్ని జిల్లాలు',
      highRiskOnly: 'హై అలర్ట్ జిల్లాలు మాత్రమే',
      vulnerableZones: 'పర్వత మరియు తీరప్రాంతాలు',
      sortRainfall: 'వర్షపాతం క్రమంలో అమర్చు',
    },
  },
  mr: {
    appTitle: 'वायुदृष्टी — स्मार्ट पाऊस अंदाज',
    appSubtitle: 'भारतासाठी एआय-दुरुस्त अचूक मान्सून पाऊस अंदाज',
    views: {
      precipitationMap: 'पाऊस नकाशा',
      regimeIntelligence: 'आजचा हवामान पॅटर्न',
      districtRisk: 'जिल्हा पाऊस अलर्ट',
      skillVerification: 'अंदाज अचूकता स्कोअर',
    },
    liveBadge: 'थेट हवामान',
    nwpCycle: 'मॉडेल अपडेट: 06:00 UTC',
    nextRun: 'पुढील अपडेट',
    leadTimes: {
      t0: 'आत्ताच (सध्या)',
      t24: 'उद्या (+24 तास)',
      t48: 'परवा (+48 तास)',
      t72: '3 दिवसांनी (+72 तास)',
      t96: '4 दिवसांनी (+96 तास)',
      t120: '5 दिवसांनी (+120 तास)',
    },
    regimes: {
      active_monsoon: 'जोरदार मान्सून पाऊस',
      break_monsoon: 'पावसाचा खंड (कोरडे दिवस)',
      monsoon_depression: 'कमी दाबाचे वादळ',
      orographic_surge: 'डोंगराळ पाऊस (माउंटेन रेन)',
      western_disturbance: 'उत्तरेकडील डोंगराळ सरी',
    },
    riskTiers: {
      green: 'हिरवा · काही अडचण नाही',
      yellow: 'पिवळा · सावध राहा',
      orange: 'केशरी · सज्ज राहा',
      red: 'लाल · धोका: सुरक्षित राहा',
    },
    riskTierDesc: {
      green: 'सामान्य छान हवामान. पावसाचा कोणताही त्रास नाही.',
      yellow: 'मध्यम पाऊस शक्य. छत्री सोबत ठेवा.',
      orange: 'मुसळधार पावसाची शक्यता. रस्त्यांवर पाणी साचू शकते.',
      red: 'धोकादायक अतिवृष्टी व पूर. घराबाहेर पडणे टाळा.',
    },
    mapControls: {
      layerSplit: 'अंदाज तुलना',
      rawNwp: 'जुना मॉडेल अंदाज',
      aiCorrected: 'एआय-दुरुस्त पाऊस',
      difference: 'पावसातील फरक',
      windVectors: 'वाऱ्याची दिशा',
      zoomIn: 'झूम इन',
      zoomOut: 'झूम आउट',
      resetView: 'मध्यभागी आणा',
      play: 'अ‍ॅनिमेट करा',
      pause: 'थांबवा',
      sliderHint: 'जुना अंदाज आणि एआय दुरुस्तीची तुलना करण्यासाठी स्लाइडर हलवा',
    },
    districtModal: {
      forecastSummary: 'जिल्हा हवामान सारांश',
      rawVsCorrected: 'जुना मॉडेल vs एआय-दुरुस्त पाऊस',
      divergenceDelta: 'पावसातील फरक',
      extremeProbabilities: 'मुसळधार पावसाची शक्यता',
      heavy: 'मुसळधार पाऊस (>64 मिमी)',
      veryHeavy: 'अति मुसळधार पाऊस (>115 मिमी)',
      extremelyHeavy: 'पूर इशारा (>204 मिमी)',
      downloadBulletin: 'तातडीचा हवामान इशारा',
      synopticContext: 'इथे पाऊस का पडत आहे?',
      close: 'झाले',
    },
    whatIfModal: {
      title: 'हवामान सिम्युलेटर',
      subtitle: 'वारे आणि ढग बदलून पहा आजचा पॅटर्न कसा बदलतो',
      shear850: 'मान्सून वाऱ्याचा वेग',
      troughLat: 'पाऊस पट्ट्याची स्थिती (उत्तर / दक्षिण)',
      mslpGrad: 'वादळाचा हवेचा दाब',
      vortexIndex: 'किनारपट्टीवरील ढगांचा भोवरा',
      simulateBreak: 'पाऊस खंड चाचणी',
      simulateDepression: 'वादळ चाचणी',
      simulateSurge: 'डोंगराळ पाऊस चाचणी',
      resetOperational: 'आजच्या हवामानावर परत या',
      detectedRegime: 'सध्याचा हवामान पॅटर्न',
    },
    verification: {
      title: 'अंदाज अचूकता स्कोअर',
      subtitle: '५ वर्षांत ४,२००+ हवामान केंद्रांवर जुन्या मॉडेल्सशी तुलना',
      rmse: 'सरासरी अंदाज चूक (कमी असलेली बरी)',
      mae: 'दैनंदिन फरक',
      csi: 'वादळ पकडण्याचा स्कोअर (जास्त असलेला बरा)',
      far: 'खोटे अलर्ट प्रमाण (कमी असलेले बरे)',
      reliability: 'अंदाज विश्वासार्हता',
      contingencyTable: 'वर्गवारीनुसार स्कोअर',
    },
    riskCenter: {
      searchPlaceholder: 'जिल्हा किंवा राज्य शोधा...',
      allDistricts: 'सर्व जिल्हे',
      highRiskOnly: 'फक्त हाय अलर्ट जिल्हे',
      vulnerableZones: 'डोंगराळ व किनारपट्टी भाग',
      sortRainfall: 'पावसाच्या प्रमाणानुसार',
    },
  },
};
