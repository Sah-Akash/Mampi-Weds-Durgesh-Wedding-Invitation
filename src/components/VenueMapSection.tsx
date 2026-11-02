import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Train,
  Car,
  Compass,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { LanguageMode, WEDDING_CORE, WEDDING_IMAGES } from '../data/weddingData';

interface VenueMapSectionProps {
  lang: LanguageMode;
}

const VENUE_COORDS = WEDDING_CORE.venue.coordinates; // { lat: 24.1672621, lng: 87.7861147 }
const TARAPITH_TEMPLE_COORDS = { lat: 24.1139, lng: 87.7995 };
const RAMPURHAT_STATION_COORDS = { lat: 24.1756, lng: 87.7824 };

function VenueMarkers({ lang }: { lang: LanguageMode }) {
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={VENUE_COORDS}
        onClick={() => setInfoOpen(true)}
        title={WEDDING_CORE.venue.nameEn}
      >
        <Pin
          background="#8B1E24"
          borderColor="#F59E0B"
          glyphColor="#FAF6F0"
          scale={1.25}
        />
      </AdvancedMarker>

      <AdvancedMarker
        position={RAMPURHAT_STATION_COORDS}
        title="Rampurhat Junction Railway Station (RPH)"
      >
        <Pin
          background="#1E3A8A"
          borderColor="#93C5FD"
          glyphColor="#FFFFFF"
          scale={0.95}
        />
      </AdvancedMarker>

      {infoOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={280}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 text-left text-[#231815]">
            <p className="font-serif-display text-base font-bold text-[#8B1E24]">
              {WEDDING_CORE.venue.nameEn}
            </p>
            {(lang === 'bilingual' || lang === 'hi') && (
              <p className="text-xs font-medium text-[#7C2D12] mt-0.5">
                {WEDDING_CORE.venue.nameHi}
              </p>
            )}
            <p className="text-xs text-[#57463F] mt-1">
              {WEDDING_CORE.venue.addressEn}
            </p>
            <p className="text-xs font-mono-num text-[#8B1E24] font-medium mt-1.5">
              24.11.2026 · 7:00 PM Onwards
            </p>
            <a
              href={WEDDING_CORE.venue.googleMapsShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8B1E24] underline hover:text-[#6B141A]"
            >
              Open in Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export const VenueMapSection: React.FC<VenueMapSectionProps> = ({ lang }) => {
  const apiKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';
  const [mapMode, setMapMode] = useState<'sdk' | 'embed'>(
    apiKey ? 'sdk' : 'embed'
  );
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [venueImgError, setVenueImgError] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      `${WEDDING_CORE.venue.nameEn}, ${WEDDING_CORE.venue.addressEn} - ${WEDDING_CORE.venue.googleMapsShortUrl}`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section
      id="venue"
      className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E4D5C3]"
    >
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 text-xs text-[#7C2D12] font-medium tracking-wide">
          <span>02. Wedding Venue & Travel Guide</span>
          <span aria-hidden="true">·</span>
          <span>विवाह स्थल एवं मार्गदर्शिका</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">24.11.2026</span>
        </div>
        <h2
          className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#231815] mt-3 leading-tight"
          style={{ textWrap: 'balance' }}
        >
          {lang === 'hi'
            ? 'जय माँ तारा अनुष्ठान भवन, रामपुरहाट'
            : 'Jay Maa Tara Anusthan Bhawan, Rampurhat'}
        </h2>
        {(lang === 'bilingual' || lang === 'hi') && lang !== 'hi' && (
          <p className="font-serif-display text-xl sm:text-2xl text-[#8B1E24] mt-1">
            जय माँ तारा अनुष्ठान भवन · संघता पाड़ा, रामपुरहाट, बीरभूम
          </p>
        )}
        <p className="text-sm sm:text-base text-[#57463F] mt-3 leading-relaxed">
          {lang === 'hi'
            ? 'मुख्य विवाह समारोह मंगलवार, २४ नवम्बर २०२६ को संध्या ७:०० बजे से जय माँ तारा अनुष्ठान भवन, संघता पाड़ा, रामपुरहाट में संपन्न होगा। नीचे दिए गए मानचित्र से सीधा मार्ग प्राप्त करें।'
            : 'The grand wedding celebration on Tuesday, 24.11.2026 (7:00 PM Onwards) will take place at Jay Maa Tara Anusthan Bhawan in Sanghata Para, Rampurhat, Birbhum. Use the interactive map or direct Google Maps link below for turn-by-turn navigation.'}
        </p>
      </div>

      {/* 2-Column Split: Venue Details Card + Interactive Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Venue Overview & Landmarks */}
        <div className="lg:col-span-5 bg-[#F3ECE1] border border-[#E4D5C3] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Venue Photo */}
            <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden mb-6 border border-[#E4D5C3] bg-[#E8DEC8]">
              {!venueImgError ? (
                <img
                  src={WEDDING_IMAGES.venueHall}
                  alt="Jay Maa Tara Anusthan Bhawan wedding venue entrance in Rampurhat"
                  referrerPolicy="no-referrer"
                  onError={() => setVenueImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#8B1E24]/15 to-[#B45309]/15 p-6 text-center">
                  <MapPin className="w-8 h-8 text-[#8B1E24] mb-2" />
                  <span className="font-serif-display text-lg font-semibold text-[#231815]">
                    {WEDDING_CORE.venue.nameEn}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-4">
                <div className="text-white">
                  <p className="text-xs text-amber-200 font-mono-num">
                    24.11.2026 · 7:00 PM Onwards
                  </p>
                  <p className="font-serif-display text-xl font-semibold">
                    {WEDDING_CORE.venue.nameEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <div>
                <div className="text-xs text-[#7C2D12] font-medium">
                  {lang === 'hi' ? 'समारोह स्थल का पता' : 'Venue Address · पता'}
                </div>
                <p className="text-base font-semibold text-[#231815] mt-1">
                  {WEDDING_CORE.venue.nameEn}
                </p>
                <p className="text-sm text-[#57463F]">
                  {WEDDING_CORE.venue.addressEn}
                </p>
                {(lang === 'bilingual' || lang === 'hi') && (
                  <p className="text-sm text-[#7C2D12] mt-1">
                    {WEDDING_CORE.venue.nameHi}, {WEDDING_CORE.venue.addressHi}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E4D5C3] space-y-3 text-sm text-[#57463F]">
                <div className="flex items-start gap-3">
                  <Train className="w-4 h-4 text-[#8B1E24] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#231815]">
                      Rampurhat Junction (RPH):
                    </span>{' '}
                    <span className="font-mono-num">~1.5 km</span> (5 mins by
                    auto/toto or cab to Sanghata Para).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 text-[#8B1E24] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#231815]">
                      By Road (NH-14):
                    </span>{' '}
                    Easy access from Suri, Bolpur-Santiniketan, Dumka, and
                    Kolkata via NH-14.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Compass className="w-4 h-4 text-[#8B1E24] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#231815]">
                      Sacred Landmark Nearby:
                    </span>{' '}
                    Maa Tara Temple, Tarapith is{' '}
                    <span className="font-mono-num">~9 km</span> from the venue
                    (<span className="font-mono-num">
                      {TARAPITH_TEMPLE_COORDS.lat.toFixed(4)}°N,{' '}
                      {TARAPITH_TEMPLE_COORDS.lng.toFixed(4)}°E
                    </span>
                    ).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 mt-6 border-t border-[#E4D5C3] flex flex-wrap items-center gap-3">
            <a
              href={WEDDING_CORE.venue.googleMapsShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8B1E24] text-white text-sm font-medium rounded-lg hover:bg-[#70161B] transition-colors whitespace-nowrap shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>
                {lang === 'hi' ? 'गूगल मैप्स में खोलें' : 'Get Directions'}
              </span>
            </a>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#D5C3AE] text-[#231815] text-sm font-medium rounded-lg hover:bg-[#FAF6F0] transition-colors whitespace-nowrap shrink-0"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8B1E24]" />
                  <span>Copy Map Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Google Map Container */}
        <div className="lg:col-span-7 bg-[#F3ECE1] border border-[#E4D5C3] rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[460px]">
          {/* Map Top Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-serif-display text-xl font-semibold text-[#231815]">
                {lang === 'hi'
                  ? 'संघता पाड़ा, रामपुरहाट मानचित्र'
                  : 'Sanghata Para, Rampurhat Live Map'}
              </h3>
              <p className="text-xs text-[#57463F] font-mono-num">
                24.1673° N, 87.7861° E · Birbhum, West Bengal
              </p>
            </div>

            {/* Interactive View Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#E8DEC8] rounded-lg">
              <button
                type="button"
                onClick={() => setMapMode('embed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  mapMode === 'embed'
                    ? 'bg-white text-[#231815] shadow-xs'
                    : 'text-[#57463F] hover:text-[#231815]'
                }`}
              >
                Place Map View
              </button>
              <button
                type="button"
                onClick={() => setMapMode('sdk')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  mapMode === 'sdk'
                    ? 'bg-white text-[#231815] shadow-xs'
                    : 'text-[#57463F] hover:text-[#231815]'
                }`}
              >
                Interactive Pins
              </button>
            </div>
          </div>

          {/* Map Viewport (Explicit height per CF2) */}
          <div
            className="w-full flex-1 min-h-[360px] rounded-xl overflow-hidden border border-[#D5C3AE] bg-[#EAE0CE] relative"
            style={{ height: '380px' }}
          >
            {mapMode === 'sdk' && apiKey ? (
              <APIProvider
                apiKey={apiKey}
                libraries={['marker']}
                language={lang === 'hi' ? 'hi' : 'en'}
                region="IN"
              >
                <Map
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={VENUE_COORDS}
                  defaultZoom={15}
                  gestureHandling="cooperative"
                  style={{ width: '100%', height: '100%' }}
                >
                  <VenueMarkers lang={lang} />
                </Map>
              </APIProvider>
            ) : (
              <iframe
                title="Jay Maa Tara Anusthan Bhawan, Sanghata Para, Rampurhat Map"
                src="https://maps.google.com/maps?q=24.1672621,87.7861147+(Jay+Maa+Tara+Anusthan+Bhawan+Rampurhat)&z=16&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          {/* Map Footer Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#57463F]">
            <span>
              Official Venue Pin: Jay Maa Tara Anusthan Bhawan, Sanghata Para,
              Rampurhat
            </span>
            <a
              href={WEDDING_CORE.venue.googleMapsShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#8B1E24] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Open {WEDDING_CORE.venue.googleMapsShortUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
