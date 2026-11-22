"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Line = { text: string; bold?: boolean };
type Step =
  | "menu" | "email" | "username" | "password" | "confirm"
  | "lemail" | "lpassword" | "shell" | "busy";

const PROMPT = "V1YKsBuilds@web:~$";
const BLANK: Line = { text: "" };
const MENU: Line[] = [{ text: "[1] Register" }, { text: "[2] Login" }, BLANK];
const START: Line[] = [
  { text: PROMPT, bold: true },
  BLANK,
  { text: "Welcome to V1YKsBuilds." },
  BLANK,
  ...MENU,
];

const LABEL: Record<Step, string> = {
  menu: `${PROMPT} `,
  shell: `${PROMPT} `,
  email: "Enter email: ",
  lemail: "Enter email: ",
  username: "Enter username: ",
  password: "Enter password: ",
  lpassword: "Enter password: ",
  confirm: "Confirm password: ",
  busy: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_RE = /^[a-z0-9_]{3,20}$/;
const err = (m: string): Line => ({ text: `[ERROR] ${m}`, bold: true });
const cmd = (c: string): Line => ({ text: `${PROMPT} ${c}`, bold: true });
const friendly = (m: string) =>
  /database error/i.test(m)
    ? "Could not create account. That username may already be taken."
    : m;

/** Username of the signed-in user (null if nobody is signed in). */
async function whoAmI(): Promise<string | null> {
  const sb = getSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data: p } = await sb.from("profiles").select("username").eq("id", user.id).maybeSingle();
  if (p?.username) return String(p.username);
  const meta = user.user_metadata?.username;
  return typeof meta === "string" ? meta : "user";
}

