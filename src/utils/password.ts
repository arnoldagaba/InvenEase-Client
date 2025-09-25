// Password validation patterns
const MIN_LENGTH = 8;
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[@$!%*?&]/;

// Strength configuration
const STRENGTH_LABELS = [
	"Very Weak",
	"Weak",
	"Fair",
	"Good",
	"Strong",
] as const;
const STRENGTH_COLORS = [
	"bg-red-500",
	"bg-orange-500",
	"bg-yellow-500",
	"bg-blue-500",
	"bg-green-500",
] as const;

export interface PasswordStrength {
	score: number;
	label: string;
	color: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
	if (!password) return { score: 0, label: "", color: "" };

	let score = 0;
	if (password.length >= MIN_LENGTH) score++;
	if (LOWERCASE_REGEX.test(password)) score++;
	if (UPPERCASE_REGEX.test(password)) score++;
	if (DIGIT_REGEX.test(password)) score++;
	if (SPECIAL_CHAR_REGEX.test(password)) score++;

	const finalScore = Math.min(score, 5);

	return {
		score: finalScore,
		label: STRENGTH_LABELS[finalScore - 1] || "",
		color: STRENGTH_COLORS[finalScore - 1] || "bg-gray-200",
	};
}