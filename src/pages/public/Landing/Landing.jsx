import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";


const features = [
  {
    img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307047/Unlock_your_potential_with_every_drop_of_sweat__Embrace_the_grind_push_your_limits_and_rise_stronger_with_Beldt_Labs_by_your_side.__.___lrqdxt.jpg",
    imgAlt: "Person doing a workout",
    icon: "⚡",
    title: "Adaptive AI Workouts",
    desc: "Your plan adjusts in real-time to your energy, schedule, and progress. Every session is uniquely built for you.",
    tall: true,
  },
  {
    img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307130/Healthy_Grilled_Chicken_Rice_Bowl_2026_High_Protein_Clean_Eating_Meal_pdsywj.jpg",
    imgAlt: "Healthy Nepali meal",
    icon: "🥗",
    title: "Smart Nutrition Plans",
    desc: "Calorie targets, macro splits, and full meal plans built around your goal, diet type, and Nepali food preferences.",
    tall: false,
  },
  {
    img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307234/baki_iqgyn4.jpg",
    imgAlt: "Progress tracking chart",
    icon: "📈",
    title: "Progress Tracking",
    desc: "Visual charts, streak counters, and milestone achievements that keep you motivated week after week.",
    tall: false,
  },
];

const steps = [
  {
    num: "01",
    emoji: "👤",
    img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307315/Thomas_Roccia_fr0gger__on_X_frl7bn.jpg",
    title: "Build your profile",
    desc: "Share your goals, fitness level, and dietary preferences. Takes under 3 minutes.",
  },
  {
    num: "02",
    emoji: "⚡",
    img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307382/AI_Post_hq9i1m.jpg",
    title: "Get your AI plan",
    desc: "A personalised workout schedule and nutrition plan, designed for your life — generated instantly.",
  },
  {
    num: "03",
    emoji: "📈",
    img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307421/Technology_tracks_your_progress_but_only_your_determination_powers_the_journey_bkv0h1.jpg",
    title: "Track and evolve",
    desc: "Log sessions, watch your progress, and let the AI refine your plan every week.",
  },
];

const testimonials = [
  {
    quote:
      "FitMitra felt like having a personal trainer AND nutritionist in my pocket. The AI adapts before I even realise I need it.",
    result: "−14 kg",
    name: "Priya Sharma",
    role: "5 months · Weight loss",
    initials: "PS",
    avatar: "/images/avatar-priya.jpg",
  },
  {
    quote:
      "The macro-tracking is insanely accurate. Five apps before this — none came close to this level of personalisation.",
    result: "+8 kg muscle",
    name: "Arjun Mehta",
    role: "Lean muscle gain",
    initials: "AM",
    avatar: "/images/avatar-arjun.jpg",
  },
  {
    quote:
      "Couch to half-marathon in 16 weeks. The streak feature carried me through the hardest days when I wanted to quit.",
    result: "21 km done",
    name: "Neha Kapoor",
    role: "Marathon finisher",
    initials: "NK",
    avatar: "/images/avatar-neha.jpg",
  },
];

