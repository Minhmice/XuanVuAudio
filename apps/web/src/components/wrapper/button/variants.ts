import { cva, type VariantProps } from "class-variance-authority";

export const wrapperButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-headline font-bold uppercase tracking-wider transition-colors duration-200",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-surface-high text-text-primary hover:bg-surface-highest",
        outline: "border-outline bg-transparent text-text-primary hover:bg-surface-low",
        ghost: "bg-transparent text-text-secondary hover:bg-surface-low hover:text-text-primary",
        accent:
          "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.25)] hover:brightness-110",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "border-0 bg-transparent p-0 font-normal normal-case tracking-normal text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[10px]",
        md: "h-10 px-4 text-[11px]",
        lg: "h-12 px-6 text-[12px]",
        icon: "h-10 w-10 shrink-0 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type WrapperButtonVariantProps = VariantProps<typeof wrapperButtonVariants>;
