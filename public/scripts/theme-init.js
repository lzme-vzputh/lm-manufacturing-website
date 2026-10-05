try {
  const savedTheme = localStorage.getItem('lm-theme');
  const preferredTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme;
} catch {
  document.documentElement.dataset.theme = 'light';
}
