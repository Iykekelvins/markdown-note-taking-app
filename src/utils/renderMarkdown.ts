import { marked } from 'marked';
import sanitize from 'sanitize-html';

const SANITIZE_OPTIONS = {
	allowedTags: [...sanitize.defaults.allowedTags, 'img'],
	allowedAttributes: {
		...sanitize.defaults.allowedAttributes,
		img: ['src', 'alt', 'title'],
	},
};

export async function renderMarkdown(content: string) {
	const html = await marked.parse(content);

	return sanitize(html, SANITIZE_OPTIONS);
}
