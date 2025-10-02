import { Link, useMatches } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadCrumbItem {
	href: string;
	label: string;
}

export function Breadcrumbs() {
	const matches = useMatches();

	// Extract breadcrumb items from matched routes
	const breadcrumbItems: BreadCrumbItem[] = matches
		.filter((match) => match.context?.crumb)
		.map((match) => ({
			href: match.pathname,
			label:
				typeof match.context.crumb === "function"
					? match.context.crumb(match)
					: match.context.crumb,
		}));

	// Don't render if no breadcrumbs
	if (breadcrumbItems.length === 0) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{/* Home icon always first */}
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/dashboard">
							<HomeIcon size={16} aria-hidden="true" />
							<span className="sr-only">Home</span>
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{breadcrumbItems.map((item, index) => {
					const isLast = index === breadcrumbItems.length - 1;

					return (
						<div key={item.href} className="contents">
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={item.href}>{item.label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</div>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}