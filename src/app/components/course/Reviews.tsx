"use client";

type Review = {
  id: string;
  name: string;
  text: string;
  stars: 3 | 4 | 5;
};

const STATIC_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Ayesha K.",
    text:
      "Very concise lessons. The sequential unlock kept me focused and I finished the course in 3 days!",
    stars: 5,
  },
  {
    id: "r2",
    name: "Tanvir R.",
    text:
      "Great overview with practical examples. PDF notes were handy for revision.",
    stars: 4,
  },
  {
    id: "r3",
    name: "Nabila S.",
    text:
      "Solid starter course — easy to follow and well structured modules/lectures.",
    stars: 5,
  },
];

export default function Reviews() {
  return (
    <section aria-labelledby="reviews" className="rounded-2xl border p-5">
      <h2 id="reviews" className="text-lg font-semibold mb-4">
        Reviews (static)
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2">
        {STATIC_REVIEWS.map((r) => (
          <li key={r.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.name}</span>
              <span aria-label={`${r.stars} out of 5`} className="text-yellow-500">
                {"★".repeat(r.stars)}
                <span className="text-gray-300">{"★".repeat(5 - r.stars)}</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
