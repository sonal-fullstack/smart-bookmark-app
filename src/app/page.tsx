"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <div style={styles.brand}>SmartBookmark</div>

        <h1 style={styles.heading}>
          Organize Your Web.
          <br />
          <span style={styles.gradientText}>The Smart Way.</span>
        </h1>

        <p style={styles.description}>
          Save, tag and manage your bookmarks securely in the cloud.
          Access them anytime, anywhere.
        </p>

        <button onClick={handleGoogleLogin} style={styles.button}>
          Continue with Google
        </button>

        <p style={styles.footer}>
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}

const styles: any = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen",
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent)",
    top: "-150px",
    right: "-150px",
    filter: "blur(80px)",
  },
  card: {
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.08)",
    padding: "60px 50px",
    borderRadius: "20px",
    width: "450px",
    textAlign: "center",
    color: "#ffffff",
    boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  brand: {
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "20px",
    opacity: 0.8,
  },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    lineHeight: "1.3",
    marginBottom: "20px",
  },
  gradientText: {
    background: "linear-gradient(90deg, #00dbde, #fc00ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  description: {
    fontSize: "15px",
    opacity: 0.8,
    marginBottom: "35px",
    lineHeight: "1.6",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    background: "linear-gradient(90deg, #00dbde, #fc00ff)",
    color: "#fff",
    transition: "0.3s",
  },
  footer: {
    marginTop: "25px",
    fontSize: "12px",
    opacity: 0.6,
  },
};