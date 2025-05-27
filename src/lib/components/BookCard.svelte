<script lang="ts">
	import type { Book } from '$lib/server/db/schema';
	import { formatMoney } from '$lib/utils/helpers';
	import { scale } from 'svelte/transition';
	import { loader, plus } from './utils/Icons.svelte';

	type Props = {
		book: Book;
		addToCart?: (book: Props['book']) => void;
		viewMode?: 'grid' | 'list';
	};

	let { book, addToCart, viewMode = 'list' }: Props = $props();
	let isHovered = $state(false),
		isLoading = $state(false);

	async function handleAddToCart() {
		if (!addToCart) return;
		isLoading = true;
		addToCart(book);
		setTimeout(() => {
			isLoading = false;
		}, 500);
	}
</script>

{#if viewMode === 'list'}
	<!-- Enhanced List View -->
	<div
		class="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:ring-slate-200"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		role="button"
		tabindex="0"
	>
		<!-- Gradient overlay -->
		<div
			class="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>

		<div class="relative flex p-6">
			<!-- Book Cover with enhanced styling -->
			<div class="relative flex-shrink-0">
				<a href="/{book.id}" class="block">
					<div
						class="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
					>
						<img
							src={book.coverImageUrl || 'https://placehold.co/300x450/6366f1/white?text=📚'}
							alt="Cover of {book.title}"
							class="h-32 w-24 object-cover"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
					</div>
				</a>
			</div>

			<!-- Content -->
			<div class="ml-6 flex flex-1 flex-col justify-between">
				<div>
					<h3 class="mb-2 line-clamp-2 text-xl font-bold text-slate-900">
						<a href="/{book.id}" class="transition-colors duration-200 hover:text-blue-600">
							{book.title}
						</a>
					</h3>
					<p class="mb-3 text-sm font-medium text-slate-600">by {book.author}</p>
					{#if book.description}
						<p class="line-clamp-2 text-sm leading-relaxed text-slate-500">
							{book.description}
						</p>
					{/if}
				</div>

				<div class="mt-4 flex items-center justify-between">
					<div class="flex items-baseline space-x-1">
						<span class="text-2xl font-bold text-slate-900">{formatMoney(book.priceInCents)}</span>
					</div>

					<button
						onclick={handleAddToCart}
						disabled={isLoading}
						class="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<span class="relative z-10 flex items-center space-x-2">
							{#if isLoading}
								{@render loader({
									class: 'h-4 w-4 animate-spin',
									'aria-hidden': 'true'
								})}
								<span>Adding...</span>
							{:else}
								{@render plus({
									class: 'h-4 w-4',
									'aria-hidden': 'true'
								})}
								<span>Add to Cart</span>
							{/if}
						</span>
						<div
							class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
						></div>
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- Enhanced Grid View -->
	<div
		class="group relative h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 hover:shadow-2xl hover:ring-slate-200"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		role="button"
		tabindex="0"
	>
		<!-- Animated background gradient -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
		></div>

		<!-- Book Cover Section -->
		<div class="relative overflow-hidden">
			<a href="/{book.id}" class="block">
				<div class="relative aspect-[3/4] overflow-hidden">
					<img
						src={book.coverImageUrl || 'https://placehold.co/300x450/6366f1/white?text=📚'}
						alt="Cover of {book.title}"
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					/>
					<!-- Subtle overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
				</div>
			</a>

			<!-- Floating quick add button -->
			{#if isHovered}
				<div class="absolute right-4 top-4" in:scale={{ duration: 300, start: 0.8 }}>
					<button
						onclick={handleAddToCart}
						disabled={isLoading}
						class="group/quick relative overflow-hidden rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl"
					>
						{#if isLoading}
							{@render loader({
								class: 'h-5 w-5 animate-spin text-blue-600',
								'aria-hidden': 'true'
							})}
						{:else}
							{@render plus({
								class:
									'h-5 w-5 text-blue-600 transition-transform duration-300 group-hover/quick:scale-110',
								'aria-hidden': 'true'
							})}
						{/if}
					</button>
				</div>
			{/if}
		</div>

		<!-- Content Section -->
		<div class="relative flex flex-col p-6">
			<h3 class="mb-2 line-clamp-2 text-lg font-bold leading-tight text-slate-900">
				<a href="/{book.id}" class="transition-colors duration-200 hover:text-blue-600">
					{book.title}
				</a>
			</h3>

			<p class="mb-3 text-sm font-medium text-slate-600">by {book.author}</p>

			{#if book.description}
				<p class="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-slate-500">
					{book.description}
				</p>
			{/if}

			<!-- Price and Action Section -->
			<div class="mt-auto space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-baseline space-x-1">
						<span class="text-2xl font-bold text-slate-900">{formatMoney(book.priceInCents)}</span>
					</div>
				</div>

				<button
					onclick={handleAddToCart}
					disabled={isLoading}
					class="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="relative z-10 flex items-center justify-center space-x-2">
						{#if isLoading}
							{@render loader({
								class: 'h-4 w-4 animate-spin',
								'aria-hidden': 'true'
							})}
							<span>Adding to Cart...</span>
						{:else}
							{@render plus({
								class: 'h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-180',
								'aria-hidden': 'true'
							})}
							<span>Add to Cart</span>
						{/if}
					</span>
					<!-- Shimmer effect -->
					<div
						class="absolute inset-0 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
					></div>
				</button>
			</div>
		</div>
	</div>
{/if}
