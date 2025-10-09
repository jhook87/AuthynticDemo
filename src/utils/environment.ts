export const isGitHubCodespaces = (): boolean => {
  return !!(
    process.env.CODESPACE_NAME ||
    location.hostname.includes('github.dev') ||
    location.hostname.includes('app.github.dev')
  );
};

export const getBaseURL = (): string => {
  if (isGitHubCodespaces()) {
    return location.origin;
  }
  return '';
};
