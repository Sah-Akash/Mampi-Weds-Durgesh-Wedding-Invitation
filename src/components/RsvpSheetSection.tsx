import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Download,
  ExternalLink,
  AlertCircle,
  Send,
  LogOut,
  PlusCircle,
  Link2,
  X,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
  RsvpRecord,
  SheetMetadata,
  extractSpreadsheetId,
  fetchSpreadsheetMetadata,
  createWeddingRsvpSpreadsheet,
  appendRsvpRecordsToSheet,
  fetchRsvpRowsFromSheet,
} from '../services/googleSheetsAuth';
import { LanguageMode, WEDDING_CORE } from '../data/weddingData';

interface RsvpSheetSectionProps {
  lang: LanguageMode;
}

const LOCAL_STORAGE_RSVP_KEY = 'mampi_durgesh_wedding_rsvps_v1';
const LOCAL_STORAGE_SHEET_META_KEY = 'mampi_durgesh_connected_sheet_v1';

const INITIAL_BLESSINGS: RsvpRecord[] = [
  {
    id: 'seed-1',
    submittedAt: '2026-11-01 18:30',
    guestName: 'Rajesh & Sunita Keshri',
    phone: '+91 98320 *****',
    attendance: 'joyfully_attending',
    guestCount: 4,
    side: 'groom',
    events: [
      'SatyaNarayan Pujan, Matkor, Ghee Dhari & Haldi (23.11.2026)',
      'Wedding Celebration (24.11.2026)',
    ],
    arrivalInfo: 'Arriving at Rampurhat Junction on 23rd morning',
    message:
      'Heartiest congratulations to Mampi & Durgesh! May Maa Tara bless the newlyweds with eternal happiness and prosperity.',
    syncedToSheet: false,
  },
  {
    id: 'seed-2',
    submittedAt: '2026-11-01 20:15',
    guestName: 'Ananya & Vikash Sah',
    phone: '+91 94341 *****',
    attendance: 'joyfully_attending',
    guestCount: 3,
    side: 'bride',
    events: [
      'Mehendi (22.11.2026)',
      'SatyaNarayan Pujan, Matkor, Ghee Dhari & Haldi (23.11.2026)',
      'Wedding Celebration (24.11.2026)',
    ],
    arrivalInfo: 'Local Residence, Rampurhat',
    message:
      'माम्पी और दुर्गेश को शुभ विवाह की अनंत शुभकामनाएँ! आप दोनों का वैवाहिक जीवन सदैव खुशियों से महकता रहे।',
    syncedToSheet: false,
  },
];

