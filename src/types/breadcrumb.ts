import type { AnyRoute } from "@tanstack/react-router";

// Breadcrumb can be a string or a function that receives the route match
export type BreadcrumbFunction = (
	match: AnyRoute["types"]["allParams"],
) => string;
export type Breadcrumb = string | BreadcrumbFunction;

// Extend router context to include crumb
declare module "@tanstack/react-router" {
	interface RouteContext {
		crumb?: Breadcrumb;
	}
}