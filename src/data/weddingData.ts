export type LanguageMode = 'bilingual' | 'en' | 'hi';

export interface WeddingEventItem {
  id: string;
  dateFormatted: string;
  isoDate: string;
  dayEn: string;
  dayHi: string;
  titleEn: string;
  titleHi: string;
  timeEn: string;
  timeHi: string;
  venueNameEn: string;
  venueNameHi: string;
  venueAddressEn: string;
  venueAddressHi: string;
  descriptionEn: string;
  descriptionHi: string;
  ritualsEn: string[];
  ritualsHi: string[];
  dressCodeEn: string;
  dressCodeHi: string;
  image: string;
  isMainVenue: boolean;
}

export const WEDDING_IMAGES = {
  heroMandap: '/src/assets/images/hero_wedding_mandap_1793607347959.jpg',
  couplePortrait: '/src/assets/images/couple_traditional_portrait_1793607350128.jpg',
  haldiRitual: '/src/assets/images/haldi_mehendi_ritual_1793607352047.jpg',
  venueHall: '/src/assets/images/venue_banquet_hall_1793607352544.jpg',
};

export const WEDDING_CORE = {
  title: 'Mampi WEDS Durgesh',
  hashtag: '#MampiWedsDurgesh',
  secondaryHashtag: '#DurgeshKiMampi',
  weddingDateDisplay: '24.11.2026',
  weddingTimeDisplayEn: '7:00 PM Onwards',
  weddingTimeDisplayHi: 'संध्या ७:०० बजे से आपके आगमन तक',
  weddingIsoTarget: '2026-11-24T19:00:00+05:30',
  bride: {
    nameEn: 'Mampi',
    nameHi: 'मम्पी (आयुष्मती मम्पी)',
    fatherEn: 'Lt. Saroj Kumar Sah',
    fatherHi: 'स्व. सरोज कुमार साह',
    motherEn: 'Smt. Poonam Saw',
    motherHi: 'श्रीमती पूनम साव',
    lineageEn: 'Beloved daughter of Smt. Poonam Saw & Lt. Saroj Kumar Sah',
    lineageHi: 'श्रीमती पूनम साव एवं स्व. सरोज कुमार साह की सुपुत्री',
  },
  groom: {
    nameEn: 'Durgesh',
    nameHi: 'दुर्गेश (चिरंजीव दुर्गेश)',
    fatherEn: 'Lt. Vishwanath Keshri',
    fatherHi: 'स्व. विश्वनाथ केसरी',
    motherEn: 'Lt. Shobha Devi',
    motherHi: 'स्व. शोभा देवी',
    lineageEn: 'Beloved son of Lt. Shobha Devi & Lt. Vishwanath Keshri',
    lineageHi: 'स्व. शोभा देवी एवं स्व. विश्वनाथ केसरी के सुपुत्र',
  },
  venue: {
    nameEn: 'Jay Maa Tara Anusthan Bhawan',
    nameHi: 'जय माँ तारा अनुष्ठान भवन',
    addressEn: 'Sanghata Para, Rampurhat, Birbhum, West Bengal - 731224',
    addressHi: 'संघता पाड़ा, रामपुरहाट, जिला - बीरभूम (पश्चिम बंगाल) - ७३१२२४',
    cityEn: 'Rampurhat',
    cityHi: 'रामपुरहाट',
    googleMapsShortUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    coordinates: {
      lat: 24.1672621,
      lng: 87.7861147,
    },
  },
  shloka: {
    sanskrit: '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    meaningEn: 'With the divine grace of Lord Ganesha and Goddess Maa Tara, we invite you to bless the sacred union of two souls and two families.',
    meaningHi: 'भगवान श्री गणेश एवं माँ तारा की असीम अनुकम्पा से आयोजित इस पावन परिणय उत्सव में आपकी गरिमामयी उपस्थिति एवं आशीर्वाद प्रार्थनीय है।',
  },
  familyInvitation: {
    hostEn: 'Smt. Poonam Saw & The Entire Sah & Keshri Family',
    hostHi: 'श्रीमती पूनम साव एवं समस्त साह तथा केसरी परिवार',
    letterEn:
      'With the heavenly blessings of Late Saroj Kumar Sah, Late Vishwanath Keshri, and Late Shobha Devi, Mrs. Poonam Saw cordially requests the honor of your presence and blessings with family at the auspicious wedding celebration of her beloved daughter Mampi with Durgesh.',
    letterHi:
      'स्व. सरोज कुमार साह, स्व. विश्वनाथ केसरी एवं स्व. शोभा देवी के दिव्य आशीर्वाद से, श्रीमती पूनम साव अपनी लाड़ली सुपुत्री आयुष्मती मम्पी एवं चिरंजीव दुर्गेश के शुभ विवाह के मांगलिक अवसर पर आपको सपरिवार पधारने एवं नवयुगल को आशीर्वाद प्रदान करने हेतु सादर आमंत्रित करती हैं।',
  },
};

