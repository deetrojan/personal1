// One fixed question. Correct answer remains server-only.
export const QUESTIONS = [
  {
    id: "wedding-month",
    question: "हमारी शादी किस महीने में हुई थी? 💍",
    options: ["अक्टूबर", "नवंबर", "दिसंबर", "जनवरी"],
    answer: "नवंबर"
  }
];

export function publicQuestion(question) {
  return {
    id: question.id,
    question: question.question,
    options: question.options
  };
}

export function normalizeAnswer(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en");
}
