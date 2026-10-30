import { useState } from 'react';

const CodeReview = () => {
    const [code, setCode] = useState('');
    const [review, setReview] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!code.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError('');
        setReview('');

        try {
            const response = await fetch('/ai/get-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            if (!response.headers.get('content-type')?.includes('application/json')) {
                throw new Error(`The review API returned an unexpected response (HTTP ${response.status}).`);
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Unable to review this code.');
            }

            if (typeof result.response !== 'string' || !result.response.trim()) {
                throw new Error('The review service returned an empty response.');
            }

            setReview(result.response);
        }
        catch (requestError) {
            setError(requestError.message || 'Unable to reach the review service.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-[#29271f] sm:px-6 lg:py-16">
            <div className="mx-auto max-w-5xl">
                <header className="mb-9">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8e4d8] font-mono text-sm font-bold text-[#766541]" aria-hidden="true">
                            {'</>'}
                        </span>
                        <span className="text-sm font-semibold tracking-wide text-[#766541]">CODE REVIEWER</span>
                    </div>
                    <p className="mb-2 text-sm font-medium text-[#9a7941]">
                        A second pair of eyes for your code
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Make your code a little better.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#777368] sm:text-base">
                        Paste a snippet below and get clear, actionable feedback from AI.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="overflow-hidden rounded-2xl border border-[#e6e1d5] bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#eeeae1] px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-[#29271f]">Your code</h2>
                                <p className="mt-1 text-xs text-[#8a867b]">Paste or write code to review</p>
                            </div>
                            <span className="rounded-full border border-[#e6e1d5] bg-[#faf9f6] px-3 py-1 text-xs text-[#777368]">
                                Code input
                            </span>
                        </div>
                        <textarea
                            aria-label="Code to review"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            placeholder={'function add(a, b) {\n  return a + b;\n}'}
                            spellCheck="false"
                            className="min-h-72 w-full resize-y bg-[#fdfcf9] p-5 font-mono text-sm leading-7 text-[#39372f] outline-none placeholder:text-[#aaa69b] focus:ring-2 focus:ring-inset focus:ring-[#b79558]/40"
                        />
                        <div className="flex flex-col gap-3 border-t border-[#eeeae1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-[#8a867b]">For best results, include a complete function.</p>
                            <button
                                type="submit"
                                disabled={!code.trim() || isSubmitting}
                                className="inline-flex items-center justify-center rounded-lg bg-[#8a7043] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#745d37] focus:outline-none focus:ring-2 focus:ring-[#b79558] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Reviewing...' : 'Review code'}
                            </button>
                        </div>
                    </section>
                </form>

                <section
                    aria-live="polite"
                    className="mt-6 min-h-40 rounded-2xl border border-[#e6e1d5] bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1eee5] text-[#8a7043]" aria-hidden="true">
                            {'</>'}
                        </span>
                        <div>
                            <h2 className="font-semibold text-[#29271f]">Review results</h2>
                            <p className="text-xs text-[#8a867b]">
                                {isSubmitting ? 'Waiting for the AI review...' : 'Your feedback will appear here'}
                            </p>
                        </div>
                    </div>
                    {error ? (
                        <p role="alert" className="rounded-lg border border-[#efd2cc] bg-[#fff4f1] p-4 text-sm text-[#9c4437]">
                            {error}
                        </p>
                    ) : isSubmitting ? (
                        <div
                            role="status"
                            className="flex items-center gap-3 rounded-lg bg-[#faf9f6] p-4 text-sm text-[#777368]"
                        >
                            <span
                                aria-hidden="true"
                                className="h-5 w-5 animate-spin rounded-full border-2 border-[#ded9cd] border-t-[#8a7043]"
                            />
                            <span>Reviewing your code...</span>
                        </div>
                    ) : review ? (
                        <div className="whitespace-pre-wrap break-words rounded-lg bg-[#faf9f6] p-4 text-sm leading-7 text-[#454238]">
                            {review}
                        </div>
                    ) : (
                        <p className="rounded-lg border border-dashed border-[#ded9cd] bg-[#fdfcf9] p-4 text-sm text-[#8a867b]">
                            Submit your code to see the review.
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
};

export default CodeReview;
