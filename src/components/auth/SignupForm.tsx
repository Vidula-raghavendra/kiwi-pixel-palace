import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  function validate() {
    if (!email) return "Email required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    if (!pw) return "Password required";
    if (pw.length < 6) return "Use at least 6 characters";
    if (pw !== pw2) return "Passwords must match";
    return "";
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    setError("");

    try {
      await signUp(email, pw);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-sm w-full mx-auto flex flex-col gap-4 bg-[#fffdf3] border-2 border-[#233f24] shadow-[0_2px_0_#ad9271] rounded-lg p-6 pixel-font"
      style={{ minWidth: 240 }}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <div className="text-2xl text-center mb-1 text-[#ad9271]">Create Account</div>
      <div>
        <Label htmlFor="signup-email" className="text-[#8bb47e] mb-1">Email</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          required
          value={email}
          className="pixel-font"
          placeholder="player@email.com"
          autoFocus
          onChange={e => { setEmail(e.target.value); setError(""); }}
        />
      </div>
      <div>
        <Label htmlFor="signup-pw" className="text-[#8bb47e] mb-1">Password</Label>
        <Input
          id="signup-pw"
          name="password"
          type="password"
          required
          value={pw}
          className="pixel-font"
          placeholder="Password"
          onChange={e => { setPw(e.target.value); setError(""); }}
        />
      </div>
      <div>
        <Label htmlFor="signup-pw2" className="text-[#8bb47e] mb-1">Confirm Password</Label>
        <Input
          id="signup-pw2"
          name="confirm"
          type="password"
          required
          value={pw2}
          className="pixel-font"
          placeholder="Confirm password"
          onChange={e => { setPw2(e.target.value); setError(""); }}
        />
      </div>
      <Button
        type="submit"
        className="pixel-font bg-[#badc5b] border-[#233f24] border-2 rounded-lg text-[#233f24] text-lg hover:brightness-95 px-5 py-2 shadow-[0_2px_0_#ad9271] transition-all mt-1"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign up"}
      </Button>
      {error && <div className="text-destructive text-center text-sm mt-1">{error}</div>}
      <div className="text-center mt-2 text-sm">
        <span className="text-[#717171]">Already a player? </span>
        <Link to="/login" className="underline text-[#ad9271] hover:text-[#7b6449] focus-visible:underline">Login instead</Link>
      </div>
    </form>
  );
}
