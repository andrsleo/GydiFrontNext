'use client';

import { Sparkles, Loader2, Check, X, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAiEnhance } from '../hooks/use-ai-enhance';

interface AiEnhanceButtonProps {
  field: 'title' | 'description';
  currentValue: string;
  onAccept: (enhanced: string) => void;
  disabled?: boolean;
  labels: {
    trigger: string;
    loading: string;
    badge: string;
    accept: string;
    discard: string;
    error: string;
  };
}

export function AiEnhanceButton({ field, currentValue, onAccept, disabled, labels }: AiEnhanceButtonProps) {
  const { enhance, isPending, result, error, reset } = useAiEnhance();

  const handleEnhance = () => {
    reset();
    enhance({ field, content: currentValue });
  };

  const handleAccept = () => {
    if (result) {
      onAccept(result);
      reset();
    }
  };

  return (
    <div className="space-y-3">
      {!result && (
        <button
          type="button"
          onClick={handleEnhance}
          disabled={isPending || disabled}
          className={cn(
            'group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5',
            'text-xs font-semibold tracking-wide transition-all duration-200',
            'border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50',
            'text-violet-600 shadow-sm shadow-violet-100',
            'hover:border-violet-300 hover:from-violet-100 hover:to-purple-100',
            'hover:shadow-md hover:shadow-violet-200/60 hover:text-violet-700',
            'hover:-translate-y-px active:translate-y-0',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
            'disabled:hover:shadow-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2',
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-r from-violet-400/10 via-purple-400/10 to-fuchsia-400/10"
          />

          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />
              <span>{labels.loading}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-violet-500 group-hover:scale-110 transition-transform duration-200" />
              <span>{labels.trigger}</span>
              <Wand2 className="h-3 w-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-0.5" />
            </>
          )}
        </button>
      )}

      {error && !isPending && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
          {labels.error}
        </p>
      )}

      {result && (
        <div className="relative rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/80 via-purple-50/40 to-fuchsia-50/30 p-4 shadow-sm shadow-violet-100">
          <span aria-hidden className="absolute left-0 inset-y-0 w-1 rounded-l-xl bg-gradient-to-b from-violet-400 to-purple-500" />

          <div className="pl-3 space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">
                  {labels.badge}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{result}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-violet-300/50 hover:shadow-md hover:shadow-violet-300/60 hover:brightness-110 transition-all duration-150 active:brightness-95"
              >
                <Check className="h-3 w-3" />
                {labels.accept}
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <X className="h-3 w-3" />
                {labels.discard}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