export const WEDDING_EVENTS: WeddingEventItem[] = [
  {
    id: 'mehendi-22',
    dateFormatted: '22.11.2026',
    isoDate: '2026-11-22',
    dayEn: 'Sunday · Day 01',
    dayHi: 'रविवार · प्रथम दिवस',
    titleEn: 'Mehendi Ceremony',
    titleHi: 'मेहंदी रस्म एवं संगीत संध्या',
    timeEn: '4:00 PM Onwards',
    timeHi: 'संध्या ४:०० बजे से',
    venueNameEn: 'Own Residence (Nij Niwas)',
    venueNameHi: 'निज निवास (अपना घर)',
    venueAddressEn: 'Rampurhat, Birbhum, West Bengal',
    venueAddressHi: 'रामपुरहाट, बीरभूम, पश्चिम बंगाल',
    descriptionEn:
      'An intimate afternoon of auspicious bridal henna artistry, traditional folk songs (Vivah Geet), and joyful family celebrations at our family home.',
    descriptionHi:
      'निज निवास पर पारंपरिक विवाह गीतों की मधुर गूंज, शगुन की मेहंदी और परिवार के स्नेहिल मिलन का मंगलमय आयोजन।',
    ritualsEn: ['Shagun Mehendi', 'Vivah Folk Songs', 'Evening Tea & Refreshments'],
    ritualsHi: ['शगुन मेहंदी रस्म', 'पारंपरिक मंगल गीत', 'जलपान एवं पारिवारिक मिलन'],
    dressCodeEn: 'Mehendi Green & Festive Ethnic',
    dressCodeHi: 'मेहंदी हरा एवं पारंपरिक परिधान',
    image: WEDDING_IMAGES.couplePortrait,
    isMainVenue: false,
  },
  {
    id: 'puja-haldi-23',
    dateFormatted: '23.11.2026',
    isoDate: '2026-11-23',
    dayEn: 'Monday · Day 02',
    dayHi: 'सोमवार · द्वितीय दिवस',
    titleEn: 'SatyaNarayan Pujan, Matkor, Ghee Dhari & Haldi',
    titleHi: 'सत्यनारायण पूजन, मटकोर, घी ढारी एवं हल्दी उत्सव',
    timeEn: '9:00 AM Onwards (All-Day Rituals)',
    timeHi: 'प्रातः ९:०० बजे से (संपूर्ण दिवस अनुष्ठान)',
    venueNameEn: 'Own Residence (Nij Niwas)',
    venueNameHi: 'निज निवास (अपना घर)',
    venueAddressEn: 'Rampurhat, Birbhum, West Bengal',
    venueAddressHi: 'रामपुरहाट, बीरभूम, पश्चिम बंगाल',
    descriptionEn:
      'Sacred Vedic rituals beginning with SatyaNarayan Katha and ancestral Ghee Dhari blessings, followed by vibrant turmeric Haldi celebrations and the traditional Matkor procession.',
    descriptionHi:
      'भगवान सत्यनारायण की कथा एवं पितरों के आशीर्वाद हेतु घी ढारी अनुष्ठान से प्रारंभ होकर, मंगलमय हल्दी लेपन एवं पारंपरिक मटकोर पूजन का पावन उत्सव।',
    ritualsEn: [
      '09:00 AM · SatyaNarayan Pujan',
      '11:30 AM · Ghee Dhari Ritual',
      '01:30 PM · Auspicious Haldi Utsav',
      '05:00 PM · Traditional Matkor',
    ],
    ritualsHi: [
      'प्रातः ०९:०० · श्री सत्यनारायण पूजन',
      'प्रातः ११:३० · घी ढारी संस्कार',
      'दोपहर ०१:३० · मंगलमय हल्दी उत्सव',
      'संध्या ०५:०० · मटकोर पूजन',
    ],
    dressCodeEn: 'Marigold Yellow, Saffron & Ivory',
    dressCodeHi: 'पीला, केसरिया एवं पारंपरिक परिधान',
    image: WEDDING_IMAGES.haldiRitual,
    isMainVenue: false,
  },
  {
    id: 'wedding-24',
    dateFormatted: '24.11.2026',
    isoDate: '2026-11-24',
    dayEn: 'Tuesday · Day 03',
    dayHi: 'मंगलवार · तृतीय दिवस (मुख्य समारोह)',
    titleEn: 'Shubh Vivah & Wedding Celebration',
    titleHi: 'शुभ विवाह, जयमाला एवं प्रीतिभोज',
    timeEn: '7:00 PM Onwards',
    timeHi: 'संध्या ७:०० बजे से आपके आगमन तक',
    venueNameEn: 'Jay Maa Tara Anusthan Bhawan',
    venueNameHi: 'जय माँ तारा अनुष्ठान भवन',
    venueAddressEn: 'Sanghata Para, Rampurhat, Birbhum',
    venueAddressHi: 'संघता पाड़ा, रामपुरहाट, बीरभूम',
    descriptionEn:
      'The grand wedding celebration at Jay Maa Tara Anusthan Bhawan—featuring Baraat Swagat, Varmala under the floral mandap, celebratory Priti Bhoj dinner, and sacred Saptapadi Pheras.',
    descriptionHi:
      'जय माँ तारा अनुष्ठान भवन, संघता पाड़ा में बारात स्वागत, शुभ जयमाला, प्रीतिभोज एवं वैदिक मंत्रोच्चार के साथ शुभ लग्न फेरे का भव्य आयोजन।',
    ritualsEn: [
      '07:00 PM · Baraat Swagat & Dwarchar',
      '08:00 PM · Auspicious Varmala & Stage Blessings',
      '08:30 PM · Grand Priti Bhoj (Dinner)',
      'Auspicious Lagna · Shubh Vivah & Saptapadi',
    ],
    ritualsHi: [
      'संध्या ०७:०० · बारात स्वागत एवं द्वारचार',
      'रात्रि ०८:०० · शुभ जयमाला एवं आशीर्वाद समारोह',
      'रात्रि ०८:३० · प्रीतिभोज (भोजन)',
      'शुभ लग्नानुसार · पाणिग्रहण संस्कार एवं सप्तपदी',
    ],
    dressCodeEn: 'Royal Crimson, Banarasi Silk & Sherwani',
    dressCodeHi: 'शाही लाल, बनारसी साड़ी एवं पारंपरिक परिधान',
    image: WEDDING_IMAGES.venueHall,
    isMainVenue: true,
  },
];

export function generateWeddingIcsFile(): void {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mampi Weds Durgesh//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:mampi-weds-durgesh-20261124@rampurhat',
    'SUMMARY:Mampi WEDS Durgesh — Wedding Celebration (शुभ विवाह)',
    'DTSTART:20261124T133000Z',
    'DTEND:20261124T183000Z',
    'LOCATION:Jay Maa Tara Anusthan Bhawan\\, Sanghata Para\\, Rampurhat\\, Birbhum',
    'DESCRIPTION:Wedding Celebration of Mampi (D/o Smt. Poonam Saw & Lt. Saroj Kumar Sah) and Durgesh (S/o Lt. Shobha Devi & Lt. Vishwanath Keshri). Venue: Jay Maa Tara Anusthan Bhawan\\, Sanghata Para\\, Rampurhat\\, Birbhum. Google Maps: https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    'URL:https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Mampi-Weds-Durgesh-24-11-2026.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
