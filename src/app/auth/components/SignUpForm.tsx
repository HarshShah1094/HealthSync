"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SignUpFormProps {}

export default function SignUpForm({}: SignUpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'patient' // Default role
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to sign up');
      }

      const data = await res.json();

      // Store user info in localStorage
      localStorage.setItem('userName', data.name || formData.fullName);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role);

      // Redirect based on role
      if (data.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard/patient');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      backgroundImage: "url('/ChatGPT%20Image%20May%2018, 2025, 11_44_41 PM.png')", // Add background image
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      color: "#fff"
    }}>
      <div className="signup-container" style={{
        background: "rgba(30, 32, 38, 0.85)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        borderRadius: 24,
        padding: "48px 40px 32px 40px",
        width: 400,
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div className="logo" style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
          <div className="logo-icon" style={{width: 32, height: 32, background: "#6c63ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <span style={{color: "#fff", fontSize: 22, fontWeight: "bold", fontFamily: "Arial, sans-serif"}}>✦</span>
          </div>
          <span className="logo-text" style={{color: "#6c63ff", fontSize: 22, fontWeight: 700, letterSpacing: 1}}>HealthSync</span>
        </div>
        <div className="signup-title" style={{color: "#fff", fontSize: "2.2rem", fontWeight: 700, marginBottom: 24, textAlign: "center"}}>Sign Up</div>
        {error && (
          <div style={{
            padding: '12px',
            background: '#f87171',
            color: '#fff',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
            width: '100%',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <form style={{width: "100%"}} onSubmit={handleSubmit}>
          <div>
            <label className="input-label" htmlFor="fullName" style={{color: "#d1d1d1", fontSize: "0.98rem", marginBottom: 8, marginTop: 18, fontWeight: 500, display: "block"}}>Enter your Name</label>
            <div style={{width: "100%", marginBottom: 16}}>
              <div className="input-wrapper" style={{display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 24, border: "1px solid #444", padding: "0 16px", height: 44}}>
                <span className="input-icon" style={{color: "#bdbdbd", marginRight: 10, fontSize: "1.1rem"}}>👤</span>
                <input type="text" id="fullName" name="fullName" placeholder="Your Name" value={formData.fullName} onChange={handleChange} required style={{background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "1rem", width: "100%", padding: "10px 0"}} />
              </div>
            </div>
          </div>
          <div>
            <label className="input-label" htmlFor="email" style={{color: "#d1d1d1", fontSize: "0.98rem", marginBottom: 8, fontWeight: 500, display: "block"}}>Enter your E-mail</label>
            <div style={{width: "100%", marginBottom: 16}}>
              <div className="input-wrapper" style={{display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 24, border: "1px solid #444", padding: "0 16px", height: 44}}>
                <span className="input-icon" style={{color: "#bdbdbd", marginRight: 10, fontSize: "1.1rem"}}>@</span>
                <input type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required style={{background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "1rem", width: "100%", padding: "10px 0"}} />
              </div>
            </div>
          </div>
          <div>
            <label className="input-label" htmlFor="password" style={{color: "#d1d1d1", fontSize: "0.98rem", marginBottom: 8, fontWeight: 500, display: "block"}}>Set your Password</label>
            <div style={{width: "100%", marginBottom: 16}}>
              <div className="input-wrapper" style={{display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 24, border: "1px solid #444", padding: "0 16px", height: 44}}>
                <span className="input-icon" style={{color: "#bdbdbd", marginRight: 10, fontSize: "1.1rem"}}>🔑</span>
                <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "1rem", width: "100%", padding: "10px 0"}} />
              </div>
            </div>
          </div>
           <div>
            <label className="input-label" htmlFor="role" style={{color: "#d1d1d1", fontSize: "0.98rem", marginBottom: 8, fontWeight: 500, display: "block"}}>Select Role</label>
            <div style={{width: "100%", marginBottom: 24}}>
              <div className="input-wrapper" style={{display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 24, border: "1px solid #444", padding: "0 16px", height: 44}}>
                 <span className="input-icon" style={{color: "#bdbdbd", marginRight: 10, fontSize: "1.1rem"}}>👥</span>
                <select id="role" name="role" value={formData.role} onChange={handleChange} required style={{background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "1rem", width: "100%", padding: "10px 0", appearance: 'none'}}> 
                  <option value="patient" style={{backgroundColor: "#2d2d3a", color: "#fff"}}>Patient</option>
                  <option value="doctor" style={{backgroundColor: "#2d2d3a", color: "#fff"}}>Doctor</option>
                </select>
              </div>
            </div>
          </div>
          <button className="signup-btn" type="submit" style={{width: "100%", background: "#6c63ff", color: "#fff", border: "none", borderRadius: 24, padding: "12px 0", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"}}>Sign Up</button>
        </form>
        <div className="signin-link" style={{color: "#bdbdbd", fontSize: "0.98rem", textAlign: "center", marginTop: 24}}>
          Already have an Account?{' '}
          <Link href="/auth/signin" style={{color: "#fff", textDecoration: "none", marginLeft: 4}}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
