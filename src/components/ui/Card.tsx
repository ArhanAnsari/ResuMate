import clsx from "clsx";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  className?: string;
  variant?: "default" | "outlined" | "elevated" | "glass" | "premium";
}

export const Card = ({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) => {
  const variants: Record<string, string> = {
    default:
      "bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50",
    outlined: "bg-transparent border border-slate-200 dark:border-slate-700",
    elevated:
      "bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/60 dark:shadow-none border border-slate-100/80 dark:border-slate-700/30",
    glass:
      "bg-white/70 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/40",
    premium:
      "bg-violet-50 dark:bg-violet-900/20 border border-violet-200/60 dark:border-violet-700/30",
  };

  return (
    <View
      className={clsx("rounded-2xl p-4", variants[variant], className)}
      {...props}
    >
      {children}
    </View>
  );
};
