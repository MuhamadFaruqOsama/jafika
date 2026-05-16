function trimSlash(value: string) {
  return value.replace(/\/+$/, "")
}

export function getAppBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL

  if (fromEnv && fromEnv.trim()) {
    return trimSlash(fromEnv.trim())
  }

  // return "http://localhost:3000"
  return "https://5nfmgtzk-3000.asse.devtunnels.ms/"
}
