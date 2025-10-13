"use client";

import { useEffect, useState } from "react";

export function Version({ className = "" }) {
  const [version, setVersion] = useState("0.1.0"); // fallback version

  useEffect(() => {
    // Try to get version from package.json
    fetch('/api/version')
      .then(res => res.json())
      .then(data => setVersion(data.version))
      .catch(() => {
        // Fallback: use environment variable or hardcoded
        setVersion(process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0");
      });
  }, []);

  return (
    <p className={`text-xs text-muted-foreground font-montserrat ${className}`}>
      V.{version}
    </p>
  );
}

export default Version;
