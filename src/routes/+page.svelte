<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import { addToCart } from '$lib/utils/helpers';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let sortBy = $state('featured');
	let viewMode = $state<'grid' | 'list'>('grid'); // 'grid' or 'list'

	// Filter and sort books
	const filteredBooks = $derived(
		data.books
			?.filter((book) => {
				if (!searchQuery) return true;
				return (
					book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					book.author.toLowerCase().includes(searchQuery.toLowerCase())
				);
			})
			.sort((a, b) => {
				switch (sortBy) {
					case 'price-low':
						return a.priceInCents - b.priceInCents;
					case 'price-high':
						return b.priceInCents - a.priceInCents;
					case 'title':
						return a.title.localeCompare(b.title);
					case 'author':
						return a.author.localeCompare(b.author);
					default:
						return a.id - b.id;
				}
			}) || []
	);
</script>

<svelte:head>
	<title>Books - DigiBooks</title>
</svelte:head>

<div class="space-y-8">
	<!-- Clean Header -->
	<div class="text-center">
		<h1 class="text-content mb-3 text-4xl font-bold">Digital Books</h1>
		<p class="text-content-muted">Discover your next great read</p>
	</div>

	<!-- Minimal Search & Sort -->
	<div class="mx-auto max-w-2xl space-y-4">
		<!-- Search -->
		<div class="relative">
			<svg
				class="text-content-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				bind:value={searchQuery}
				type="text"
				placeholder="Search books or authors..."
				class="border-border focus:border-primary focus:ring-primary w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1"
			/>
		</div>

		<!-- Sort and View Controls -->
		<div class="flex items-center justify-between">
			<p class="text-content-muted text-sm">
				{filteredBooks.length} books
			</p>

			<div class="flex items-center space-x-3">
				<!-- Sort Dropdown -->
				<select
					bind:value={sortBy}
					class="border-border focus:border-primary focus:ring-primary rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1"
				>
					<option value="featured">Featured</option>
					<option value="title">Title</option>
					<option value="author">Author</option>
					<option value="price-low">Price ↑</option>
					<option value="price-high">Price ↓</option>
				</select>

				<!-- View Toggle -->
				<div class="border-border flex rounded-lg border bg-white p-1">
					<button
						onclick={() => (viewMode = 'grid')}
						class="rounded px-2 py-1 text-sm transition-all duration-200"
						class:bg-primary={viewMode === 'grid'}
						class:text-white={viewMode === 'grid'}
						class:text-content-muted={viewMode !== 'grid'}
						aria-label="Grid view"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							/>
						</svg>
					</button>
					<button
						onclick={() => (viewMode = 'list')}
						class="rounded px-2 py-1 text-sm transition-all duration-200"
						class:bg-primary={viewMode === 'list'}
						class:text-white={viewMode === 'list'}
						class:text-content-muted={viewMode !== 'list'}
						aria-label="List view"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Books Grid/List -->
	{#if filteredBooks.length > 0}
		<div
			class="grid gap-6 transition-all duration-300"
			class:grid-cols-1={viewMode === 'list'}
			class:sm:grid-cols-2={viewMode === 'grid'}
			class:md:grid-cols-3={viewMode === 'grid'}
			class:lg:grid-cols-4={viewMode === 'grid'}
			class:xl:grid-cols-5={viewMode === 'grid'}
		>
			{#each filteredBooks as book, index (book.id)}
				<div in:fly={{ y: 20, duration: 300, delay: index * 30 }}>
					<BookCard {book} {viewMode} addToCart={() => addToCart(book)} />
				</div>
			{/each}
		</div>
	{:else if searchQuery}
		<!-- No Results -->
		<div class="py-16 text-center">
			<p class="text-content mb-2">No books found for "{searchQuery}"</p>
			<button onclick={() => (searchQuery = '')} class="text-primary text-sm hover:underline">
				Clear search
			</button>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="py-16 text-center">
			<p class="text-content-muted">No books available at the moment</p>
		</div>
	{/if}
</div>
