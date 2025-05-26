<script lang="ts">
	import { formatMoney } from '$lib/utils/helpers';
	import { fly } from 'svelte/transition';

	type Props = {
		book: {
			id: number;
			title: string;
			author: string;
			description: string | null;
			coverImageUrl: string | null;
			priceInCents: number;
		};
		addToCart?: (book: Props['book']) => void;
		viewMode?: 'grid' | 'list';
	};

	let { book, addToCart, viewMode = 'grid' }: Props = $props();
	let isHovered = $state(false);
</script>

{#if viewMode === 'list'}
	<!-- List View -->
	<div
		class="border-border group flex overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		role="button"
		tabindex="0"
	>
		<a href="/{book.id}" class="flex-shrink-0">
			<img
				src={book.coverImageUrl || 'https://placehold.co/300x450/e2e8f0/cbd5e0?text=No+Image'}
				alt="Cover of {book.title}"
				class="h-24 w-16 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</a>

		<div class="ml-4 flex flex-1 flex-col justify-between">
			<div>
				<h3 class="text-content mb-1 text-lg font-semibold">
					<a href="/{book.id}" class="hover:text-primary transition-colors duration-200">
						{book.title}
					</a>
				</h3>
				<p class="text-content-muted mb-2 text-sm">by {book.author}</p>
				{#if book.description}
					<p class="text-content-muted line-clamp-2 text-sm">
						{book.description}
					</p>
				{/if}
			</div>

			<div class="mt-4 flex items-center justify-between">
				<p class="text-primary text-xl font-bold">{formatMoney(book.priceInCents)}</p>
				<button
					onclick={() => addToCart && addToCart(book)}
					class="bg-primary hover:bg-primary-hover focus:ring-primary/50 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
				>
					Add to Cart
				</button>
			</div>
		</div>
	</div>
{:else}
	<!-- Grid View -->
	<div
		class="border-border group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		role="button"
		tabindex="0"
	>
		<!-- Book Cover -->
		<div class="relative overflow-hidden">
			<a href="/{book.id}" class="block">
				<img
					src={book.coverImageUrl || 'https://placehold.co/300x450/e2e8f0/cbd5e0?text=No+Image'}
					alt="Cover of {book.title}"
					class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
			</a>

			<!-- Overlay on hover -->
			{#if isHovered}
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
					in:fly={{ y: 20, duration: 200 }}
				></div>
			{/if}

			<!-- Quick add button on hover -->
			{#if isHovered}
				<button
					onclick={() => addToCart && addToCart(book)}
					class="text-primary hover:bg-primary absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg transition-all duration-200 hover:text-white"
					in:fly={{ y: 10, duration: 200, delay: 100 }}
				>
					Quick Add
				</button>
			{/if}
		</div>

		<!-- Book Info -->
		<div class="flex flex-grow flex-col p-4">
			<h3 class="text-content mb-1 line-clamp-2 text-lg font-semibold">
				<a href="/{book.id}" class="hover:text-primary transition-colors duration-200">
					{book.title}
				</a>
			</h3>
			<p class="text-content-muted mb-3 text-sm">by {book.author}</p>

			{#if book.description}
				<p class="text-content-muted mb-4 line-clamp-3 text-sm">
					{book.description}
				</p>
			{/if}

			<!-- Price and Cart Button -->
			<div class="mt-auto">
				<div class="mb-3 flex items-center justify-between">
					<p class="text-primary text-xl font-bold">{formatMoney(book.priceInCents)}</p>
				</div>

				<button
					onclick={() => addToCart && addToCart(book)}
					class="bg-primary hover:bg-primary-hover focus:ring-primary/50 w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2"
				>
					Add to Cart
				</button>
			</div>
		</div>
	</div>
{/if}
