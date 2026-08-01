import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const RouterCtx = createContext(null);

function getPath() {
  return window.location.pathname + window.location.search;
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, opts = {}) => {
    if (to === getPath()) return;
    if (opts.replace) {
      window.history.replaceState({}, "", to);
    } else {
      window.history.pushState({}, "", to);
    }
    setPath(to);
    if (!opts.preserveScroll) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, []);

  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>;
}

export function useRouter() {
  return useContext(RouterCtx);
}

export function useParams(pattern) {
  const { path } = useRouter();
  const pathname = path.split("?")[0];
  const pParts = pattern.split("/").filter(Boolean);
  const uParts = pathname.split("/").filter(Boolean);
  if (pParts.length !== uParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(":")) {
      params[pParts[i].slice(1)] = decodeURIComponent(uParts[i]);
    } else if (pParts[i] !== uParts[i]) {
      return null;
    }
  }
  return params;
}

export function matchPath(pattern, pathname) {
  const pParts = pattern.split("/").filter(Boolean);
  const uParts = pathname.split("/").filter(Boolean);
  if (pParts.length !== uParts.length) return false;
  return pParts.every((p, i) => p.startsWith(":") || p === uParts[i]);
}

export function Routes({ children }) {
  const { path } = useRouter();
  const pathname = path.split("?")[0];
  const arr = React.Children.toArray(children);
  let match = arr.find((child) => matchPath(child.props.path, pathname));
  if (!match) match = arr.find((child) => child.props.path === "*");
  return match || null;
}

export function Route({ element }) {
  return element;
}

export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(to);
        if (onClick) onClick(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function useSearchParams() {
  const { path, navigate } = useRouter();
  const query = path.split("?")[1] || "";
  const params = new URLSearchParams(query);
  const setParams = (obj, opts) => {
    const sp = new URLSearchParams(obj);
    const pathname = path.split("?")[0];
    const qs = sp.toString();
    navigate(pathname + (qs ? `?${qs}` : ""), { replace: true, preserveScroll: true, ...opts });
  };
  return [params, setParams];
}

export function useLocationPath() {
  const { path } = useRouter();
  return path.split("?")[0];
}
