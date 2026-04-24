/* Paloma — animated scene.
   Timeline (seconds):
   0.0 – 2.0   Evidence file: hover state, user taps FAB
   2.0 – 6.0   Courage log bottom sheet slides up, text types into "What happened"
   6.0 – 7.0   "Tell Paloma" pressed; screen transition to Paloma response
   7.0 – 14.0  Typewriter reflection
   14.0 – 20.0 Breath ring pause (4s inhale/exhale cycle); "I felt it" fades in at 19.0
   20.0 – 23.0 Celebration screen: halo, "Added to your evidence file", count 7→8
   23.0 – 28.0 Return to evidence file: new entry drops in at top, list reflows
*/

const C = {
  bgCanvas: '#102A43',
  bgBase: '#243B53',
  bgSurface: '#334E68',
  bgElev: '#3E4C59',
  border: '#627D98',
  purple900: '#240754',
  purple700: '#653CAD',
  purple500: '#9B7DD4',
  purple300: '#B8A2E3',
  purple50:  '#EAE2F8',
  blue500: '#1992D4',
  blue400: '#47A3F3',
  blue300: '#7CC4FA',
  coral:   '#D85A30',
  textPri: '#F0F4F8',
  textMut: '#9FB3C8',
  textSub: '#627D98',
  textAcc: '#47A3F3',
};

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// Phone frame centered in 1280x720 canvas
const PHONE_W = 390;
const PHONE_H = 720;      // slightly taller to fill the stage
const PHONE_X = (1280 - PHONE_W) / 2;
const PHONE_Y = (720 - PHONE_H) / 2;

// ─────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{
      height: 36,
      padding: '0 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: 13, fontWeight: 700, color: C.textPri,
      fontFamily: SANS,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="2" width="2" height="6" rx="1"/>
          <rect x="4" y="1" width="2" height="7" rx="1"/>
          <rect x="8" y="0" width="2" height="8" rx="1"/>
          <rect x="12" y="-1" width="2" height="10" rx="1"/>
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor">
          <rect x="0.5" y="0.5" width="18" height="9" rx="2"/>
          <rect x="2" y="2" width="13" height="6" rx="1" fill="currentColor"/>
          <rect x="20" y="3" width="1.5" height="4" rx="0.5" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
}

function PalomaMark({ size = 13 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: C.purple500,
        boxShadow: `0 0 14px ${C.purple500}99`,
      }}/>
      <span style={{
        fontFamily: SANS,
        fontSize: size,
        letterSpacing: '0.14em',
        color: C.textAcc,
        fontWeight: 400,
      }}>paloma.ai</span>
    </div>
  );
}

function EntryCard({ type, body, reflect, date, expanded = false, width = '100%' }) {
  const borderColor = type === 'belief-shift' ? C.blue500
                     : type === 'witnessed'   ? C.coral
                     : C.purple500;
  const kindLabel = type === 'belief-shift' ? 'Belief shift'
                   : type === 'witnessed'   ? 'Witnessed moment'
                   : 'Courage act';
  const kindColor = type === 'belief-shift' ? C.blue300
                   : type === 'witnessed'   ? C.coral
                   : C.purple500;
  return (
    <div style={{
      position: 'relative',
      background: C.bgBase,
      borderRadius: 14,
      padding: '14px 14px 14px 18px',
      width,
      boxSizing: 'border-box',
      fontFamily: SANS,
      color: C.textPri,
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 12, bottom: 12,
        width: 3, borderRadius: 2, background: borderColor,
      }}/>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 7,
      }}>
        <span style={{
          fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
          fontWeight: 700, color: kindColor,
        }}>{kindLabel}</span>
        <span style={{ fontSize: 11, color: C.textSub }}>{date}</span>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{body}</div>
      {expanded && reflect && (
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: '1px dashed rgba(98,125,152,0.25)',
        }}>
          <div style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: 13, lineHeight: 1.5,
            color: C.purple50,
            paddingLeft: 12,
            borderLeft: `2px solid ${C.purple500}66`,
          }}>
            {reflect}
            <div style={{
              fontFamily: SANS, fontStyle: 'normal',
              fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: C.textSub, marginTop: 6, fontWeight: 700,
            }}>— Paloma</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Phone shell + scene
