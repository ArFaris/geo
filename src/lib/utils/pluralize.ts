export function pluralizeViews(count: number, locale: 'ru' | 'en'): string {
  if (locale === 'en') {
    return `${count} ${count === 1 ? 'view' : 'views'}`;
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} просмотров`;
  }

  switch (lastDigit) {
    case 1:
      return `${count} просмотр`;
    case 2:
    case 3:
    case 4:
      return `${count} просмотра`;
    default:
      return `${count} просмотров`;
  }
}
