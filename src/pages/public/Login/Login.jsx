import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  loginService,
  resendVerificationService,
  verifyEmailService,
} from "../../../services/authService";
import { Eye, EyeOff, Loader2, AlertCircle, Mail } from "lucide-react";
import OtpInput from "../../../components/Otp/OtpInput";
import ThemeToggle from "../../../components/ThemeToggle/ThemeToggle";
import { tokenStore } from "../../../services/apiClient";
import styles from "./Login.module.css";

function resolveDestination(user, fallback) {
  const role = user.role ?? user.user_role ?? "";
  if (role === "admin") return "/admin";
  const hasOnboarded =
    user.hasCompletedOnboarding ?? user.has_completed_onboarding ?? false;
  return hasOnboarded ? fallback : "/onboarding";
}

const avatarInitials = ["RK", "PS", "AM", "NK", "+"];

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, error, clearError, user, isAuthenticated, isInitializing } =
    useContext(AuthContext);

  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading]       = useState(false);
  const [localError, setLocalError]     = useState(null);
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);

  const [showUnverifiedPrompt, setShowUnverifiedPrompt] = useState(false);
  const [resendLoading, setResendLoading]   = useState(false);
  const [resendSuccess, setResendSuccess]   = useState(false);
  const [otp, setOtp]                       = useState("");
  const [verifyLoading, setVerifyLoading]   = useState(false);
  const [verifyError, setVerifyError]       = useState(null);
  const [postVerifyMessage, setPostVerifyMessage] = useState(null);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => { clearError(); }, []); // eslint-disable-line

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !isInitializing) {
      if (!user.isVerified) return;
      navigate(resolveDestination(user, from), { replace: true });
    }
  }, [isAuthenticated, user, isInitializing, navigate, from]);

  useEffect(() => {
    if (localError) {
      const msg = (localError?.message || String(localError)).toLowerCase();
      setShowUnverifiedPrompt(
        msg.includes("verify your email") ||
        msg.includes("not verified") ||
        msg.includes("unverified")
      );
    } else {
      setShowUnverifiedPrompt(false);
    }
  }, [localError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name])
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim())            errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
    if (!formData.password)                errors.password = "Password is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setLocalError(null);
    try {
      const { token, user: rawUser } = await loginService(formData.email, formData.password);
      login(token, rawUser);
    } catch (err) {
      if (err?.status === 403) tokenStore.clearAll();
      setLocalError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      setValidationErrors({ email: "Please enter your email address" });
      return;
    }
    setResendLoading(true);
    setResendSuccess(false);
    setVerifyError(null);
    try {
      await resendVerificationService(formData.email);
      setResendSuccess(true);
      setShowUnverifiedPrompt(false);
      setLocalError(null);
    } catch (err) {
      setVerifyError(err.message || "Failed to resend verification code");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6)       { setVerifyError("Please enter the complete 6-digit code"); return; }
    if (!formData.email.trim()) { setVerifyError("Email is required."); return; }
    setVerifyLoading(true);
    setVerifyError(null);
    setPostVerifyMessage(null);
    try {
      await verifyEmailService(formData.email, otp);
      setOtp("");
      setResendSuccess(false);
      setLocalError(null);
      try {
        setIsLoading(true);
        const { token, user: rawUser } = await loginService(formData.email, formData.password);
        login(token, rawUser);
      } catch {
        setPostVerifyMessage("Email verified! Please sign in with your password to continue.");
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      setVerifyError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const displayError    = localError || error;
  const displayErrorMsg = displayError?.message || (typeof displayError === "string" ? displayError : null);

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
            <Link to="/login"  className={`${styles.navSignin} ${styles.navActive}`}>Sign in</Link>
            <Link to="/signup" className={styles.navCta}>Get started free</Link>
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
              Welcome<br />
              <em>back to</em><br />
              FitMitra
            </h1>

            <p className={styles.heroP}>
              Your AI fitness coach has been waiting. Pick up right where you left off —
              workouts, meals, and progress all in sync.
            </p>

            <div className={styles.heroFeatures}>
              {[
                "Track your progress",
                "Access your workout plans",
                "Stay motivated daily",
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
                <h2 className={styles.cardTitle}>Sign In</h2>
                <p className={styles.cardSub}>Welcome back to FitMitra</p>
              </div>

              {/* Post-verify success */}
              {postVerifyMessage && (
                <div className={styles.alertSuccess}>
                  <Mail size={15} className={styles.alertIcon} />
                  <p>{postVerifyMessage}</p>
                </div>
              )}

              {/* Generic error */}
              {displayErrorMsg && !showUnverifiedPrompt && !postVerifyMessage && (
                <div className={styles.alertError}>
                  <AlertCircle size={15} className={styles.alertIcon} />
                  <p>{displayErrorMsg}</p>
                </div>
              )}

              {/* Unverified prompt */}
              {showUnverifiedPrompt && (
                <div className={styles.alertWarning}>
                  <AlertCircle size={15} className={styles.alertIcon} />
                  <div>
                    <p>
                      <strong>Email Not Verified</strong><br />
                      Please verify your email. Send a new 6-digit code to{" "}
                      <strong>{formData.email}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className={styles.resendBtn}
                    >
                      {resendLoading
                        ? <><Loader2 size={13} className={styles.spin} /> Sending...</>
                        : <><Mail size={13} /> Send Code</>}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP entry after resend */}
              {resendSuccess && (
                <div className={styles.alertSuccess}>
                  <div style={{ width: "100%" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:"0.625rem", marginBottom:"1rem" }}>
                      <Mail size={15} style={{ marginTop:"2px", flexShrink:0 }} />
                      <p>Code sent to <strong>{formData.email}</strong>! Enter it below:</p>
                    </div>
                    <form onSubmit={handleVerifyOtp}>
                      <OtpInput
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={verifyLoading}
                        error={!!verifyError}
                      />
                      {verifyError && <p className={styles.otpError}>{verifyError}</p>}
                      <button
                        type="submit"
                        disabled={verifyLoading || otp.length !== 6}
                        className={styles.submitBtn}
                        style={{ marginTop:"1rem" }}
                      >
                        {verifyLoading
                          ? <><Loader2 size={15} className={styles.spin} /> Verifying...</>
                          : "Verify & Sign In →"}
                      </button>
                      <p className={styles.otpAlt}>
                        Prefer a separate page?{" "}
                        <Link to="/verify-email" state={{ email: formData.email }}>
                          Go to verification page
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              )}

              {/* Main login form */}
              <form onSubmit={handleSubmit} className={styles.form}>
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

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <div className={styles.passwordWrap}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password" name="password"
                      value={formData.password} onChange={handleChange}
                      disabled={isLoading} placeholder="Enter your password"
                      className={`${styles.input} ${validationErrors.password ? styles.inputError : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className={styles.eyeBtn}
                      disabled={isLoading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className={styles.fieldError}>{validationErrors.password}</p>
                  )}
                </div>

                <div className={styles.forgotRow}>
                  <Link to="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading
                    ? <><Loader2 size={16} className={styles.spin} /> Signing in...</>
                    : "Sign In →"}
                </button>
              </form>

              <p className={styles.switchText}>
                Don't have an account?{" "}
                <Link to="/signup" className={styles.switchLink}>Create account →</Link>
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