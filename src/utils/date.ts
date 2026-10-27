export function getWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const weekStr = weekNo < 10 ? '0' + weekNo : weekNo;
  return `${d.getUTCFullYear()}-W${weekStr}`;
}

export function getWeekRange(weekKeyString: string): { start: Date; end: Date } {
  const matches = weekKeyString.match(/^(\d{4})-W(\d{2})$/);
  if (!matches) return { start: new Date(), end: new Date() };
  const year = parseInt(matches[1], 10);
  const week = parseInt(matches[2], 10);
  
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  
  const start = new Date(ISOweekStart);
  const end = new Date(ISOweekStart);
  end.setDate(start.getDate() + 6);
  
  return { start, end };
}

export function formatWeekRange(weekKey: string): string {
  const { start, end } = getWeekRange(weekKey);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  return `${startStr} → ${endStr}`;
}

export function generateWeekDropdownOptions(currentWeekKey: string, range = 10): string[] {
  const options: string[] = [];
  const currentMatches = currentWeekKey.match(/^(\d{4})-W(\d{2})$/);
  if (!currentMatches) return [currentWeekKey];
  const year = parseInt(currentMatches[1], 10);
  const week = parseInt(currentMatches[2], 10);

  for (let i = -range; i <= range; i++) {
    let w = week + i;
    let y = year;
    if (w <= 0) {
      y -= 1;
      w = 52 + w;
    } else if (w > 52) {
      y += 1;
      w = w - 52;
    }
    const wStr = w < 10 ? '0' + w : w;
    options.push(`${y}-W${wStr}`);
  }
  return options;
}

export function shiftWeekKey(weekKeyString: string, delta: number): string {
  const matches = weekKeyString.match(/^(\d{4})-W(\d{2})$/);
  if (!matches) return weekKeyString;
  let year = parseInt(matches[1], 10);
  let week = parseInt(matches[2], 10);
  
  week += delta;
  if (week <= 0) {
    year -= 1;
    week = 52;
  } else if (week > 52) {
    year += 1;
    week = 1;
  }
  const wStr = week < 10 ? '0' + week : week;
  return `${year}-W${wStr}`;
}