/** Contracts screen. Rows come from Postgres via Supabase (RLS applies). */
async function loadContracts(username: string): Promise<Line[]> {
  const { data, error } = await getSupabase().from("contracts").select("username").order("id");
  if (error) return [cmd("contracts"), BLANK, err("Could not load contracts."), BLANK];
  const names = (data ?? []).map((r) => String(r.username));
  const listed = names.includes(username.toLowerCase());
  return [
    cmd("contracts"),
    BLANK,
    { text: "AUTHENTICATED", bold: true },
    BLANK,
    { text: `User: @${username}` },
    BLANK,
    { text: listed ? "You are listed in the contracts." : "You are not listed in the contracts." },
    BLANK,
    { text: "CONTRACTS", bold: true },
    { text: "---------" },
    BLANK,
    ...(names.length
      ? names.map((n, i) => ({ text: `[${String(i + 1).padStart(2, "0")}] @${n}` }))
      : [{ text: "No contracts yet." }]),
    BLANK,
  ];
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(START);
  const [step, setStep] = useState<Step>("menu");
  const [value, setValue] = useState("");
  const draft = useRef({ email: "", username: "", password: "" });
  const me = useRef("");
  const started = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const masked = step === "password" || step === "confirm" || step === "lpassword";

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, value, step]);

  useEffect(() => {
    if (step !== "busy") inputRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Returning visitor with a live session: skip straight to the contracts screen.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const name = await whoAmI();
        if (!alive || started.current || !name) return;
        me.current = name;
        const block = await loadContracts(name);
        if (!alive || started.current) return;
        setLines([{ text: `Welcome back, @${name}.` }, BLANK, ...block]);
        setStep("shell");
      } catch {
        /* not configured or offline: stay on the menu */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const add = (...l: Line[]) => setLines((p) => [...p, ...l]);
  const wipe = () => {
    draft.current = { email: "", username: "", password: "" };
  };

  function startRegister(extra: Line[] = []) {
    wipe();
    setLines([cmd("register"), BLANK, ...extra]);
    setStep("email");
  }

  function startLogin(extra: Line[] = []) {
    wipe();
    setLines([cmd("login"), BLANK, ...extra]);
    setStep("lemail");
  }

  function failRegister(message: string) {
    startRegister([err(message), BLANK, { text: "Registration failed. Try again." }, BLANK]);
  }

  async function submit() {
    if (step === "busy") return;
    started.current = true;
    const raw = value;
    const text = masked ? raw : raw.trim();
    const echo: Line = { text: LABEL[step] + (masked ? "*".repeat(raw.length) : text) };
    setValue("");

    if (step === "menu") {
      if (text === "1") return startRegister();
      if (text === "2") return startLogin();
      if (text) add(echo, err(`Unknown option: ${text}`), { text: "Type 1 or 2." }, BLANK);
      return;
    }

    if (step === "shell") {
      const c = text.toLowerCase();
      if (!c) return;
      if (c === "clear") return setLines([]);
      if (c === "help") {
        return add(
          echo, BLANK,
          { text: "Commands:" },
          { text: "  contracts   show the contracts list" },
          { text: "  logout      sign out" },
          { text: "  clear       clear the screen" },
          BLANK,
        );
      }
      if (c === "contracts") {
        setStep("busy");
        try {
          add(...(await loadContracts(me.current)));
        } catch {
          add(cmd("contracts"), BLANK, err("Could not load contracts."), BLANK);
        }
        return setStep("shell");
      }
      if (c === "logout") {
        setStep("busy");
        try {
          await getSupabase().auth.signOut();
        } catch {
          /* ignore: local state is cleared below either way */
        }
        me.current = "";
        setLines([cmd("logout"), BLANK, { text: "[OK] Logged out.", bold: true }, BLANK, ...MENU]);
        return setStep("menu");
      }
      return add(echo, err(`Unknown command: ${text}`), { text: "Type help for commands." }, BLANK);
    }

    if (step === "lemail") {
      if (!EMAIL_RE.test(text)) return add(echo, err("Enter a valid email address."));
      draft.current.email = text;
      add(echo);
      return setStep("lpassword");
    }

    if (step === "lpassword") {
      if (!raw) return add(echo, err("Enter your password."));
      add(echo, BLANK, { text: "Authenticating..." });
      setStep("busy");
      const email = draft.current.email;
      wipe();
      try {
        const { error } = await getSupabase().auth.signInWithPassword({ email, password: raw });
        if (error) {
          const msg =
            error.code === "email_not_confirmed"
              ? "Email not confirmed. Check your inbox."
              : "Invalid credentials.";
          return startLogin([err(msg), BLANK]);
        }
        const name = (await whoAmI()) ?? "user";
        me.current = name;
        setLines([
          cmd("login"),
          BLANK,
          { text: "[OK] Authentication successful.", bold: true },
          BLANK,
          { text: `Welcome back, @${name}.` },
          BLANK,
          ...(await loadContracts(name)),
        ]);
        return setStep("shell");
      } catch (e) {
        return startLogin([err(e instanceof Error ? e.message : "Something went wrong."), BLANK]);
      }
    }

    if (step === "email") {
      if (!EMAIL_RE.test(text)) return add(echo, err("Enter a valid email address."));
      draft.current.email = text;
      add(echo);
      return setStep("username");
    }

    if (step === "username") {
      const name = text.toLowerCase();
      if (!USER_RE.test(name))
        return add(echo, err("Username must be 3-20 characters: letters, numbers or underscore."));
      draft.current.username = name;
      add({ text: LABEL.username + name });
      return setStep("password");
    }

    if (step === "password") {
      if (raw.length < 8) return add(echo, err("Password must be at least 8 characters."));
      draft.current.password = raw;
      add(echo);
      return setStep("confirm");
    }

    // step === "confirm"
    if (raw !== draft.current.password) return failRegister("Passwords do not match.");
    add(echo, BLANK, { text: "Creating account..." });
    setStep("busy");
    const { email, username, password } = draft.current;
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) return failRegister(friendly(error.message));
      wipe();
      add(
        BLANK,
        { text: "[OK] Account created.", bold: true },
        ...(data.session ? [] : [{ text: "Check your email to confirm your account, then choose Login." }]),
        BLANK,
        ...MENU,
      );
      setStep("menu");
    } catch (e) {
      failRegister(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  const boldLabel = step === "menu" || step === "shell";

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-live="polite"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      className="relative min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain px-3 py-2 text-[15px] leading-[22px] [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin]"
    >
      {lines.map((l, i) => (
        <div key={i} className={`min-h-[22px] whitespace-pre-wrap break-words ${l.bold ? "font-bold" : ""}`}>
          {l.text || "\u00a0"}
        </div>
      ))}

      <div className="relative min-h-[22px] whitespace-pre-wrap break-all">
        {step !== "busy" && (
          <>
            <span className={boldLabel ? "font-bold" : ""}>{LABEL[step]}</span>
            {masked ? "*".repeat(value.length) : value}
            <span className="cursor inline-block h-[1.15em] w-[0.6em] translate-y-[3px] bg-white" />
          </>
        )}
        <input
          ref={inputRef}
          value={value}
          readOnly={step === "busy"}
          type={masked ? "password" : "text"}
          inputMode={step === "menu" ? "numeric" : step === "email" || step === "lemail" ? "email" : "text"}
          enterKeyHint="go"
          autoComplete={
            step === "lpassword" ? "current-password"
            : step === "email" || step === "lemail" ? "email"
            : step === "username" ? "username"
            : "off"
          }
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label={LABEL[step].replace(/[:$]\s*$/, "") || "Terminal input"}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void submit();
            }
          }}
          className="absolute inset-0 h-full w-full cursor-text bg-transparent text-base opacity-0 caret-transparent outline-none"
        />
      </div>
    </div>
  );
}
