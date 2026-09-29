const MAX_TITLE_LENGTH = 255;

export function extractTitle(markdown: string): string {
	const lines = markdown.split('\n').map((line) => line.trim());

	const heading = lines.find((line) => line.startsWith('# '));
	const title = heading
		? heading.slice(2).trim()
		: lines.find((line) => line !== '');

	return (title || 'Untitled').slice(0, MAX_TITLE_LENGTH);
}
