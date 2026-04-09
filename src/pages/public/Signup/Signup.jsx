import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import ThemeToggle from "../../../components/ThemeToggle/ThemeToggle";
import styles from "./Signup.module.css";

const avatarInitials = ["RK", "PS", "AM", "NK", "+"];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors]       = useState({});
  const [passwordStrength, setPasswordStrength]       = useState(0);
  const [scrolled, setScrolled]                       = useState(false);
  const [menuOpen, setMenuOpen]                       = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "password") calculatePasswordStrength(value);
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: "" }));
    if (error) clearError();
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8)  strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password))   strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthClass = () => {
    if (passwordStrength <= 1) return styles.weak;
    if (passwordStrength <= 3) return styles.medium;
    return styles.strong;
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim())                         errors.name = "Name is required";
    else if (formData.name.trim().length < 2)          errors.name = "Name must be at least 2 characters";
    if (!formData.email.trim())                        errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))    errors.email = "Email is invalid";
    if (!formData.password)                            errors.password = "Password is required";
    else if (formData.password.length < 8)             errors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword)                     errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await signup(formData.name, formData.email, formData.password);
      navigate("/verify-email", {
        state: {
          email: formData.email,
          message: result.message || "Account created. Please verify your email.",
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const navItems = [
    ["/#features", "Features"],
    ["/#how",      "How it works"],
    ["/#gallery",  "Gallery"],
    ["/#stories",  "Stories"],
  ];

  return (
    <div className={styles.page}>

      {/* ── NAV (identical to Landing) ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo}>
            Fit<span>Mitra</span>
          </Link>
          <ul className={styles.navLinks}>
            {navItems.map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
          <div className={styles.navRight}>
            <ThemeToggle />
            <Link to="/login"  className={styles.navSignin}>Sign in</Link>
            <Link to="/signup" className={`${styles.navCta} ${styles.navActive}`}>Get started free</Link>
          </div>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div className={styles.drawer}>
            {navItems.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <div className={styles.drawerToggleRow}>
              <span className={styles.drawerToggleLabel}>Dark mode</span>
              <ThemeToggle />
            </div>
            <Link to="/login"  onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link to="/signup" className={styles.drawerCta} onClick={() => setMenuOpen(false)}>
              Get started free →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO SPLIT ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>

          {/* LEFT — landing-page style pitch */}
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

            <div className={styles.heroFeatures}>
              {[
                "AI-Powered Meal Plans",
                "Custom Workout Routines",
                "Real Progress Tracking",
                "Mental Wellness Support",
              ].map((f, i) => (
                <div className={styles.heroFeature} key={i}>
                  <div className={styles.heroFeatureCheck}>✓</div>
                  <span>{f}</span>
                </div>
              ))}
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

            <div className={styles.heroStats}>
              {[["12K+","Members"],["98%","Adherence"],["₹0","Cost"]].map(([v, l]) => (
                <div className={styles.heroStat} key={l}>
                  <span className={styles.heroStatVal}>{v}</span>
                  <span className={styles.heroStatLbl}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form card */}
          <div className={styles.heroRight}>
            <div className={styles.card}>

              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Join FitMitra</h2>
                <p className={styles.cardSub}>Start your personalised fitness journey</p>
              </div>

              {/* Error */}
              {error && (
                <div className={styles.alertError}>
                  <AlertCircle size={15} className={styles.alertIcon} />
                  <p>{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.form}>

                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleChange}
                    disabled={isLoading} placeholder="Enter your full name"
                    className={`${styles.input} ${validationErrors.name ? styles.inputError : ""}`}
                  />
                  {validationErrors.name && (
                    <p className={styles.fieldError}>{validationErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    disabled={isLoading} placeholder="you@example.com"
                    className={`${styles.input} ${validationErrors.email ? styles.inputError : ""}`}
                  />
                  {validationErrors.email && (
                    <p className={styles.fieldError}>{validationErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password" name="password"
                      value={formData.password} onChange={handleChange}
                      disabled={isLoading} placeholder="Create a strong password"
                      className={`${styles.input} ${validationErrors.password ? styles.inputError : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className={styles.eyeBtn}
                      disabled={isLoading}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className={styles.strengthRow}>
                      <div className={styles.strengthTrack}>
                        <div
                          className={`${styles.strengthFill} ${getStrengthClass()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`${styles.strengthText} ${getStrengthClass()}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                  )}
                  {validationErrors.password && (
                    <p className={styles.fieldError}>{validationErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword" name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleChange}
                      disabled={isLoading} placeholder="Re-enter your password"
                      className={`${styles.input} ${validationErrors.confirmPassword ? styles.inputError : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(p => !p)}
                      className={styles.eyeBtn}
                      disabled={isLoading}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className={styles.fieldError}>{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading
                    ? <><Loader2 size={16} className={styles.spin} /> Creating your profile...</>
                    : "Start Your Journey →"}
                </button>
              </form>

              <p className={styles.switchText}>
                Already have an account?{" "}
                <Link to="/login" className={styles.switchLink}>Sign in →</Link>
              </p>

              <p className={styles.termsText}>
                By creating an account, you agree to our{" "}
                <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP (identical to Landing) ── */}
      <section className={styles.statsStrip}>
        <div className={styles.statsInner}>
          {[
            { val: "12K+",   lbl: "Active members" },
            { val: "98%",    lbl: "Plan adherence" },
            { val: "4,800+", lbl: "Workouts generated" },
            { val: "₹0",     lbl: "Cost, always" },
          ].map(({ val, lbl }) => (
            <div className={styles.statItem} key={lbl}>
              <div className={styles.statVal}>{val}</div>
              <div className={styles.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER (identical to Landing) ── */}
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