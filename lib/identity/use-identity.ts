"use client";

import { useCallback, useEffect, useState } from "react";

import type { IdentityRecord } from "./types";
import { identityService } from "./local-identity-service";

export function useIdentity() {
  const [record, setRecord] = useState<IdentityRecord>(identityService.getRecord());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecord(identityService.getRecord());
    setHydrated(true);
  }, []);

  const refresh = useCallback(() => {
    setRecord(identityService.getRecord());
  }, []);

  return { record, hydrated, refresh, service: identityService };
}
