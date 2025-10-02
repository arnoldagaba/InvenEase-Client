import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
	message?: string;
	showLogo?: boolean;
}

export const LoadingScreen = ({
	message = "Loading...",
	showLogo = true,
}: LoadingScreenProps) => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="text-center space-y-4 max-w-sm px-4">
				{showLogo && (
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-foreground">InvenEase</h1>
						<p className="text-sm text-muted-foreground">
							Inventory Management
						</p>
					</div>
				)}

				<div className="flex flex-col items-center space-y-3">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground animate-pulse">
						{message}
					</p>
				</div>
			</div>
		</div>
	);
};