// ─────────────────────────────────────────────────────────────────

function PhoneShell({ children }) {
  return (
    <div style={{
      position: 'absolute',
      left: PHONE_X, top: PHONE_Y,
      width: PHONE_W, height: PHONE_H,
      background: C.bgCanvas,
      borderRadius: 38,
      overflow: 'hidden',
      boxShadow: `0 0 0 1px ${C.border}40, 0 40px 100px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.4)`,
    }}>
      {children}
    </div>
  );
}

// Sample entries (from the prototype)
const ENTRIES = [
  { id: 5, type: 'courage-act',  body: "Sent the email I'd been drafting for two weeks. Hit send before I could talk myself out of it.", reflect: "You didn't wait until it was perfect. That's the thing you said you never do.", date: '3 days ago' },
  { id: 4, type: 'belief-shift', body: "Realized I was waiting for permission to take up space in the meeting. Then I stopped waiting.", reflect: "Something shifted in how you see yourself in that room. That's not small.", date: '1 week ago' },
  { id: 3, type: 'courage-act',  body: "Had the conversation with my manager I'd been avoiding for six weeks.", reflect: "Six weeks of avoiding and then you just did it.", date: '2 weeks ago' },
  { id: 2, type: 'witnessed',    body: "My colleague said she always feels heard when she talks to me.", reflect: "You almost let that slide past. You didn't this time.", date: '3 weeks ago' },
];

const NEW_ENTRY = {
  type: 'courage-act',
  body: "Asked for the raise. Said the number out loud.",
  reflect: "You said the number. Not a softer version of it. The number.",
  date: 'Just now',
};

// ─────────────────────────────────────────────────────────────────
// SCENE 1 — Evidence file (0–6s, and return at 23–28s)
// ─────────────────────────────────────────────────────────────────

