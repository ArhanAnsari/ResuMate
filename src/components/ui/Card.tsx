import clsx from "clsx";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  className?: string; // Additional classes
  variant?: "default" | "outlined" | "elevated";
}

export const Card = ({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) => {
  const variants = {
    default: "bg-white dark:bg-slate-800",
    outlined: "bg-transparent border border-slate-200 dark:border-slate-700",
    elevated: "bg-white dark:bg-slate-800 shadow-sm",
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
