export type MicErrorKind = "unsupported" | "denied" | "notFound" | "unavailable" | "unknown";

export function classifyMicError(error: unknown): MicErrorKind {
  const name = (error as { name?: string } | null)?.name ?? "";
  if (!globalThis.isSecureContext || !navigator.mediaDevices?.getUserMedia || name === "UnsupportedError") {
    return "unsupported";
  }
  if (["NotAllowedError", "PermissionDeniedError", "SecurityError"].includes(name)) return "denied";
  if (["NotFoundError", "DevicesNotFoundError", "OverconstrainedError"].includes(name)) return "notFound";
  if (["NotReadableError", "TrackStartError", "AbortError"].includes(name)) return "unavailable";
  return "unknown";
}

export async function openMic(deviceId?: string | null): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    const error = new Error("getUserMedia unavailable");
    error.name = "UnsupportedError";
    throw error;
  }
  return navigator.mediaDevices.getUserMedia({
    video: false,
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
    },
  });
}

export async function listMics(): Promise<MediaDeviceInfo[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "audioinput");
}
