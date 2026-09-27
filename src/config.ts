function requireEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		console.error(`Missing environment variable: ${name}`);
		process.exit(1);
	}
	return value;
}

// export const DATABASE_URL = requireEnv('DATABASE_URL');
export const PORT = Number(process.env.PORT) || 3000;
