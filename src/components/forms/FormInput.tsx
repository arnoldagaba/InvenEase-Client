import { CheckCircle, Loader2, type LucideIcon } from "lucide-react";
import { type ComponentProps, forwardRef, useId } from "react";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormInputProps extends ComponentProps<"input"> {
	label: string;
	icon?: LucideIcon;
	iconPosition?: "left" | "right";
	error?: string;
	helperText?: string;
	success?: boolean;
	loading?: boolean;
	required?: boolean;
	labelClassName?: string;
	inputClassName?: string;
	helperClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	(
		{
			label,
			icon: Icon,
			iconPosition = "right",
			error,
			helperText,
			success,
			loading,
			required,
			labelClassName,
			inputClassName,
			helperClassName,
			...props
		},
		ref,
	) => {
		const id = useId();
		const hasLeftIcon = Icon && iconPosition === "left";
		const hasRightIcon = Icon && iconPosition === "right";
		const showSuccessIcon = success && !error && !loading;
		const showLoadingIcon = loading && !error;

		const describedByIds = [];
		if (error) describedByIds.push(`${id}-error`);
		if (helperText) describedByIds.push(`${id}-helper`);

		return (
			<div className="space-y-2">
				<Label
					htmlFor={id}
					className={cn(
						error ? "text-destructive" : "",
						success && !error ? "text-green-600" : "",
						labelClassName,
					)}
				>
					{label}
					{required && <span className="text-destructive ml-1">*</span>}
				</Label>

				<div className="relative">
					<Input
						id={id}
						ref={ref}
						className={cn(
							"peer",
							hasLeftIcon ? "ps-9" : "",
							hasRightIcon || showSuccessIcon || showLoadingIcon ? "pe-9" : "",
							error
								? "border-destructive focus-visible:ring-destructive/20"
								: "",
							success && !error
								? "border-green-500 focus-visible:ring-green-500/20"
								: "",
							inputClassName,
						)}
						aria-invalid={!!error}
						aria-required={required}
						aria-describedby={
							describedByIds.length > 0 ? describedByIds.join(" ") : undefined
						}
						{...props}
					/>

					{hasLeftIcon && (
						<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
							<Icon size={16} aria-hidden="true" />
						</div>
					)}

					{(hasRightIcon || showSuccessIcon || showLoadingIcon) && (
						<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
							{showLoadingIcon && (
								<Loader2
									size={16}
									className="animate-spin"
									aria-hidden="true"
								/>
							)}

							{showSuccessIcon && (
								<CheckCircle
									size={16}
									className="text-green-500"
									aria-hidden="true"
								/>
							)}

							{hasRightIcon && !showSuccessIcon && !showLoadingIcon && (
								<Icon size={16} aria-hidden="true" />
							)}
						</div>
					)}
				</div>

				{error && (
					<p
						id={`${id}-error`}
						className={cn("text-destructive text-sm", helperClassName)}
						role="alert"
					>
						{error}
					</p>
				)}

				{helperText && (
					<p
						id={`${id}-helper`}
						className={cn("text-muted-foreground text-sm", helperClassName)}
					>
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

FormInput.displayName = "FormInput";