const gallery = [
  { img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307478/Mais_conte%C3%BAdos_como_esse__Instagram__oleal_7_TikTok__oleal_7_A_jornada_continua_l%C3%A1__crxp6g.jpg", alt: "Outdoor running in Kathmandu" },
  { img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307597/download_4_s7uoaq.jpg", alt: "Home workout session" },
  { img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307636/Paleo_Grilled_Chicken_Cobb_Salad_ebdgep.jpg", alt: "Healthy meal prep" },
  { img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307740/My-project-2022-03-02T100307.695_mhvzj4.webp", alt: "Yoga and stretching" },
  { img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307784/Podcast_187__Improving_Strength_Durability_With_the_Kabuki_Movement_System_zrga26.jpg", alt: "Weight training" },
  { img: "https://res.cloudinary.com/dir5oumz5/image/upload/v1775307822/Stronger_Together_dx06mf.jpg", alt: "Community workout" },
];

const stats = [
  { val: "12K+",   lbl: "Active members" },
  { val: "98%",    lbl: "Plan adherence" },
  { val: "4,800+", lbl: "Workouts generated" },
  { val: "₹0",     lbl: "Cost, always" },
];

const cities = ["Kathmandu", "Pokhara", "Biratnagar", "Lalitpur", "Chitwan"];
const avatarInitials = ["RK", "PS", "AM", "NK", "+"];


export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className={styles.page}>

      {/* ── NAV ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo}>
            Fit<span>Mitra</span>
          </Link>
          <ul className={styles.navLinks}>
            {[
              ["#features", "Features"],
              ["#how",      "How it works"],
              ["#gallery",  "Gallery"],
              ["#stories",  "Stories"],
            ].map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
          <div className={styles.navRight}>
            <Link to="/login"  className={styles.navSignin}>Sign in</Link>
            <Link to="/signup" className={styles.navCta}>Get started free</Link>
          </div>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className={styles.drawer}>
            {[
              ["#features", "Features"],
              ["#how",      "How it works"],
              ["#gallery",  "Gallery"],
              ["#stories",  "Stories"],
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <Link to="/login"  onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link to="/signup" className={styles.drawerCta} onClick={() => setMenuOpen(false)}>
              Get started free →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        {/* Left copy */}
        <div className={styles.heroLeft}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            100% Free · No credit card needed
          </div>
          <h1 className={styles.heroH}>
            Your personal<br />
            <em>AI fitness coach</em><br />
            for Nepal
          </h1>
          <p className={styles.heroP}>
            FitMitra gives you personalised workout plans, smart meal suggestions,
            and real progress tracking — completely free, forever.
          </p>
          <div className={styles.heroActions}>
            <Link to="/signup" className={styles.btnPrimary}>Start for free →</Link>
            <a href="#how" className={styles.btnGhost}>See how it works</a>
          </div>
          <div className={styles.proof}>
            <div className={styles.avatars}>
              {avatarInitials.map((a, i) => (
                <div className={styles.av} key={i}>{a}</div>
              ))}
            </div>
            <p className={styles.proofText}>
              <strong>12,000+</strong> members already training smarter
            </p>
          </div>
        </div>

        {/* Right — image collage */}
        <div className={styles.heroImgs}>
          <div className={styles.imgMain}>
            <img 
            src="https://res.cloudinary.com/dir5oumz5/image/upload/v1775306228/download_1_zzed97.jpg" 
            alt="Person working out"/>
          </div>
          <div className={styles.imgSm}>
            <img src="https://res.cloudinary.com/dir5oumz5/image/upload/v1775306559/download_3_b5bhm5.jpg" 
            alt="Healthy meal" />
          </div>
          <div className={styles.imgTiny}>
            <img src="https://res.cloudinary.com/dir5oumz5/image/upload/v1775306451/download_2_eug9rz.jpg" 
            alt="Progress" />
          </div>
          <div className={styles.chip1}>
            <span>🔥</span>
            <div>
              <strong>−3.2 kg</strong>
              <span>avg. monthly loss</span>
            </div>
          </div>
          <div className={styles.chip2}>
            <span>✅</span>
            <div>
              <strong>Workout logged</strong>
              <span>+480 kcal burned</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS BAR ── */}
      <div className={styles.logosBar}>
        <div className={styles.logosInner}>
          <span className={styles.logosLabel}>Trusted by people across Nepal</span>
          <div className={styles.logosItems}>
            {cities.map((c) => (
              <span className={styles.logoCity} key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <section className={styles.statsStrip}>
        <div className={styles.statsInner}>
          {stats.map(({ val, lbl }) => (
            <div className={styles.statItem} key={lbl}>
              <div className={styles.statVal}>{val}</div>
              <div className={styles.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.features} id="features">
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionTag}>What FitMitra does</p>
            <h2 className={styles.sectionTitle}>
              Everything your body needs,<br />all in one place
            </h2>
            <p className={styles.sectionSub}>
              One platform that replaces your personal trainer, dietitian, and wellness app — at zero cost.
            </p>
          </div>

          <div className={styles.featGrid}>
            {features.map((f) => (
              <div
                key={f.title}
                className={`${styles.featCard} ${f.tall ? styles.featTall : ""}`}
              >
                <div className={styles.featImgWrap}>
                  <img className={styles.featImg} src={f.img} alt={f.imgAlt} />
                  <div className={styles.featImgOverlay} />
                </div>
                <div className={styles.featBody}>
                  <div className={styles.featIcon}>{f.icon}</div>
                  <h3 className={styles.featTitle}>{f.title}</h3>
                  <p className={styles.featDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.how} id="how">
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionTag}>Simple as it gets</p>
            <h2 className={styles.sectionTitle}>
              From sign-up to first sweat<br />in minutes
            </h2>
          </div>
          <div className={styles.howGrid}>
            {steps.map((s) => (
              <div className={styles.howCard} key={s.num}>
                <div className={styles.howImgWrap}>
                  <img src={s.img} alt={s.title} className={styles.howImg} />
                  <div className={styles.howNumBadge}>{s.num}</div>
                </div>
                <div className={styles.howBody}>
                  <span className={styles.howEmoji}>{s.emoji}</span>
                  <h3 className={styles.howTitle}>{s.title}</h3>
                  <p className={styles.howDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.howCta}>
            <Link to="/signup" className={styles.btnPrimary}>Start free now →</Link>
            <p className={styles.howNote}>No credit card. No trial. Always free.</p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className={styles.gallery} id="gallery">
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionTag}>Community</p>
            <h2 className={styles.sectionTitle}>Real people, real journeys</h2>
          </div>
        </div>
        <div className={styles.galleryGrid}>
          {gallery.map((g, i) => (
            <div className={styles.galleryItem} key={i}>
              <img src={g.img} alt={g.alt} />
              <div className={styles.galleryOverlay}>
                <span>{g.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={styles.stories} id="stories">
        <div className={styles.inner}>
          <div className={styles.testHeader}>
            <div>
              <p className={styles.sectionTag}>Real results</p>
              <h2 className={styles.sectionTitle}>
                The proof is in<br />the progress
              </h2>
            </div>
            <p className={styles.testNote}>
              Real members, real transformations — no paid endorsements.
            </p>
          </div>

          <div className={styles.testGrid}>
            {testimonials.map((t) => (
              <div className={styles.testCard} key={t.name}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.testQuote}>"{t.quote}"</p>
                <div className={styles.testResult}>{t.result}</div>
                <div className={styles.testAuthor}>
                  {/* Avatar: image with initials fallback */}
                  <div className={styles.testAvatarWrap}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className={styles.testAvatarImg}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div className={styles.testAvatarFallback}>{t.initials}</div>
                  </div>
                  <div>
                    <div className={styles.testName}>{t.name}</div>
                    <div className={styles.testRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className={styles.cta}>
        <img
          src="/images/cta-bg.jpg"
          alt=""
          className={styles.ctaBgImg}
          aria-hidden="true"
        />
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaInner}>
          <span className={styles.ctaTag}>🚀 Join 12,000+ members · Free forever</span>
          <h2 className={styles.ctaH}>Your best shape is<br />one decision away</h2>
          <p className={styles.ctaP}>
            No credit card. No trial period. No hidden charges. Just results.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/signup" className={styles.btnWhite}>Get started for free →</Link>
            <Link to="/login"  className={styles.btnOutlineW}>Already a member? Sign in</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLogo}>Fit<span>Mitra</span></Link>
          <p className={styles.footerTagline}>Built for Nepal. Free forever.</p>
          <div className={styles.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className={styles.footerCopy}>© 2025 FitMitra. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}