function EvidenceFile({ newEntryProgress = 0, fabPressed = 0, sheetProgress = 0 }) {
  // newEntryProgress: 0..1, slot-in animation of the new top entry
  const newY = (1 - newEntryProgress) * -80;
  const newOp = newEntryProgress;
  const existingPush = newEntryProgress * 88; // px to push old entries down

  const fabScale = 1 - fabPressed * 0.1;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: C.bgCanvas,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <StatusBar/>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '4px 22px 8px' }}>
          <div style={{
            fontFamily: SANS, fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: C.textAcc, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: C.purple500, boxShadow: `0 0 10px ${C.purple500}aa`,
            }}/>
            paloma.ai
          </div>
          <h1 style={{
            fontFamily: SERIF, fontWeight: 500,
            fontSize: 27, lineHeight: 1.15,
            margin: '5px 0 5px', color: C.textPri,
            letterSpacing: '-0.01em',
          }}>Your evidence file</h1>
          <div style={{ fontSize: 13, color: C.textMut, fontFamily: SANS }}>
            <b style={{
              color: newEntryProgress > 0.3 ? C.purple300 : C.purple300,
              fontWeight: 700,
              transition: 'color 0.3s',
            }}>{newEntryProgress > 0.6 ? '8' : '7'} acts of courage</b>
            <span> · building since April</span>
          </div>
        </div>

        {/* Belief pill */}
        <div style={{ padding: '12px 22px 6px' }}>
          <div style={{
            fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: C.textSub, marginBottom: 7, fontWeight: 700,
            fontFamily: SANS,
          }}>Belief we're shifting</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 13px',
            border: `1px solid ${C.coral}66`,
            background: `${C.coral}14`,
            borderRadius: 999,
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: 14, color: C.textPri,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: C.coral,
              boxShadow: `0 0 10px ${C.coral}aa`,
            }}/>
            <span style={{
              textDecoration: 'line-through',
              textDecorationColor: `${C.purple500}66`,
            }}>I don't belong here.</span>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{
          display: 'flex', gap: 6,
          padding: '12px 22px 10px',
          overflow: 'hidden',
        }}>
          {['All', 'Courage', 'Belief', 'Witnessed'].map((f, i) => (
            <div key={f} style={{
              padding: '6px 10px', borderRadius: 999,
              background: i === 0 ? C.textPri : 'transparent',
              color: i === 0 ? C.bgCanvas : C.textMut,
              border: i === 0 ? `1px solid ${C.textPri}` : `1px solid ${C.border}`,
              fontSize: 11, fontFamily: SANS,
              fontWeight: i === 0 ? 700 : 400,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>{f}</div>
          ))}
        </div>

        {/* Entry list */}
        <div style={{
          padding: '4px 22px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
          position: 'relative',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden',
        }}>
          {/* New entry slotting in at top */}
          {newEntryProgress > 0.01 && (
            <div style={{
              opacity: newOp,
              transform: `translateY(${newY}px)`,
              filter: newEntryProgress < 0.95 ? `drop-shadow(0 8px 22px rgba(155,125,212,${0.5 * (1 - newEntryProgress)}))` : 'none',
            }}>
              <div style={{
                position: 'relative',
                borderRadius: 14,
                padding: 2,
                boxSizing: 'border-box',
                background: newEntryProgress < 1
                  ? `linear-gradient(180deg, ${C.purple500}aa, transparent)`
                  : 'transparent',
              }}>
                <EntryCard
                  type={NEW_ENTRY.type}
                  body={NEW_ENTRY.body}
                  reflect={NEW_ENTRY.reflect}
                  date={NEW_ENTRY.date}
                  expanded={false}
                />
              </div>
            </div>
          )}

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            transition: 'none',
          }}>
            {ENTRIES.slice(0, 3).map(e => (
              <EntryCard key={e.id} type={e.type} body={e.body} reflect={e.reflect} date={e.date} />
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div style={{
        position: 'absolute',
        bottom: 22, right: 22,
        width: 56, height: 56, borderRadius: '50%',
        background: C.purple500, color: '#1a0f2e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 30, fontWeight: 300, fontFamily: SANS,
        boxShadow: `0 12px 28px ${C.purple700}80, 0 2px 6px rgba(0,0,0,0.3)`,
        transform: `scale(${fabScale})`,
        transition: 'transform 0.12s ease',
      }}>+</div>

      {/* Backdrop for bottom sheet */}
      {sheetProgress > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(16,42,67,${0.55 * sheetProgress})`,
          backdropFilter: `blur(${4 * sheetProgress}px)`,
          pointerEvents: 'none',
        }}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Bottom sheet (courage log)
// ─────────────────────────────────────────────────────────────────

function BottomSheet({ progress, typedText, buttonEnabled, buttonPressed }) {
  // progress 0..1 maps to translateY 100% -> 0
  const ty = (1 - progress) * 100;

  const btnScale = 1 - buttonPressed * 0.04;

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: C.bgBase,
      borderRadius: '26px 26px 0 0',
      padding: '8px 22px 22px',
      transform: `translateY(${ty}%)`,
      boxShadow: '0 -20px 60px rgba(0,0,0,0.4)',
      maxHeight: '86%',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 40, height: 4, background: C.border, borderRadius: 2,
        margin: '6px auto 12px', opacity: 0.6,
      }}/>
      <h3 style={{
        fontFamily: SERIF, fontSize: 22, fontWeight: 500,
        color: C.textPri, marginBottom: 4,
        letterSpacing: '-0.01em',
      }}>What happened?</h3>
      <p style={{
        fontFamily: SANS, fontSize: 12.5, color: C.textMut,
        marginBottom: 18,
      }}>Small counts. Paloma will witness it. Only you will see the file.</p>

      {/* What happened */}
      <FieldBlock
        label="Tell me what you did"
        required
        value={typedText}
        showCaret={typedText.length > 0 && typedText.length < 44}
      />
      <FieldBlock label="What did it cost you?" optional value="" />
      <FieldBlock label="What does it say about you?" optional value="" />

      <div style={{
        padding: '14px 18px',
        borderRadius: 12,
        background: buttonEnabled ? C.purple500 : `${C.purple500}55`,
        color: '#1a0f2e',
        textAlign: 'center',
        fontFamily: SANS, fontSize: 14, fontWeight: 700,
        letterSpacing: '0.02em',
        transform: `scale(${btnScale})`,
        transition: 'transform 0.1s, background 0.25s',
        marginTop: 4,
      }}>Tell Paloma</div>
      <div style={{
        padding: '12px 18px',
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        color: C.textMut,
        textAlign: 'center',
        fontFamily: SANS, fontSize: 13, fontWeight: 400,
        marginTop: 8,
      }}>Not now</div>
    </div>
  );
}

function FieldBlock({ label, required, optional, value, showCaret }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        fontSize: 12, color: C.textMut, marginBottom: 5, fontFamily: SANS,
      }}>
        <span>{label}</span>
        <span style={{
          fontSize: 9.5, color: C.textSub,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{required ? 'Required' : 'Optional'}</span>
      </div>
      <div style={{
        borderBottom: `1px solid ${value ? C.purple500 : C.border}`,
        padding: '6px 2px',
        minHeight: 28,
        fontFamily: SANS, fontSize: 14,
        color: value ? C.textPri : C.textSub,
        transition: 'border-color 0.2s',
      }}>
        {value || (required ? 'I…' : '')}
        {showCaret && (
          <span style={{
            display: 'inline-block',
            width: 1.5, height: 14,
            background: C.purple300,
            marginLeft: 2,
            verticalAlign: '-2px',
            animation: 'palomaBlink 0.9s steps(2, end) infinite',
          }}/>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Paloma response screen
// ─────────────────────────────────────────────────────────────────

function PalomaResponse({ typedReflect, showRing, ringProgress, ctaOpacity }) {
  // ringProgress 0..1 maps a single breathe cycle (0.45 -> 1 -> 0.45)
  // We drive a sin wave between small & large
  const scale = 0.45 + 0.55 * (0.5 - 0.5 * Math.cos(ringProgress * Math.PI * 2));
  const ringOpacity = 0.15 + 0.55 * (0.5 - 0.5 * Math.cos(ringProgress * Math.PI * 2));
  const scale2 = 0.45 + 0.55 * (0.5 - 0.5 * Math.cos((ringProgress + 0.5) * Math.PI * 2));
  const ringOp2 = 0.1 + 0.35 * (0.5 - 0.5 * Math.cos((ringProgress + 0.5) * Math.PI * 2));

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.bgCanvas,
      padding: '46px 24px 24px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start',
    }}>
      <div style={{ marginBottom: 20 }}>
        <PalomaMark size={12}/>
      </div>

      <div style={{
        fontFamily: SERIF, fontStyle: 'italic',
        fontSize: 23, lineHeight: 1.35,
        color: C.textPri,
        minHeight: '5em',
        letterSpacing: '-0.005em',
      }}>
        {typedReflect}
        {typedReflect.length > 0 && !showRing && (
          <span style={{
            display: 'inline-block',
            width: 2, height: '0.9em',
            background: C.purple300,
            marginLeft: 3,
            verticalAlign: '-2px',
            animation: 'palomaBlink 0.9s steps(2, end) infinite',
          }}/>
        )}
      </div>

      <div style={{
        flex: 1, width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: showRing ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        <div style={{
          position: 'relative',
          width: 120, height: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1px solid ${C.purple500}cc`,
            background: `radial-gradient(circle, ${C.purple500}40 0%, ${C.purple500}00 70%)`,
            transform: `scale(${scale})`,
            opacity: ringOpacity,
          }}/>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1px solid ${C.purple500}aa`,
            background: `radial-gradient(circle, ${C.purple500}30 0%, ${C.purple500}00 70%)`,
            transform: `scale(${scale2})`,
            opacity: ringOp2,
          }}/>
          <div style={{
            position: 'absolute', inset: '46%', borderRadius: '50%',
            background: C.purple500,
            opacity: 0.95,
          }}/>
        </div>
        <div style={{
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 13.5, color: C.textMut,
          textAlign: 'center',
          maxWidth: 240,
        }}>Take a moment. Let that land.</div>
      </div>

      <div style={{
        width: '100%', opacity: ctaOpacity,
        transform: `translateY(${(1 - ctaOpacity) * 8}px)`,
        transition: 'opacity 0.6s, transform 0.6s',
        marginTop: 12,
      }}>
        <div style={{
          padding: '14px 18px',
          borderRadius: 12,
          background: C.purple500, color: '#1a0f2e',
          textAlign: 'center',
          fontFamily: SANS, fontSize: 14, fontWeight: 700,
          letterSpacing: '0.02em',
        }}>I felt it</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Celebration screen
// ─────────────────────────────────────────────────────────────────

function Celebration({ entryProgress }) {
  // entryProgress 0..1 for text reveal sequence
  const e1 = clamp(entryProgress / 0.18, 0, 1);  // eyebrow
  const e2 = clamp((entryProgress - 0.18) / 0.22, 0, 1); // headline
  const e3 = clamp((entryProgress - 0.4) / 0.2, 0, 1); // count
  const e4 = clamp((entryProgress - 0.55) / 0.2, 0, 1); // counter-beliefs
  const e5 = clamp((entryProgress - 0.75) / 0.25, 0, 1); // cta
  const halo = clamp(entryProgress / 0.3, 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.bgCanvas,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 24,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        width: 480, height: 480, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.purple500}40, ${C.purple500}00 60%)`,
        top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * halo})`,
        opacity: halo,
      }}/>

      <div style={{
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: C.textSub, fontWeight: 700, marginBottom: 16,
        fontFamily: SANS,
        opacity: e1, transform: `translateY(${(1 - e1) * 12}px)`,
      }}>Evidence saved</div>

      <h2 style={{
        fontFamily: SERIF, fontWeight: 500,
        fontSize: 34, lineHeight: 1.15,
        color: C.textPri, maxWidth: 300, marginBottom: 20,
        letterSpacing: '-0.01em',
        opacity: e2, transform: `translateY(${(1 - e2) * 12}px)`,
        transition: 'opacity 0.2s',
      }}>Added to your evidence file.</h2>

      <div style={{
        fontFamily: SERIF, fontSize: 21,
        color: C.purple300, marginBottom: 10,
        opacity: e3, transform: `translateY(${(1 - e3) * 12}px)`,
      }}>8 acts of courage</div>

      <div style={{
        fontFamily: SANS, fontSize: 12.5, color: C.textMut,
        maxWidth: 280, marginBottom: 36,
        lineHeight: 1.6,
        opacity: e4, transform: `translateY(${(1 - e4) * 12}px)`,
      }}>
        Counts against the belief<br/>
        <span style={{
          color: C.textPri, fontStyle: 'italic',
          fontFamily: SERIF, fontSize: 14,
        }}>"I don't belong here."</span>
      </div>

      <div style={{
        width: '100%', maxWidth: 310,
        opacity: e5, transform: `translateY(${(1 - e5) * 12}px)`,
      }}>
        <div style={{
          padding: '14px 18px',
          borderRadius: 12,
          background: C.blue500, color: '#041426',
          textAlign: 'center',
          fontFamily: SANS, fontSize: 14, fontWeight: 700,
          letterSpacing: '0.02em',
        }}>Back to my evidence file</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Scene captions (side narration)
// ─────────────────────────────────────────────────────────────────

function Caption({ start, end, title, body }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const inT = clamp(localTime / 0.5, 0, 1);
        const outT = clamp((duration - localTime) / 0.5, 0, 1);
        const op = Math.min(inT, outT);
        return (
          <div style={{
            position: 'absolute',
            left: 48, top: 180,
            maxWidth: 260,
            opacity: op,
            transform: `translateY(${(1 - inT) * 8}px)`,
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.purple300, fontWeight: 700,
              marginBottom: 10,
            }}>{title}</div>
            <div style={{
              fontFamily: SERIF, fontStyle: 'italic',
              fontSize: 20, lineHeight: 1.35,
              color: C.textPri,
              letterSpacing: '-0.005em',
            }}>{body}</div>
          </div>
        );
      }}
    </Sprite>
  );
}

function TimestampHud() {
  const t = useTime();
  const chapter =
    t < 2  ? '01 · Evidence file' :
    t < 6  ? '02 · Logging an act' :
    t < 7  ? '03 · Sending it' :
    t < 14 ? '04 · Paloma reflects' :
    t < 20 ? '05 · The pause' :
    t < 23 ? '06 · Added to the file' :
             '07 · Return to evidence';
  return (
    <div style={{
      position: 'absolute',
      left: 48, top: 48,
      fontFamily: SANS, fontSize: 10,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color: C.textSub, fontWeight: 700,
      textAlign: 'left',
      whiteSpace: 'nowrap',
    }}>
      <div style={{ color: C.textAcc, marginBottom: 6 }}>paloma.ai · evidence flow</div>
      <div>{chapter}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// The big scene. One phone. State driven by useTime().
// ─────────────────────────────────────────────────────────────────

function PalomaScene() {
  const t = useTime();

  // ── timing ──
  const SHEET_OPEN_START = 2.0;
  const SHEET_OPEN_END = 2.6;
  const TYPE_START = 2.9;
  const TYPE_END = 5.6;
  const BTN_PRESS = 6.0;
  const SHEET_CLOSE_END = 6.4;
  const RESPONSE_START = 6.2;
  const REFLECT_START = 7.0;
  const REFLECT_END = 13.5;
  const BREATH_START = 14.0;
  const BREATH_END = 20.0;
  const CTA_IN = 19.0;
  const CELEB_START = 20.2;
  const CELEB_END = 23.0;
  const RETURN_START = 23.0;
  const ENTRY_SLOT_START = 23.8;
  const ENTRY_SLOT_END = 25.6;
  const FADE_TO_BLACK_START = 25.6;
  const FADE_TO_BLACK_END = 26.6;
  const BLACK_HOLD_END = 28.6;

  // ── screen selection (which is fully visible) ──
  // response screen lives from RESPONSE_START to CELEB_START
  // celebration from CELEB_START to RETURN_START
  // evidence file otherwise

  // Crossfade between screens using opacity
  const evidenceOp =
    t < RESPONSE_START ? 1 :
    t < RESPONSE_START + 0.5 ? 1 - (t - RESPONSE_START) / 0.5 :
    t < RETURN_START - 0.2 ? 0 :
    t < RETURN_START + 0.4 ? clamp((t - (RETURN_START - 0.2)) / 0.6, 0, 1) :
    1;

  const responseOp =
    t < RESPONSE_START ? 0 :
    t < RESPONSE_START + 0.5 ? (t - RESPONSE_START) / 0.5 :
    t < CELEB_START - 0.3 ? 1 :
    t < CELEB_START + 0.4 ? clamp(1 - (t - (CELEB_START - 0.3)) / 0.7, 0, 1) :
    0;

  const celebOp =
    t < CELEB_START - 0.3 ? 0 :
    t < CELEB_START + 0.4 ? clamp((t - (CELEB_START - 0.3)) / 0.7, 0, 1) :
    t < RETURN_START - 0.2 ? 1 :
    t < RETURN_START + 0.4 ? clamp(1 - (t - (RETURN_START - 0.2)) / 0.6, 0, 1) :
    0;

  // Sheet progress
  const sheetProgress =
    t < SHEET_OPEN_START ? 0 :
    t < SHEET_OPEN_END ? Easing.easeOutCubic((t - SHEET_OPEN_START) / (SHEET_OPEN_END - SHEET_OPEN_START)) :
    t < BTN_PRESS ? 1 :
    t < SHEET_CLOSE_END ? 1 - Easing.easeInCubic((t - BTN_PRESS) / (SHEET_CLOSE_END - BTN_PRESS)) :
    0;

  // Typed text in bottom sheet
  const typeTarget = "Asked for the raise. Said the number out loud.";
  const typedChars = t < TYPE_START ? 0 :
                     t < TYPE_END ? Math.floor(((t - TYPE_START) / (TYPE_END - TYPE_START)) * typeTarget.length) :
                     typeTarget.length;
  const typedText = typeTarget.slice(0, typedChars);
  const buttonEnabled = typedChars > 2;
  const buttonPressed = (t >= BTN_PRESS - 0.1 && t < BTN_PRESS + 0.25) ? 1 : 0;

  // FAB press around 1.9s
  const fabPressed = (t >= 1.85 && t < 2.1) ? 1 : 0;

  // Reflect typewriter
  const reflectFull = "You said the number. Not a softer version of it. The number. That's the thing you told me you'd never ask for.";
  const reflectChars = t < REFLECT_START ? 0 :
                       t < REFLECT_END ? Math.floor(((t - REFLECT_START) / (REFLECT_END - REFLECT_START)) * reflectFull.length) :
                       reflectFull.length;
  const typedReflect = reflectFull.slice(0, reflectChars);

  // Breath ring
  const showRing = t >= BREATH_START - 0.2;
  // Two full breath cycles over BREATH_END - BREATH_START seconds (so ~3s per cycle)
  const breathCycleLen = 4.0;
  const ringProgress = t < BREATH_START ? 0 :
    ((t - BREATH_START) / breathCycleLen) % 1;

  // CTA fades in at CTA_IN
  const ctaOpacity = t < CTA_IN ? 0 : clamp((t - CTA_IN) / 0.8, 0, 1);

  // Celebration progress
  const celebProgress = t < CELEB_START ? 0 :
                        t < CELEB_END ? (t - CELEB_START) / (CELEB_END - CELEB_START) : 1;

  // New entry slot progress in returned evidence file
  const slotProgress = t < ENTRY_SLOT_START ? 0 :
                       t < ENTRY_SLOT_END ? Easing.easeOutCubic((t - ENTRY_SLOT_START) / (ENTRY_SLOT_END - ENTRY_SLOT_START)) :
                       1;

  // Fade-to-black overlay: covers the whole stage after the entry docks, holds, then
  // the Stage loops back to t=0 (where overlay is 0 again, so we get a fade-back-in).
  const blackOp =
    t < FADE_TO_BLACK_START ? 0 :
    t < FADE_TO_BLACK_END ? Easing.easeInOutCubic((t - FADE_TO_BLACK_START) / (FADE_TO_BLACK_END - FADE_TO_BLACK_START)) :
    t < BLACK_HOLD_END ? 1 :
    1;

  // Fade-in from black at the very start of each loop (first 0.8s)
  const FADE_IN_END = 0.8;
  const fadeInOp = t < FADE_IN_END ? 1 - Easing.easeInOutCubic(t / FADE_IN_END) : 0;
  const overlayOp = Math.max(blackOp, fadeInOp);

  return (
    <>
      {/* Scene captions */}
      <Caption start={0.3} end={2.2}
        title="The file"
        body="Seven small acts of courage. Each one counts against a belief."/>
      <Caption start={2.4} end={5.8}
        title="Log"
        body="A user writes down something they just did. Small. Specific."/>
      <Caption start={7.3} end={13.3}
        title="Witness"
        body="Paloma reflects back what it saw — not praise, a specific observation."/>
      <Caption start={14.2} end={19.5}
        title="Pause"
        body="Four seconds in. Four seconds out. The moment isn't skippable."/>
      <Caption start={20.4} end={22.8}
        title="Evidence"
        body="The count updates. The accumulation is the point."/>
      <Caption start={23.4} end={25.4}
        title="Return"
        body="The file is longer than it was. One more piece of proof."/>

      <TimestampHud/>

      <PhoneShell>
        {/* Evidence file layer (bottom) */}
        <div style={{
          position: 'absolute', inset: 0, opacity: evidenceOp,
        }}>
          <EvidenceFile
            newEntryProgress={slotProgress}
            fabPressed={fabPressed}
            sheetProgress={sheetProgress}
          />
          {sheetProgress > 0 && (
            <BottomSheet
              progress={sheetProgress}
              typedText={typedText}
              buttonEnabled={buttonEnabled}
              buttonPressed={buttonPressed}
            />
          )}
        </div>

        {/* Paloma response layer */}
        {responseOp > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: responseOp }}>
            <PalomaResponse
              typedReflect={typedReflect}
              showRing={showRing}
              ringProgress={ringProgress}
              ctaOpacity={ctaOpacity}
            />
          </div>
        )}

        {/* Celebration layer */}
        {celebOp > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: celebOp }}>
            <Celebration entryProgress={celebProgress}/>
          </div>
        )}
      </PhoneShell>

      {/* Full-stage fade to black (covers phone, HUD, captions) */}
      {overlayOp > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#000',
          opacity: overlayOp,
          pointerEvents: 'none',
          zIndex: 100,
        }}/>
      )}
    </>
  );
}

Object.assign(window, { PalomaScene });