export const RsvpSheetSection: React.FC<RsvpSheetSectionProps> = ({ lang }) => {
  // RSVP Form State
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<
    'joyfully_attending' | 'regretfully_unable'
  >('joyfully_attending');
  const [guestCount, setGuestCount] = useState(2);
  const [side, setSide] = useState<'bride' | 'groom' | 'both'>('bride');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'Mehendi (22.11.2026)',
    'SatyaNarayan Pujan, Matkor, Ghee Dhari & Haldi (23.11.2026)',
    'Wedding Celebration (24.11.2026)',
  ]);
  const [arrivalInfo, setArrivalInfo] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stored RSVPs & Filter
  const [rsvps, setRsvps] = useState<RsvpRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RSVP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_BLESSINGS;
  });
  const [sideFilter, setSideFilter] = useState<'all' | 'bride' | 'groom'>('all');

  // Google Sheets OAuth & Live Sync State
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sheetMeta, setSheetMeta] = useState<SheetMetadata | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SHEET_META_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sheetInputUrl, setSheetInputUrl] = useState('');
  const [showConnectInput, setShowConnectInput] = useState(false);
  const [sheetStatusMsg, setSheetStatusMsg] = useState<string | null>(null);
  const [sheetErrorMsg, setSheetErrorMsg] = useState<string | null>(null);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  // Mandatory User Confirmation Modal state before mutating/updating Google Sheet
  const [pendingConfirmAction, setPendingConfirmAction] = useState<{
    title: string;
    description: string;
    affectedCount: number;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RSVP_KEY, JSON.stringify(rsvps));
    } catch {
      // ignore
    }
  }, [rsvps]);

  useEffect(() => {
    try {
      if (sheetMeta) {
        localStorage.setItem(
          LOCAL_STORAGE_SHEET_META_KEY,
          JSON.stringify(sheetMeta)
        );
      } else {
        localStorage.removeItem(LOCAL_STORAGE_SHEET_META_KEY);
      }
    } catch {
      // ignore
    }
  }, [sheetMeta]);

  const eventOptions = [
    {
      value: 'Mehendi (22.11.2026)',
      labelEn: '22.11.2026 · Mehendi Ceremony (Own House)',
      labelHi: '२२.११.२०२६ · मेहंदी रस्म (निज निवास)',
    },
    {
      value: 'SatyaNarayan Pujan, Matkor, Ghee Dhari & Haldi (23.11.2026)',
      labelEn:
        '23.11.2026 · SatyaNarayan Pujan, Matkor, Ghee Dhari & Haldi (Own House)',
      labelHi: '२३.११.२०२६ · सत्यनारायण पूजन, मटकोर, घी ढारी एवं हल्दी (निज निवास)',
    },
    {
      value: 'Wedding Celebration (24.11.2026)',
      labelEn:
        '24.11.2026 · Wedding at Jay Maa Tara Anusthan Bhawan (7:00 PM Onwards)',
      labelHi: '२४.११.२०२६ · शुभ विवाह — जय माँ तारा अनुष्ठान भवन (संध्या ७ बजे से)',
    },
  ];

  const toggleEventSelection = (val: string) => {
    setSelectedEvents((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setSheetErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        setSheetStatusMsg(
          'Signed in with Google. You can now create or connect a live Google Sheet.'
        );
      }
    } catch (err: any) {
      setSheetErrorMsg(
        err?.message || 'Google Sign-In was cancelled or failed.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setSheetStatusMsg(null);
  };

  // Create a brand new Google Sheet and sync current RSVPs
  const handleCreateNewSheet = async () => {
    setSheetErrorMsg(null);
    setSheetStatusMsg(null);
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setIsSyncingSheet(true);
    try {
      const createdMeta = await createWeddingRsvpSpreadsheet(token);
      setSheetMeta(createdMeta);
      // Sync existing unsynced records to the newly created sheet
      const unsynced = rsvps.filter((r) => !r.syncedToSheet);
      if (unsynced.length > 0) {
        await appendRsvpRecordsToSheet(
          createdMeta.spreadsheetId,
          createdMeta.firstSheetTitle,
          unsynced,
          token
        );
        setRsvps((prev) => prev.map((r) => ({ ...r, syncedToSheet: true })));
      }
      setSheetStatusMsg(
        `Created live sheet "${createdMeta.title}" and synced ${rsvps.length} RSVP records.`
      );
    } catch (err: any) {
      setSheetErrorMsg(
        err?.message || 'Could not create Google Sheet. Check permissions.'
      );
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Connect an existing Google Sheet by URL or ID
  const handleConnectExistingSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSheetErrorMsg(null);
    setSheetStatusMsg(null);
    const extractedId = extractSpreadsheetId(sheetInputUrl);
    if (!extractedId) {
      setSheetErrorMsg('Please enter a valid Google Sheet URL or ID.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setIsSyncingSheet(true);
    try {
      const meta = await fetchSpreadsheetMetadata(extractedId, token);
      setSheetMeta(meta);
      setShowConnectInput(false);
      setSheetInputUrl('');

      const existingRows = await fetchRsvpRowsFromSheet(
        meta.spreadsheetId,
        meta.firstSheetTitle,
        token
      );
      if (existingRows.length > 0) {
        setRsvps((prev) => {
          const existingNames = new Set(
            prev.map((p) => `${p.guestName.toLowerCase()}-${p.phone}`)
          );
          const newFromSheet = existingRows.filter(
            (r) => !existingNames.has(`${r.guestName.toLowerCase()}-${r.phone}`)
          );
          return [...newFromSheet, ...prev];
        });
      }
      setSheetStatusMsg(
        `Connected to "${meta.title}" (Tab: ${meta.firstSheetTitle}).`
      );
    } catch (err: any) {
      setSheetErrorMsg(
        err?.message ||
          'Failed to connect to that Google Sheet. Ensure your Google account has access.'
      );
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Request confirmation before pushing unsynced records to existing user sheet
  const requestPushUnsyncedToSheet = () => {
    if (!sheetMeta) return;
    const unsynced = rsvps.filter((r) => !r.syncedToSheet);
    if (unsynced.length === 0) {
      setSheetStatusMsg('All RSVP responses are already synced to Google Sheets.');
      return;
    }

    setPendingConfirmAction({
      title: `Append ${unsynced.length} RSVP Record(s) to Google Sheet?`,
      description: `This will write ${unsynced.length} guest RSVP row(s) directly into "${sheetMeta.title}" (tab: "${sheetMeta.firstSheetTitle}").`,
      affectedCount: unsynced.length,
      onConfirm: async () => {
        const token = await getAccessToken();
        if (!token) {
          setNeedsAuth(true);
          return;
        }
        setIsSyncingSheet(true);
        try {
          await appendRsvpRecordsToSheet(
            sheetMeta.spreadsheetId,
            sheetMeta.firstSheetTitle,
            unsynced,
            token
          );
          setRsvps((prev) => prev.map((r) => ({ ...r, syncedToSheet: true })));
          setSheetStatusMsg(
            `Successfully synced ${unsynced.length} RSVP row(s) to "${sheetMeta.title}".`
          );
        } catch (err: any) {
          setSheetErrorMsg(err?.message || 'Failed to sync rows to sheet.');
        } finally {
          setIsSyncingSheet(false);
        }
      },
    });
  };

  const handleRefreshFromSheet = async () => {
    if (!sheetMeta) return;
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setIsSyncingSheet(true);
    setSheetErrorMsg(null);
    try {
      const sheetRows = await fetchRsvpRowsFromSheet(
        sheetMeta.spreadsheetId,
        sheetMeta.firstSheetTitle,
        token
      );
      setRsvps((prev) => {
        const unsyncedLocal = prev.filter((p) => !p.syncedToSheet);
        return [...unsyncedLocal, ...sheetRows];
      });
      setSheetStatusMsg(
        `Refreshed ${sheetRows.length} live RSVP row(s) from "${sheetMeta.title}".`
      );
    } catch (err: any) {
      setSheetErrorMsg(err?.message || 'Failed to read from Google Sheet.');
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(null);

    const trimmedName = guestName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setFormError(
        lang === 'hi'
          ? 'कृपया अपना पूरा नाम दर्ज करें।'
          : 'Please enter your full name.'
      );
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 7) {
      setFormError(
        lang === 'hi'
          ? 'कृपया वैध फ़ोन या व्हाट्सएप नंबर दर्ज करें।'
          : 'Please enter a valid phone or WhatsApp number.'
      );
      return;
    }
    if (attendance === 'joyfully_attending' && selectedEvents.length === 0) {
      setFormError(
        lang === 'hi'
          ? 'कृपया कम से कम एक विवाह कार्यक्रम चुनें।'
          : 'Please select at least one wedding ceremony you will attend.'
      );
      return;
    }

    setIsSubmitting(true);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: RsvpRecord = {
      id: `rsvp-${Date.now()}`,
      submittedAt: nowStr,
      guestName: trimmedName,
      phone: trimmedPhone,
      attendance,
      guestCount: attendance === 'joyfully_attending' ? guestCount : 0,
      side,
      events:
        attendance === 'joyfully_attending'
          ? selectedEvents
          : ['Warm Wishes Only'],
      arrivalInfo: arrivalInfo.trim() || 'Rampurhat',
      message:
        message.trim() ||
        'Wishing Mampi & Durgesh a lifetime of love and happiness!',
      syncedToSheet: false,
    };

    try {
      const token = await getAccessToken();
      if (token && sheetMeta) {
        await appendRsvpRecordsToSheet(
          sheetMeta.spreadsheetId,
          sheetMeta.firstSheetTitle,
          [newRecord],
          token
        );
        newRecord.syncedToSheet = true;
      }

      setRsvps((prev) => [newRecord, ...prev]);
      setGuestName('');
      setPhone('');
      setArrivalInfo('');
      setMessage('');

      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSubmitSuccess(
        newRecord.syncedToSheet
          ? `Thank you, ${trimmedName}! Your RSVP has been recorded and live-synced to Google Sheets.`
          : `Thank you, ${trimmedName}! Your RSVP has been recorded (${
              sheetMeta
                ? 'click Sync to Sheet to push to Google Sheets'
                : 'connect Google Sheets on the right to sync live'
            }).`
      );
    } catch (err: any) {
      // Still save locally even if sheet append fails
      setRsvps((prev) => [newRecord, ...prev]);
      setSubmitSuccess(
        `Thank you, ${trimmedName}! Your RSVP is saved locally. (${
          err?.message || 'Sheet sync pending'
        })`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Submitted At',
      'Guest Name',
      'Phone',
      'Attendance',
      'Guests',
      'Side',
      'Events',
      'Arrival Info',
      'Blessings',
    ];
    const csvRows = [
      headers.join(','),
      ...rsvps.map((r) =>
        [
          `"${r.submittedAt.replace(/"/g, '""')}"`,
          `"${r.guestName.replace(/"/g, '""')}"`,
          `"${r.phone.replace(/"/g, '""')}"`,
          `"${r.attendance}"`,
          r.guestCount,
          `"${r.side}"`,
          `"${r.events.join('; ').replace(/"/g, '""')}"`,
          `"${r.arrivalInfo.replace(/"/g, '""')}"`,
          `"${r.message.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mampi-Weds-Durgesh-RSVPs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredRsvps = rsvps.filter((r) => {
    if (sideFilter === 'all') return true;
    return r.side === sideFilter || r.side === 'both';
  });

  const totalAttendingGuests = rsvps.reduce(
    (acc, r) =>
      r.attendance === 'joyfully_attending' ? acc + (r.guestCount || 1) : acc,
    0
  );
  const unsyncedCount = rsvps.filter((r) => !r.syncedToSheet).length;

  return (
    <section
      id="rsvp"
      className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E4D5C3]"
    >
      {/* Confirmation Modal for Mutating Google Sheet Operations */}
      {pendingConfirmAction && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FAF6F0] border border-[#D5C3AE] rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif-display text-2xl font-semibold text-[#231815]">
                {pendingConfirmAction.title}
              </h3>
              <button
                type="button"
                onClick={() => setPendingConfirmAction(null)}
                className="text-[#57463F] hover:text-[#231815] p-1"
                aria-label="Close confirmation modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#57463F] mt-2 leading-relaxed">
              {pendingConfirmAction.description}
            </p>
            <div className="mt-4 p-3 rounded-lg bg-[#F3ECE1] border border-[#E4D5C3] text-xs text-[#231815] font-mono-num">
              Affected rows to append: {pendingConfirmAction.affectedCount}
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingConfirmAction(null)}
                className="px-4 py-2 text-xs font-medium text-[#231815] bg-white border border-[#D5C3AE] rounded-lg hover:bg-[#F3ECE1] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = pendingConfirmAction.onConfirm;
                  setPendingConfirmAction(null);
                  await action();
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-[#8B1E24] rounded-lg hover:bg-[#70161B] transition-colors"
              >
                Confirm & Update Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 text-xs text-[#7C2D12] font-medium tracking-wide">
          <span>03. RSVP & Live Google Sheets Sync</span>
          <span aria-hidden="true">·</span>
          <span>आगमन की सूचना एवं आशीर्वाद</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            {totalAttendingGuests} Confirmed Guests
          </span>
        </div>
        <h2
          className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#231815] mt-3 leading-tight"
          style={{ textWrap: 'balance' }}
        >
          {lang === 'hi'
            ? 'अपनी उपस्थिति की पुष्टि करें (RSVP)'
            : 'Confirm Your Attendance & Blessings'}
        </h2>
        {(lang === 'bilingual' || lang === 'hi') && lang !== 'hi' && (
          <p className="font-serif-display text-xl sm:text-2xl text-[#8B1E24] mt-1">
            कृपया अपने सपरिवार आगमन की सूचना दें एवं नवयुगल को आशीर्वाद प्रदान करें
          </p>
        )}
        <p className="text-sm sm:text-base text-[#57463F] mt-3 leading-relaxed">
          {lang === 'hi'
            ? 'आपके आगमन से हमारा उत्सव पूर्ण होगा। नीचे दिए गए फॉर्म में अपनी उपस्थिति दर्ज करें — यह सीधे हमारे लाइव गूगल शीट (Google Sheets) के साथ सिंक होता है।'
            : 'Every response submitted below is recorded immediately and syncs directly with our live Google Sheets wedding guest registry.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bilingual RSVP Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#F3ECE1] border border-[#E4D5C3] rounded-2xl p-6 sm:p-8">
          <h3 className="font-serif-display text-2xl font-semibold text-[#231815]">
            {lang === 'hi'
              ? 'आमंत्रण प्रतिउत्तर प्रपत्र (RSVP Form)'
              : 'Guest RSVP Response Form · अतिथि विवरण'}
          </h3>
          <p className="text-xs text-[#57463F] mt-1">
            For {WEDDING_CORE.title} · {WEDDING_CORE.weddingDateDisplay} ·{' '}
            {WEDDING_CORE.venue.nameEn}, {WEDDING_CORE.venue.cityEn}
          </p>

          <form onSubmit={handleSubmitRsvp} className="mt-6 space-y-5">
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="block text-xs font-semibold text-[#231815] mb-1.5"
                >
                  Full Name · पूरा नाम *
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g., Sri Ramesh Kumar Sah & Family"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C3AE] rounded-lg text-[#231815] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B1E24]"
                />
              </div>

              <div>
                <label
                  htmlFor="rsvp-phone"
                  className="block text-xs font-semibold text-[#231815] mb-1.5"
                >
                  Phone / WhatsApp · मोबाइल नंबर *
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C3AE] rounded-lg text-[#231815] placeholder-[#8C7A70] font-mono-num focus:outline-none focus:border-[#8B1E24]"
                />
              </div>
            </div>

            {/* Attendance & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <span className="block text-xs font-semibold text-[#231815] mb-1.5">
                  Will You Attend? · क्या आप पधार रहे हैं? *
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttendance('joyfully_attending')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors text-center whitespace-nowrap shrink-0 ${
                      attendance === 'joyfully_attending'
                        ? 'bg-[#8B1E24] text-white border-[#8B1E24]'
                        : 'bg-white text-[#231815] border-[#D5C3AE] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    Joyfully Attending · हाँ, अवश्य
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance('regretfully_unable')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors text-center whitespace-nowrap shrink-0 ${
                      attendance === 'regretfully_unable'
                        ? 'bg-[#231815] text-white border-[#231815]'
                        : 'bg-white text-[#231815] border-[#D5C3AE] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    Sending Blessings · केवल शुभकामनाएँ
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="rsvp-count"
                  className="block text-xs font-semibold text-[#231815] mb-1.5"
                >
                  Number of Guests · सदस्य संख्या
                </label>
                <select
                  id="rsvp-count"
                  disabled={attendance === 'regretfully_unable'}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C3AE] rounded-lg text-[#231815] font-mono-num focus:outline-none focus:border-[#8B1E24] disabled:opacity-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest (१ सदस्य)' : `Guests (${num} सदस्य)`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Family Side */}
            <div>
              <span className="block text-xs font-semibold text-[#231815] mb-1.5">
                Family Side · आप किस पक्ष से हैं?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSide('bride')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    side === 'bride'
                      ? 'bg-[#7C2D12] text-white border-[#7C2D12]'
                      : 'bg-white text-[#231815] border-[#D5C3AE] hover:bg-[#FAF6F0]'
                  }`}
                >
                  Bride&apos;s Side · वधू पक्ष (Mampi)
                </button>
                <button
                  type="button"
                  onClick={() => setSide('groom')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    side === 'groom'
                      ? 'bg-[#7C2D12] text-white border-[#7C2D12]'
                      : 'bg-white text-[#231815] border-[#D5C3AE] hover:bg-[#FAF6F0]'
                  }`}
                >
                  Groom&apos;s Side · वर पक्ष (Durgesh)
                </button>
                <button
                  type="button"
                  onClick={() => setSide('both')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    side === 'both'
                      ? 'bg-[#7C2D12] text-white border-[#7C2D12]'
                      : 'bg-white text-[#231815] border-[#D5C3AE] hover:bg-[#FAF6F0]'
                  }`}
                >
                  Both Families · दोनों परिवार
                </button>
              </div>
            </div>

            {/* Ceremonies Attending */}
            {attendance === 'joyfully_attending' && (
              <div>
                <span className="block text-xs font-semibold text-[#231815] mb-2">
                  Ceremonies Attending · आप किन कार्यक्रमों में शामिल होंगे? *
                </span>
                <div className="space-y-2">
                  {eventOptions.map((ev) => {
                    const checked = selectedEvents.includes(ev.value);
                    return (
                      <label
                        key={ev.value}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-white border-[#8B1E24]'
                            : 'bg-[#FAF6F0] border-[#E4D5C3]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEventSelection(ev.value)}
                          className="mt-1 h-4 w-4 accent-[#8B1E24] rounded"
                        />
                        <div className="text-xs sm:text-sm">
                          <div className="font-semibold text-[#231815]">
                            {ev.labelEn}
                          </div>
                          {(lang === 'bilingual' || lang === 'hi') && (
                            <div className="text-[#7C2D12] text-xs mt-0.5">
                              {ev.labelHi}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Travel / Arrival Details */}
            <div>
              <label
                htmlFor="rsvp-arrival"
                className="block text-xs font-semibold text-[#231815] mb-1.5"
              >
                Arrival & Accommodation Note · आगमन का विवरण (Optional)
              </label>
              <input
                id="rsvp-arrival"
                type="text"
                value={arrivalInfo}
                onChange={(e) => setArrivalInfo(e.target.value)}
                placeholder="e.g., Arriving by Ganadevta Express at Rampurhat Junction on 24th Nov"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C3AE] rounded-lg text-[#231815] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B1E24]"
              />
            </div>

            {/* Blessings Message */}
            <div>
              <label
                htmlFor="rsvp-message"
                className="block text-xs font-semibold text-[#231815] mb-1.5"
              >
                Blessings for Mampi & Durgesh · नवयुगल के लिए आशीर्वाद एवं संदेश
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt blessings for Mampi & Durgesh..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C3AE] rounded-lg text-[#231815] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B1E24]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#8B1E24] text-white text-sm font-semibold rounded-xl hover:bg-[#70161B] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Saving & Syncing RSVP...'
                  : lang === 'hi'
                    ? 'उपस्थिति एवं आशीर्वाद भेजें (Submit RSVP)'
                    : 'Submit RSVP & Sync to Sheet'}
              </span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Google Sheets Sync Control + Guest Wall (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google Sheets Live Sync Panel */}
          <div className="bg-[#F3ECE1] border border-[#E4D5C3] rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-[#7C2D12]">
                  Google Workspace Live Integration
                </div>
                <h3 className="font-serif-display text-2xl font-semibold text-[#231815] mt-0.5 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Live Google Sheets Sync</span>
                </h3>
              </div>
              {user && (
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="inline-flex items-center gap-1 text-xs text-[#57463F] hover:text-[#231815] px-2.5 py-1 rounded border border-[#D5C3AE] bg-white whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            <p className="text-xs text-[#57463F] mt-2 leading-relaxed">
              Connect your Google account to automatically create or link a live
              Google Spreadsheet for Mampi &amp; Durgesh&apos;s wedding guest
              list.
            </p>

            {sheetErrorMsg && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs">
                {sheetErrorMsg}
              </div>
            )}

            {sheetStatusMsg && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                {sheetStatusMsg}
              </div>
            )}

            {/* Auth State: Official Sign in with Google button if needsAuth */}
            {needsAuth ? (
              <div className="mt-5 pt-4 border-t border-[#E4D5C3] flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        style={{ display: 'block' }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isLoggingIn
                        ? 'Connecting Google Sheets...'
                        : 'Sign in with Google'}
                    </span>
                    <span style={{ display: 'none' }}>Sign in with Google</span>
                  </div>
                </button>
                <span className="text-xs text-[#57463F]">
                  Sign in to create a dedicated Wedding RSVP Google Sheet or
                  link an existing spreadsheet.
                </span>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-[#E4D5C3] space-y-4">
                <div className="text-xs text-[#57463F]">
                  Connected as{' '}
                  <span className="font-semibold text-[#231815]">
                    {user?.email || user?.displayName || 'Google User'}
                  </span>
                </div>

                {sheetMeta ? (
                  <div className="p-3.5 rounded-xl bg-white border border-[#D5C3AE] space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-[#231815]">
                          {sheetMeta.title}
                        </p>
                        <p className="text-xs text-[#57463F] font-mono-num mt-0.5">
                          Active Tab: {sheetMeta.firstSheetTitle} · Unsynced
                          local rows: {unsyncedCount}
                        </p>
                      </div>
                      <a
                        href={sheetMeta.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
                      >
                        <span>Open Sheet</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F3ECE1]">
                      <button
                        type="button"
                        disabled={isSyncingSheet}
                        onClick={requestPushUnsyncedToSheet}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${
                            isSyncingSheet ? 'animate-spin' : ''
                          }`}
                        />
                        <span>Sync Pending ({unsyncedCount})</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSyncingSheet}
                        onClick={handleRefreshFromSheet}
                        className="px-3 py-1.5 text-xs font-medium bg-[#FAF6F0] text-[#231815] border border-[#D5C3AE] rounded-lg hover:bg-[#F3ECE1] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                      >
                        <span>Pull from Sheet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowConnectInput((v) => !v)}
                        className="px-3 py-1.5 text-xs font-medium text-[#7C2D12] hover:underline whitespace-nowrap shrink-0"
                      >
                        Change Sheet
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isSyncingSheet}
                      onClick={handleCreateNewSheet}
                      className="px-3.5 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>
                        {isSyncingSheet
                          ? 'Creating Sheet...'
                          : 'Create New Wedding RSVP Sheet'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowConnectInput((v) => !v)}
                      className="px-3.5 py-2 text-xs font-medium bg-white text-[#231815] border border-[#D5C3AE] rounded-lg hover:bg-[#FAF6F0] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Link2 className="w-4 h-4 text-[#8B1E24]" />
                      <span>Link Existing Sheet</span>
                    </button>
                  </div>
                )}

                {showConnectInput && (
                  <form
                    onSubmit={handleConnectExistingSheet}
                    className="p-3.5 rounded-xl bg-white border border-[#D5C3AE] space-y-2.5"
                  >
                    <label
                      htmlFor="sheet-url-input"
                      className="block text-xs font-semibold text-[#231815]"
                    >
                      Paste Google Sheet URL or Spreadsheet ID
                    </label>
                    <input
                      id="sheet-url-input"
                      type="text"
                      value={sheetInputUrl}
                      onChange={(e) => setSheetInputUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#D5C3AE] rounded-lg text-[#231815]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isSyncingSheet}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#8B1E24] text-white rounded-lg hover:bg-[#70161B]"
                      >
                        Connect Sheet
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConnectInput(false)}
                        className="px-3 py-1.5 text-xs text-[#57463F] hover:text-[#231815]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Always-available CSV export */}
            <div className="mt-4 pt-3 border-t border-[#E4D5C3] flex items-center justify-between text-xs text-[#57463F]">
              <span className="font-mono-num">
                {rsvps.length} Responses · {totalAttendingGuests} Guests
              </span>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1 font-semibold text-[#8B1E24] hover:underline whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Live Guest Blessings & RSVP Feed */}
          <div className="bg-[#F3ECE1] border border-[#E4D5C3] rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-serif-display text-xl font-semibold text-[#231815]">
                {lang === 'hi'
                  ? 'परिवार एवं अतिथियों के आशीर्वाद'
                  : 'Recent RSVPs & Family Blessings'}
              </h3>

              {/* Interactive Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#E8DEC8] rounded-lg">
                <button
                  type="button"
                  onClick={() => setSideFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    sideFilter === 'all'
                      ? 'bg-white text-[#231815] shadow-xs'
                      : 'text-[#57463F] hover:text-[#231815]'
                  }`}
                >
                  All ({rsvps.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSideFilter('bride')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    sideFilter === 'bride'
                      ? 'bg-white text-[#231815] shadow-xs'
                      : 'text-[#57463F] hover:text-[#231815]'
                  }`}
                >
                  Bride&apos;s Side
                </button>
                <button
                  type="button"
                  onClick={() => setSideFilter('groom')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    sideFilter === 'groom'
                      ? 'bg-white text-[#231815] shadow-xs'
                      : 'text-[#57463F] hover:text-[#231815]'
                  }`}
                >
                  Groom&apos;s Side
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredRsvps.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E4D5C3]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-[#231815]">
                      {item.guestName}
                    </h4>
                    <span className="text-xs font-mono-num text-[#7C2D12] whitespace-nowrap shrink-0">
                      {item.attendance === 'joyfully_attending'
                        ? `${item.guestCount} ${
                            item.guestCount === 1 ? 'Guest' : 'Guests'
                          }`
                        : 'Wishes Sent'}
                    </span>
                  </div>

                  {/* Unboxed Metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#57463F] mt-1">
                    <span>
                      {item.side === 'bride'
                        ? "Bride's Side (Mampi)"
                        : item.side === 'groom'
                          ? "Groom's Side (Durgesh)"
                          : 'Both Families'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">{item.submittedAt}</span>
                    {item.syncedToSheet && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-800 font-medium">
                          Synced to Sheet
                        </span>
                      </>
                    )}
                  </div>

                  {item.message && (
                    <p className="text-xs sm:text-sm text-[#231815] mt-2.5 italic leading-relaxed">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
