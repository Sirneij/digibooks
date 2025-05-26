<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();
</script>

<div class="bg-surface text-content min-h-screen">
	<header class="sticky top-0 z-50 bg-white shadow-sm">
		<nav class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<a href="/" class="text-primary text-2xl font-bold">DigiBooks</a>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/"
						class="hover:bg-surface-muted rounded-md px-3 py-2 text-sm font-medium"
						class:text-primary={page.url.pathname === '/'}
						class:text-content-muted={page.url.pathname !== '/'}
					>
						Books
					</a>
					<a
						href="/cart"
						class="hover:bg-surface-muted rounded-md px-3 py-2 text-sm font-medium"
						class:text-primary={page.url.pathname === '/cart'}
						class:text-content-muted={page.url.pathname !== '/cart'}
					>
						Cart
					</a>
					<a
						href="/my-purchases"
						class="hover:bg-surface-muted rounded-md px-3 py-2 text-sm font-medium"
						class:text-primary={page.url.pathname === '/my-purchases'}
						class:text-content-muted={page.url.pathname !== '/my-purchases'}
					>
						My Purchases
					</a>
				</div>
			</div>
		</nav>
	</header>
	<main class="container mx-auto p-4 sm:p-6 lg:p-8">
		{@render children()}
	</main>

	<footer class="border-border mt-12 border-t bg-white">
		<div class="text-text-muted container mx-auto px-4 py-6 text-center text-sm sm:px-6 lg:px-8">
			&copy; {new Date().getFullYear()} DigiBooks. All rights reserved.
		</div>
	</footer>
</div>
