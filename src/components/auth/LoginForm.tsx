import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!email) return "Email required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    if (!pw) return "Password required";
    if (pw.length < 6) return "Use at least 6 characters";
    return "";
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setLoading(true);

    setTimeout(() => {
      // Simulate success for demo
      setError("");
      setLoading(false);
      // Store user email in sessionStorage for demo purposes
      sessionStorage.setItem("loginEmail", email);
      navigate("/home");
    }, 500);
  };

  return (
    <form
      className="max-w-sm w-full mx-auto flex flex-col gap-4 bg-[#fffdf3] border-2 border-[#233f24] shadow-[0_2px_0_#ad9271] rounded-lg p-6 pixel-font"
      style={{ minWidth: 240 }}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <div className="text-2xl text-center mb-1 text-[#ad9271]">Sign In</div>
      <div>
        <Label htmlFor="login-email" className="text-[#8bb47e] mb-1">Email</Label>
        <Input
          id="login-email"
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
        <Label htmlFor="login-pw" className="text-[#8bb47e] mb-1">Password</Label>
        <Input
          id="login-pw"
          name="password"
          type="password"
          required
          value={pw}
          className="pixel-font"
          placeholder="Password"
          onChange={e => { setPw(e.target.value); setError(""); }}
        />
      </div>
      <Button
        type="submit"
        className="pixel-font bg-[#badc5b] border-[#233f24] border-2 rounded-lg text-[#233f24] text-lg hover:brightness-95 px-5 py-2 shadow-[0_2px_0_#ad9271] transition-all mt-1"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </Button>
      {error && <div className="text-destructive text-center text-sm mt-1">{error}</div>}
      <div className="text-center mt-2 text-sm">
        <span className="text-[#717171]">No account? </span>
        <Link to="/signup" className="underline text-[#ad9271] hover:text-[#7b6449] focus-visible:underline">Create one</Link>
      </div>
    </form>
  );
}
