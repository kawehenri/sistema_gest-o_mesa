import { createSeedState } from "./seed.js";

const STORAGE_KEY = "mesa-app-state-v1";

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.mesas && parsed.settings) return parsed;
    }
  } catch {
    /* ignore */
  }
  return createSeedState();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  persist();
  listeners.forEach((fn) => fn(state));
}

function can(user, cap) {
  if (!user) return false;
  const { role } = user;
  if (cap === "fila_read") return ["gerente", "hostess", "garcom"].includes(role);
  const map = {
    gerente: [
      "settings",
      "mesa_status",
      "reservas_write",
      "fila_write",
      "audit_read",
    ],
    hostess: ["mesa_status", "reservas_write", "fila_write"],
    garcom: ["mesa_status", "fila_read"],
  };
  return map[role]?.includes(cap);
}

export function canUser(user, cap) {
  return can(user, cap);
}

function appendAudit(entry) {
  state.audit.unshift({
    t: new Date().toISOString(),
    ...entry,
  });
  state.audit = state.audit.slice(0, 200);
}

export function dispatch(action) {
  const user = state.user;
  const { audit: auditPayload, ...rest } = action;
  const next = reducer(state, rest, user);
  if (next === state) return;
  state = next;
  if (auditPayload && user) {
    appendAudit({ user: user.email, role: user.role, ...auditPayload });
  }
  notify();
}

function reducer(s, action, user) {
  switch (action.type) {
    case "LOGIN":
      return { ...s, user: action.user };
    case "LOGOUT":
      return { ...s, user: null };
    case "RESET_DEMO":
      return { ...createSeedState(), user: null };
    case "UPDATE_SETTINGS": {
      if (!can(user, "settings")) return s;
      return {
        ...s,
        settings: { ...s.settings, ...action.patch },
      };
    }
    case "UPDATE_MESA": {
      if (!can(user, "mesa_status")) return s;
      const mesas = s.mesas.map((m) =>
        m.id === action.id ? { ...m, ...action.patch } : m
      );
      return { ...s, mesas };
    }
    case "ADD_RESERVA": {
      if (!can(user, "reservas_write")) return s;
      return { ...s, reservas: [...s.reservas, action.reserva] };
    }
    case "PATCH_RESERVA": {
      if (!can(user, "reservas_write")) return s;
      const reservas = s.reservas.map((r) =>
        r.id === action.id ? { ...r, ...action.patch } : r
      );
      return { ...s, reservas };
    }
    case "ADD_FILA": {
      if (!can(user, "fila_write")) return s;
      return { ...s, fila: [...s.fila, action.item] };
    }
    case "PATCH_FILA": {
      if (!can(user, "fila_write")) return s;
      const fila = s.fila.map((f) =>
        f.id === action.id ? { ...f, ...action.patch } : f
      );
      return { ...s, fila };
    }
    case "REMOVE_FILA": {
      if (!can(user, "fila_write")) return s;
      return { ...s, fila: s.fila.filter((f) => f.id !== action.id) };
    }
    case "REPLACE_FILA": {
      if (!can(user, "fila_write")) return s;
      return { ...s, fila: action.fila };
    }
    default:
      return s;
  }
}
