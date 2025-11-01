export default function sanitizeFileName(name: string) {
  return name
    .normalize("NFD") // split accented letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9-_]/g, "_"); // replace invalid characters
}
