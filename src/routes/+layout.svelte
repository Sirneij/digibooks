<script lang="ts">
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';
	import '../app.css';
	import { cartState } from '$lib/states/carts.svelte';
	import { book, cart, docs, logo } from '$lib/components/utils/Icons.svelte';
	import { browser } from '$app/environment';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();
	let isMobileMenuOpen = $derived(false),
		scrollY = $state(0);

	// Close mobile menu when route changes
	$effect(() => {
		isMobileMenuOpen = false;
	});

	const handleScroll = () => (scrollY = window.scrollY);

	const navigation = [
		{ href: '/', label: 'Books', icon: 'book' },
		{ href: '/cart', label: 'Cart', icon: 'cart' },
		{ href: '/purchases', label: 'My Purchases', icon: 'purchases' }
	];

	function isActivePath(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	const hasViewTransitions = $state(browser && document.startViewTransition);

	onNavigate((navigation) => {
		if (!hasViewTransitions) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:window bind:scrollY onscroll={handleScroll} />

<div class="bg-surface text-content min-h-screen">
	<!-- Enhanced Header with Glassmorphism Effect -->
	<header
		class="sticky top-0 z-50 transition-all duration-300 {scrollY > 10 ? 'bg-white/80' : ''}"
		class:backdrop-blur-md={scrollY > 10}
		class:shadow-lg={scrollY > 10}
		class:bg-white={scrollY <= 10}
		class:shadow-sm={scrollY <= 10}
	>
		<nav class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo with enhanced styling -->
				<div class="flex items-center">
					<a
						href="/"
						class="text-primary hover:text-primary-hover group flex items-center space-x-2 transition-colors duration-300"
					>
						<!-- Book icon -->
						<div class="relative">
							{@render logo({
								class: 'h-8 w-8 transform transition-transform duration-300 group-hover:scale-110',
								'aria-hidden': 'true'
							})}
							<div
								class="bg-accent absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full"
							></div>
						</div>
						<span
							class="from-primary to-accent bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent"
						>
							DigiBooks
						</span>
					</a>
				</div>

				<!-- Desktop Navigation -->
				<div class="hidden items-center space-x-1 md:flex">
					{#each navigation as item (item.href)}
						{@const isActive = isActivePath(item.href)}
						<a
							href={item.href}
							class="group relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 {isActive
								? 'bg-primary/10'
								: ''}"
							class:text-primary={isActive}
							class:text-content-muted={!isActive}
							class:hover:text-primary={!isActive}
							class:hover:bg-surface-muted={!isActive}
						>
							<div class="flex items-center space-x-2">
								<!-- Navigation Icons -->
								{#if item.icon === 'book'}
									{@render book({ class: 'h-4 w-4', 'aria-hidden': 'true' })}
								{:else if item.icon === 'cart'}
									<div class="relative">
										{@render cart({ class: 'h-4 w-4', 'aria-hidden': 'true' })}
										{#if cartState.items.length > 0}
											<span
												class="bg-accent absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
											>
												{cartState.getTotalItems()}
											</span>
										{/if}
									</div>
								{:else if item.icon === 'purchases'}
									{@render docs({ class: 'h-4 w-4', 'aria-hidden': 'true' })}
								{/if}
								<span>{item.label}</span>
							</div>

							<!-- Active indicator -->
							{#if isActive}
								<div
									class="bg-primary absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 transform rounded-full"
									in:fly={{ y: 4, duration: 200 }}
								></div>
							{/if}
						</a>
					{/each}
				</div>

				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button
						onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
						class="text-content-muted hover:text-primary hover:bg-surface-muted focus:ring-primary/50 relative rounded-lg p-2 transition-colors duration-200 focus:ring-2 focus:outline-none"
						aria-label="Toggle menu"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							{#if isMobileMenuOpen}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							{/if}
						</svg>
					</button>
				</div>
			</div>

			<!-- Mobile Navigation Menu -->
			{#if isMobileMenuOpen}
				<div
					class="border-border mt-2 border-t pt-4 pb-4 md:hidden"
					in:fly={{ y: -10, duration: 200 }}
					out:fly={{ y: -10, duration: 150 }}
				>
					<div class="space-y-2">
						{#each navigation as item (item.href)}
							{@const isActive = isActivePath(item.href)}
							<a
								href={item.href}
								class="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 {isActive
									? 'bg-primary/10'
									: ''}"
								class:text-primary={isActive}
								class:text-content-muted={!isActive}
								class:hover:text-primary={!isActive}
								class:hover:bg-surface-muted={!isActive}
							>
								{#if item.icon === 'book'}
									{@render book({ class: 'h-5 w-5', 'aria-hidden': 'true' })}
								{:else if item.icon === 'cart'}
									<div class="relative">
										{@render cart({ class: 'h-5 w-5', 'aria-hidden': 'true' })}
										{#if cartState.items.length > 0}
											<span
												class="bg-accent absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white"
											>
												{cartState.getTotalItems()}
											</span>
										{/if}
									</div>
								{:else if item.icon === 'purchases'}
									{@render docs({ class: 'h-5 w-5', 'aria-hidden': 'true' })}
								{/if}
								<span>{item.label}</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</nav>
	</header>

	<!-- Main Content with Enhanced Spacing -->
	<main class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<div in:fade={{ duration: 300, delay: 100 }}>
			{@render children()}
		</div>
	</main>

	<!-- Enhanced Footer -->
	<footer
		class="border-border from-surface to-surface-muted relative mt-20 border-t bg-gradient-to-r"
	>
		<!-- Decorative top border -->
		<div
			class="from-primary via-accent to-secondary absolute top-0 right-0 left-0 h-1 bg-gradient-to-r"
		></div>

		<div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Brand Section -->
				<div class="md:col-span-2">
					<div class="mb-4 flex items-center space-x-2">
						{@render logo({ class: 'text-primary h-8 w-8', 'aria-hidden': 'true' })}
						<span class="text-primary text-xl font-bold">DigiBooks</span>
					</div>
					<p class="text-content-muted max-w-md text-sm leading-relaxed">
						Discover, purchase, and enjoy the world's best digital books. Your next great read is
						just a click away.
					</p>
				</div>

				<!-- Quick Links -->
				<div>
					<h3 class="text-content mb-4 font-semibold">Quick Links</h3>
					<ul class="space-y-2">
						{#each navigation as item (item.href)}
							<li>
								<a
									href={item.href}
									class="text-content-muted hover:text-primary text-sm transition-colors duration-200"
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Copyright -->
			<div class="border-border mt-8 border-t pt-8">
				<div class="flex flex-col items-center justify-between md:flex-row">
					<p class="text-content-muted text-sm">
						&copy; {new Date().getFullYear()} DigiBooks. All rights reserved.
					</p>
					<p class="text-content-muted mt-2 text-sm md:mt-0">
						Made with ❤️ for book lovers everywhere by <a
							href="https://johnowolabiidogun.dev"
							class="text-primary hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							John Owolabi Idogun
						</a>.
					</p>
				</div>
			</div>
		</div>
	</footer>
</div>
