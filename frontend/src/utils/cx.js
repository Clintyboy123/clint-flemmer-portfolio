// Join class names, skipping falsy ones: cx('a', on && 'in') -> 'a in'
export default function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
